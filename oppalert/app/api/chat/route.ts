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
- **For Seekers**: Use 'search_opportunities' to find results. If a search is narrow, broaden it. Encourage them to save items to their dashboard.
- **For Organizers**: Help them monitor their events and registrations. Use 'get_my_events' and 'get_organizer_summary'. Guide them to the 'Organizer Dashboard' (/organizer) for creation.
- **As a Navigator**: If someone asks how to do something, provide direct links:
    - Explore Opportunities: /opportunities
    - Become an Organizer: /organizer/setup
    - List an Opportunity: /organizer/create
    - User Dashboard: /dashboard
    - Pricing/Pro Plans: /pricing

CURRENT USER CONTEXT:
${user ? `- Status: Logged In\n- User ID: ${user.id}\n- Plan: ${user.plan}\n- Email: ${user.email}` : '- Status: Guest User (Encourage sign-up/login)'}

PERSONALITY:
Empathetic, efficient, and deeply knowledgeable about the African opportunity landscape. Use emerald/green metaphors for growth and success.`,
      messages,
      maxSteps: 5,
      tools: {
        search_opportunities: tool({
          description: 'Search for scholarships, remote jobs, fellowships, or grants.',
          parameters: z.object({
            query: z.string().describe('The search query (e.g., "startup grants")'),
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
                return "No exact matches found. I suggest looking at broader categories on the /opportunities page.";
              }
              
              return results.slice(0, limit);
            } catch (err) {
              console.error('Search tool error:', err);
              return "The search service is temporarily offline. Please try again soon.";
            }
          },
        }),
        get_my_events: tool({
          description: 'Get a list of all events managed by the current organizer.',
          parameters: z.object({}),
          execute: async () => {
            try {
              if (!user) return "Please log in to see your events.";
              const { rows } = await query(
                'SELECT id, title, slug, current_registrations, max_capacity, is_published FROM events WHERE organizer_id = $1 AND is_active = true',
                [user.id]
              );
              return rows.length > 0 ? rows : "You haven't created any events yet. You can start at /organizer/create.";
            } catch (err) {
              return "Error fetching your events.";
            }
          },
        }),
        get_organizer_summary: tool({
          description: 'Get high-level stats for an organizer (total events, total registrations).',
          parameters: z.object({}),
          execute: async () => {
            try {
              if (!user) return "Please log in.";
              const { rows } = await query(
                `SELECT 
                  COUNT(id) as total_events,
                  SUM(current_registrations) as total_registrations
                 FROM events 
                 WHERE organizer_id = $1 AND is_active = true`,
                [user.id]
              );
              const stats = rows[0];
              return {
                totalEvents: parseInt(stats.total_events) || 0,
                totalRegistrations: parseInt(stats.total_registrations) || 0,
                dashboardLink: '/organizer'
              };
            } catch (err) {
              return "Error calculating your impact stats.";
            }
          },
        }),
        get_event_registrations: tool({
          description: 'Get registrant details for a specific event.',
          parameters: z.object({
            event_id: z.string().describe('The UUID of the event'),
          }),
          execute: async ({ event_id }) => {
            try {
              if (!user) return "Please log in.";
              const eventCheck = await query(
                'SELECT id, title FROM events WHERE id = $1 AND organizer_id = $2',
                [event_id, user.id]
              );
              if (eventCheck.rows.length === 0) return "Event not found or unauthorized.";

              const { rows } = await query(
                'SELECT full_name, email, registered_at FROM event_registrations WHERE event_id = $1 ORDER BY registered_at DESC',
                [event_id]
              );
              return {
                eventTitle: eventCheck.rows[0].title,
                count: rows.length,
                recent: rows.slice(0, 5)
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
