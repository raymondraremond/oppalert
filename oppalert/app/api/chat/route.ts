import { groq } from '@ai-sdk/groq';
import { streamText, tool, convertToModelMessages } from 'ai';
import { z } from 'zod';
import { getUserFromRequest } from '@/lib/auth';
import { query } from '@/lib/db';
import { opportunityService } from '@/lib/services/opportunity-service';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 30; // 30 seconds for Pro plan, 10 for Hobby
export const preferredRegion = 'iad1';

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
  console.log('[OppBot] INCOMING REQUEST');
  try {
    if (!process.env.GROQ_API_KEY) {
      console.error('[OppBot] ERROR: Missing GROQ_API_KEY');
      return new Response(JSON.stringify({ error: 'Missing API Key' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { messages } = await req.json();
    console.log('[OppBot] PARSED MESSAGES:', messages.length);
    
    const user = getUserFromRequest(req);
    console.log('[OppBot] USER AUTH:', user ? `User ${user.id}` : 'Guest');

    console.log('[OppBot] INITIALIZING STREAM...');
    // Manual normalization to prevent "map of undefined" errors in strict v6 schema
    const normalizedMessages = (messages || []).map((m: any) => {
      // Ensure role is valid
      const role = ['user', 'assistant', 'system', 'tool'].includes(m.role) ? m.role : 'user';
      
      // Defensively extract content
      let content = '';
      if (typeof m.content === 'string') {
        content = m.content;
      } else if (Array.isArray(m.parts)) {
        content = m.parts.map((p: any) => p.text || '').join(' ');
      } else if (m.message) {
        content = m.message;
      } else if (m.text) {
        content = m.text;
      }

      return { role, content };
    }).filter((m: any) => m.content.trim().length > 0);

    console.log('[OppBot] NORMALIZED MESSAGES:', normalizedMessages.length);

    const result = await streamText({
      model: groq('llama-3.1-70b-versatile'),
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
      messages: normalizedMessages,
      maxSteps: 5, 
      onFinish: () => console.log('[OppBot] STREAM FINISHED SUCCESSFULLY'),
      tools: {
        get_system_status: {
          description: 'Check if the OppBot intelligence system is online and updated.',
          parameters: z.object({}),
          execute: async () => {
            console.log('[OppBot] TOOL: get_system_status');
            return {
              status: 'online',
              version: 'v1.6.2-FinalStability',
              updatedAt: new Date().toISOString(),
              mode: 'production-optimized'
            };
          }
        },
        search_opportunities: {
          description: 'Search for scholarships, remote jobs, fellowships, or grants. Only use keyword or limit if possible.',
          parameters: z.object({
            keyword: z.string().optional(),
            keywords: z.string().optional(),
            search_term: z.string().optional(),
            search_terms: z.string().optional(),
            query: z.string().optional(),
            q: z.string().optional(),
            location: z.string().optional(),
            remote: z.any().optional(),
            type: z.string().optional(),
            opportunity_type: z.string().optional(),
            category: z.string().optional(),
            limit: z.number().optional().default(5),
          }),
          execute: async (args: any) => {
            const { 
              keyword, keywords, search_term, search_terms, query: qStr, q, 
              location, remote, type, opportunity_type, category, limit 
            } = args;
            
            // Collect all possible query inputs into one string
            const terms = [
              keyword, keywords, search_term, search_terms, qStr, q,
              location, remote ? 'remote' : '', type, opportunity_type, category
            ].filter(Boolean).join(' ');

            const finalQuery = terms.length > 0 ? terms : 'scholarship';
            
            console.log(`[OppBot] TOOL: search_opportunities -> Raw Args:`, JSON.stringify(args));
            console.log(`[OppBot] TOOL: search_opportunities -> Final Query: "${finalQuery}"`);
            
            try {
              const results = await withTimeout(opportunityService.searchAll({
                keyword: finalQuery,
                limit
              }));
              return results && results.length > 0 ? results.slice(0, limit) : "No results found matching those specific terms.";
            } catch (err) {
              console.error('[OppBot] TOOL ERROR: search_opportunities:', err);
              return "Search service temporarily busy.";
            }
          },
        },
        get_my_events: {
          description: 'Get a list of all events managed by the current organizer.',
          parameters: z.object({}),
          execute: async () => {
            console.log(`[OppBot] TOOL: get_my_events`);
            try {
              if (!user) return "Unauthorized.";
              const { rows } = await withTimeout(query(
                'SELECT id, title, slug, current_registrations, max_capacity FROM events WHERE organizer_id = $1 AND is_active = true',
                [user.id]
              ));
              return rows;
            } catch (err) {
              console.error('[OppBot] TOOL ERROR: get_my_events:', err);
              return "Event service busy.";
            }
          },
        },
        get_organizer_summary: {
          description: 'Get high-level stats for an organizer.',
          parameters: z.object({}),
          execute: async () => {
            console.log(`[OppBot] TOOL: get_organizer_summary`);
            try {
              if (!user) return "Unauthorized.";
              const { rows } = await withTimeout(query(
                'SELECT COUNT(id) as total_events, SUM(current_registrations) as total_registrations FROM events WHERE organizer_id = $1 AND is_active = true',
                [user.id]
              ));
              return rows[0];
            } catch (err) {
              console.error('[OppBot] TOOL ERROR: get_organizer_summary:', err);
              return "Stats service busy.";
            }
          },
        },
      }
    } as any);

    console.log('[OppBot] STREAM CREATED, RESPONDING...');
    return result.toUIMessageStreamResponse();
  } catch (error: any) {
    console.error('[OppBot] CRITICAL API ERROR:', error);
    return new NextResponse(JSON.stringify({ 
      error: 'Error processing request', 
      details: error instanceof Error ? error.message : 'Unknown' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
