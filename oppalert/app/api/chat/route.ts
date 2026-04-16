import { createOpenAI } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { getUserFromRequest } from '@/lib/auth';
import { query } from '@/lib/db';
import { opportunityService } from '@/lib/services/opportunity-service';
import { NextRequest, NextResponse } from 'next/server';

// Set to true to use the Groq API
export const maxDuration = 30;

const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    // Check for API key first
    if (!process.env.GROQ_API_KEY) {
      console.error('OppBot Error: GROQ_API_KEY is not defined in environment variables.');
      return new Response(JSON.stringify({ 
        error: 'API Configuration Missing', 
        details: 'The Groq API key is not configured on the server. Please check environment variables.' 
      }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { messages } = await req.json();
    const user = getUserFromRequest(req);

    const result = await streamText({
      model: groq('llama-3.1-8b-instant'), // Using an ultra-fast, responsive model
      system: `You are OppBot, the official Virtual Assistant for OppAlert.
OppAlert is an opportunity discovery platform for students, graduates, and founders in Africa.
Your goal is to help users find opportunities (scholarships, remote jobs, fellowships) and help organizers manage their events.

CURRENT USER CONTEXT:
${user ? `- Status: Logged In\n- User ID: ${user.id}\n- Plan: ${user.plan}\n- Email: ${user.email}` : '- Status: Guest User'}

GUIDELINES:
1. Be professional, encouraging, and concise.
2. Use tools to provide real-time data when a user asks for opportunities or event stats.
3. If a user is not logged in, suggest they sign up to save opportunities.
4. If an organizer asks about their events, use the 'get_my_events' tool.
5. If someone asks to host an event, explain that they can do so in the 'Organizer Dashboard'.
6. ALWAYS maintain a helpful tone.

OPPALERT BRANDING:
- Colors: Emerald, Dark/Night mode.
- Vibe: Premium, Fast, Reliable.`,
      messages,
      maxSteps: 5, // Allow the model to call tools and reflect on results
      tools: {
        search_opportunities: tool({
          description: 'Search for scholarships, remote jobs, fellowships, or grants across all providers.',
          parameters: z.object({
            query: z.string().describe('The search query (e.g., "scholarships for Nigerians")'),
            category: z.string().optional().describe('The category (e.g., "Scholarship", "Job")'),
            limit: z.number().optional().default(5),
          }),
          execute: async ({ query: searchQuery, category, limit }) => {
            try {
              const results = await opportunityService.searchAll({
                keyword: searchQuery,
                category: category as any,
                limit
              });
              
              if (!results || results.length === 0) {
                return "No opportunities found at the moment. Try a broader search term.";
              }
              
              return results.slice(0, limit);
            } catch (err) {
              console.error('Search tool error:', err);
              return "The search service is temporarily experiencing issues. Please try again in a few moments.";
            }
          },
        }),
        get_my_events: tool({
          description: 'Get a list of events created by the logged-in organizer.',
          parameters: z.object({}),
          execute: async () => {
            try {
              if (!user) return "Please log in to see your events.";
              const { rows } = await query(
                'SELECT id, title, slug, current_registrations, max_capacity FROM events WHERE organizer_id = $1',
                [user.id]
              );
              return rows.length > 0 ? rows : "You haven't created any events yet.";
            } catch (err) {
              return "Error fetching your events. Please check your connection.";
            }
          },
        }),
        get_event_registrations: tool({
          description: 'Get details about registrations for a specific event.',
          parameters: z.object({
            event_id: z.string().describe('The UUID of the event'),
          }),
          execute: async ({ event_id }) => {
            try {
              if (!user) return "Please log in.";
              // Security check: Ensure the event belongs to this organizer
              const eventCheck = await query(
                'SELECT id FROM events WHERE id = $1 AND organizer_id = $2',
                [event_id, user.id]
              );
              if (eventCheck.rows.length === 0) return "Event not found or unauthorized.";

              const { rows } = await query(
                'SELECT full_name, email, registered_at FROM event_registrations WHERE event_id = $1 ORDER BY registered_at DESC',
                [event_id]
              );
              return {
                count: rows.length,
                recent_registrations: rows.slice(0, 5)
              };
            } catch (err) {
              return "Error fetching registration details.";
            }
          },
        }),
      },
    });

    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error('OppBot API Error:', error);
    
    // Check for specific error types
    const isAccessDenied = error?.message?.includes('Access denied') || error?.status === 403;
    const details = isAccessDenied 
      ? 'Access to the AI service is restricted. This usually happens due to regional geoblocking.' 
      : (error instanceof Error ? error.message : 'Unknown error');
      
    return new NextResponse(JSON.stringify({ 
      error: isAccessDenied ? 'Access Restricted' : 'Error processing request', 
      details 
    }), { 
      status: isAccessDenied ? 403 : 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}


