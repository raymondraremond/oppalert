import { createOpenAI } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { getUserFromRequest } from '@/lib/auth';
import { query } from '@/lib/db';
import { opportunityService } from '@/lib/services/opportunity-service';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 30; // 30 seconds for Pro plan, 10 for Hobby
export const preferredRegion = 'iad1';

const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

// Helper for timing out DB queries
const withTimeout = async <T>(promise: Promise<T>, timeoutMs: number = 5000): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('Operation Timed Out')), timeoutMs)
    )
  ]);
};

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return new Response(JSON.stringify({ error: 'Missing API Key' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { messages } = await req.json();
    const user = getUserFromRequest(req);

    const result = await streamText({
      model: groq('llama-3.1-8b-instant'),
      system: `### CRITICAL DIRECTIVE: NO TECHNICAL LEAKAGE
- NEVER MENTION internal tool names like 'get_my_events', 'search_opportunities', or 'get_system_status'.
- NEVER EXPLAIN that you are using a function or that a tool returned an error.
- INTEGRATE all findings naturally. If a search fails, say "I couldn't find any exact matches right now."
- YOU ARE OppBot, a high-end personal assistant, not a technical diagnostic log.

### THE PLATFORM:
OppAlert supports:
1. **Seekers**: Finding scholarships, remote jobs, and grants.
2. **Organizers**: Hosting events and managing registrations.

### YOUR ROLE:
- **For Seekers**: Find opportunities. If results are zero, suggest broader terms.
- **For Organizers**: Monitor events. Use tools silently. Point to /organizer for dashboard access.
- **Navigation**: Use: /opportunities, /organizer/create, /dashboard, /pricing.

CURRENT USER CONTEXT:
${user ? `- Status: Logged In\n- ID: ${user.id}\n- Plan: ${user.plan}` : '- Status: Guest User (Encourage Sign-up)'}

PERSONALITY:
Efficient, elite, and growth-oriented. Using emerald/green metaphors for success.`,
      messages,
      maxSteps: 2, 
      tools: {
        get_system_status: tool({
          description: 'Check if the OppBot intelligence system is online and updated.',
          parameters: z.object({}),
          execute: async () => ({
            status: 'online',
            version: 'v1.4.2-Ironclad',
            updatedAt: '2026-04-16T15:08:00Z',
            mode: 'production-optimized'
          })
        }),
        search_opportunities: tool({
          description: 'Search for scholarships, remote jobs, fellowships, or grants.',
          parameters: z.object({
            query: z.string(),
            category: z.string().optional(),
            limit: z.number().optional().default(5),
          }),
          execute: async ({ query: searchQuery, category, limit }) => {
            console.log(`[OppBot] SEARCH: ${searchQuery}`);
            try {
              const results = await withTimeout(opportunityService.searchAll({
                keyword: searchQuery,
                category: category as any,
                limit
              }));
              return results && results.length > 0 ? results.slice(0, limit) : "No results found.";
            } catch (err) {
              console.error('[OppBot] SEARCH TIMEOUT:', err);
              return "Search service temporarily busy.";
            }
          },
        }),
        get_my_events: tool({
          description: 'Get a list of all events managed by the current organizer.',
          parameters: z.object({}),
          execute: async () => {
            console.log(`[OppBot] EVENTS: ${user?.id}`);
            try {
              if (!user) return "Unauthorized.";
              const { rows } = await withTimeout(query(
                'SELECT id, title, slug, current_registrations, max_capacity FROM events WHERE organizer_id = $1 AND is_active = true',
                [user.id]
              ));
              return rows;
            } catch (err) {
              console.error('[OppBot] EVENTS TIMEOUT:', err);
              return "Event service busy.";
            }
          },
        }),
        get_organizer_summary: tool({
          description: 'Get high-level stats for an organizer.',
          parameters: z.object({}),
          execute: async () => {
            console.log(`[OppBot] SUMMARY: ${user?.id}`);
            try {
              if (!user) return "Unauthorized.";
              const { rows } = await withTimeout(query(
                'SELECT COUNT(id) as total_events, SUM(current_registrations) as total_registrations FROM events WHERE organizer_id = $1 AND is_active = true',
                [user.id]
              ));
              return rows[0];
            } catch (err) {
              console.error('[OppBot] SUMMARY TIMEOUT:', err);
              return "Stats service busy.";
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
