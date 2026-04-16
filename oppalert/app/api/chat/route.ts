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
      model: groq('llama-3.1-8b-instant'),
      system: `You are OppBot, the dual-purpose Elite Virtual Assistant for OppAlert.

THE PLATFORM:
OppAlert has two major pillars that you must support:
1. **The Seeker Pillar**: Helping students, graduates, and founders find high-impact opportunities (scholarships, remote jobs, fellowships, grants).
2. **The Organizer Pillar**: Empowering event hosts and opportunity providers to list programs, manage registrations, and track their impact.

YOUR ROLE:
- **For Seekers**: Use 'search_opportunities' to find results. If a search is narrow, broaden it. 
- **For Organizers**: Help them monitor their events. Use 'get_my_events' and 'get_organizer_summary'.
- **CRITICAL**: DO NOT explain technical details to the user. Never say "I will use the get_my_events function" or "The tool returned...". Just provide the answer. If you use a tool, integrate the data naturally into your conversation.
- **As a Navigator**: Use these direct links for guidance:
    - Explore Opportunities: /opportunities
    - List an Opportunity: /organizer/create
    - User Dashboard: /dashboard

CURRENT USER CONTEXT:
${user ? `- Status: Logged In\n- User ID: ${user.id}\n- Plan: ${user.plan}\n- Email: ${user.email}` : '- Status: Guest User (Encourage sign-up)'}

PERSONALITY:
Empathetic, professional, and efficient. Use emerald/green metaphors for growth and success.`,
      messages,
      maxSteps: 2, // Reduced to prevent serverless timeouts
      tools: {
        search_opportunities: tool({
          description: 'Search for scholarships, remote jobs, fellowships, or grants.',
          parameters: z.object({
            query: z.string().describe('The search query'),
            category: z.string().optional(),
            limit: z.number().optional().default(5),
          }),
          execute: async ({ query: searchQuery, category, limit }) => {
            console.log(`[OppBot] Searching for: ${searchQuery}`);
            try {
              const results = await opportunityService.searchAll({
                keyword: searchQuery,
                category: category as any,
                limit
              });
              return results && results.length > 0 ? results.slice(0, limit) : "No results found.";
            } catch (err) {
              console.error('[OppBot] Search failed:', err);
              return "Search service offline.";
            }
          },
        }),
        get_my_events: tool({
          description: 'Get a list of all events managed by the current organizer.',
          parameters: z.object({}),
          execute: async () => {
            console.log(`[OppBot] Fetching events for user: ${user?.id}`);
            try {
              if (!user) return "Please log in.";
              const { rows } = await query(
                'SELECT id, title, slug, current_registrations, max_capacity FROM events WHERE organizer_id = $1 AND is_active = true',
                [user.id]
              );
              return rows;
            } catch (err) {
              console.error('[OppBot] get_my_events failed:', err);
              return "Error fetching events.";
            }
          },
        }),
        get_organizer_summary: tool({
          description: 'Get high-level stats for an organizer.',
          parameters: z.object({}),
          execute: async () => {
            console.log(`[OppBot] Fetching stats for user: ${user?.id}`);
            try {
              if (!user) return "Please log in.";
              const { rows } = await query(
                'SELECT COUNT(id) as total_events, SUM(current_registrations) as total_registrations FROM events WHERE organizer_id = $1 AND is_active = true',
                [user.id]
              );
              return rows[0];
            } catch (err) {
              console.error('[OppBot] get_organizer_summary failed:', err);
              return "Error fetching stats.";
            }
          },
        }),
        get_event_registrations: tool({
          description: 'Get registrant details for a specific event.',
          parameters: z.object({
            event_id: z.string().describe('The UUID of the event'),
          }),
          execute: async ({ event_id }) => {
            console.log(`[OppBot] Fetching registrations for event: ${event_id}`);
            try {
              if (!user) return "Please log in.";
              const { rows } = await query(
                'SELECT full_name, email, registered_at FROM event_registrations WHERE event_id = $1 ORDER BY registered_at DESC',
                [event_id]
              );
              return rows.slice(0, 10);
            } catch (err) {
              console.error('[OppBot] get_event_registrations failed:', err);
              return "Error fetching details.";
            }
          },
        }),
      },
    });


    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error('OppBot API Error:', error);
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
