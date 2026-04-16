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
    // 1. PRUNING: Only send the last 6 messages to stay within Free Tier TPM limits
    const recentMessages = messages.length > 6 ? messages.slice(-6) : messages;
    console.log('[OppBot] PRUNED HISTORY:', recentMessages.length);

    // 2. NORMALIZATION
    const normalizedMessages = (recentMessages || []).map((m: any) => {
      const role = ['user', 'assistant', 'system', 'tool'].includes(m.role) ? m.role : 'user';
      let content = '';
      if (typeof m.content === 'string') content = m.content;
      else if (Array.isArray(m.parts)) content = m.parts.map((p: any) => p.text || '').join(' ');
      else if (m.message) content = m.message;
      else if (m.text) content = m.text;
      return { role, content };
    }).filter((m: any) => m.content.trim().length > 0);

    const result = await streamText({
      model: groq('llama-3.1-8b-instant'),
      system: `### CRITICAL DIRECTIVE: NO TECHNICAL LEAKAGE
- NEVER output pseudo-code, XML tags, or function syntax like <function=...>.
- NEVER show internal tool names.
- THE USER CANNOT RUN COMMANDS. Do not try to teach them internal syntax.
- ALWAYS respond in natural, elite, premium English.

### THE PLATFORM:
OppAlert supports Seekers (Scholarships/Jobs) and Organizers (Events).

### YOUR ROLE:
- Find opportunities, monitor events, and guide users naturally.
- Personality: Elite, emerald-green growthMETAPHORS.

CURRENT USER CONTEXT:
${user ? `- ID: ${user.id} (${user.plan})` : '- Guest User'}`,
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
        find_opportunities: {
          description: 'Search for scholarships, remote jobs, fellowships, or grants.',
          parameters: z.record(z.any()),
          execute: async (args: any) => {
            console.log(`[OppBot] TOOL: find_opportunities -> Args:`, JSON.stringify(args));
            
            // Defensively extract any possible keyword/search-term
            const keyword = args.keyword || args.keywords || args.search_term || args.search_terms || args.query || args.q || 'scholarship';
            const limit = args.limit || 5;
            
            try {
              const results = await withTimeout(opportunityService.searchAll({
                keyword: String(keyword),
                limit: Number(limit)
              }));
              return results && results.length > 0 ? results.slice(0, Number(limit)) : "No results found.";
            } catch (err) {
              console.error('[OppBot] TOOL ERROR: find_opportunities:', err);
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
