import { groq } from '@ai-sdk/groq';
import { streamText, tool, convertToModelMessages } from 'ai';
import { z } from 'zod';
import { getUserFromRequest } from '@/lib/auth';
import { opportunityService } from '@/lib/services/opportunity-service';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 30;

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
    const user = getUserFromRequest(req);

    const result = await streamText({
      model: groq('llama-3.3-70b-versatile'),
      system: `### YOUR IDENTITY:
- You are OppBot, an elite assistant for OppAlert, the premier opportunity platform for Africa.
- You guide users to scholarships, jobs, grants, and fellowships.
- PERSONALITY: Concise, professional, and helpful.

### YOUR CAPABILITIES:
- You can SEARCH the live database for opportunities using the 'search_opportunities' tool.
- You can get DETAILED information about a specific opportunity using 'get_opportunity_details'.
- If a user asks "find me scholarships" or "what is available", ALWAYS call 'search_opportunities' first.

### RULES:
- If you find results, present them clearly with their titles and organizations.
- Provide links in the format: [/opportunities/ID](/opportunities/ID).
- If no results are found, suggest they browse all opportunities at [/opportunities](/opportunities).
- NEVER hallucinate opportunities. Only use data from tools.`,
      messages: convertToModelMessages(messages),
      maxSteps: 5, // Allow multiple tool calls if needed
      tools: {
        search_opportunities: tool({
          description: 'Search for scholarships, jobs, grants, or fellowships in the OppAlert database.',
          parameters: z.object({
            keyword: z.string().optional().describe('Keywords like "scholarship", "engineering", "UK", etc.'),
            category: z.enum(['scholarship', 'job', 'fellowship', 'grant', 'internship', 'startup', 'all']).optional(),
            limit: z.number().optional().default(5),
          }),
          execute: async ({ keyword, category, limit }) => {
            console.log(`[OppBot Tool] Searching for: ${keyword || 'all'} in ${category || 'all'}`);
            try {
              const results = await opportunityService.searchAll({
                keyword: keyword || undefined,
                category: category === 'all' ? undefined : category,
                limit
              });
              console.log(`[OppBot Tool] Found ${results.length} results.`);
              return results;
            } catch (error) {
              console.error('[OppBot Tool] Search Error:', error);
              return { error: 'Failed to search database' };
            }
          },
        }),
        get_opportunity_details: tool({
          description: 'Get full details about a specific opportunity by its ID.',
          parameters: z.object({
            id: z.string().describe('The UUID of the opportunity'),
          }),
          execute: async ({ id }) => {
            console.log(`[OppBot Tool] Getting details for: ${id}`);
            try {
              const opp = await opportunityService.getOne(id);
              return opp || { error: 'Opportunity not found' };
            } catch (error) {
              console.error('[OppBot Tool] GetOne Error:', error);
              return { error: 'Failed to fetch details' };
            }
          },
        }),
        search_events: tool({
          description: 'Search for upcoming events, webinars, or workshops on the platform.',
          parameters: z.object({
            type: z.enum(['event', 'webinar', 'workshop', 'all']).optional().default('all'),
            limit: z.number().optional().default(5),
          }),
          execute: async ({ type, limit }) => {
            console.log(`[OppBot Tool] Searching for events: ${type}`);
            try {
              const { query } = await import('@/lib/db');
              if (!process.env.DATABASE_URL) return { message: 'Database not connected. Visit /events to see local events.' };
              
              const sql = `
                SELECT title, slug, event_type, location, start_date 
                FROM events 
                WHERE is_published = true AND is_active = true 
                ${type !== 'all' ? 'AND event_type = $1' : ''}
                ORDER BY start_date ASC LIMIT ${type !== 'all' ? '$2' : '$1'}
              `;
              const params = type !== 'all' ? [type, limit] : [limit];
              const res = await query(sql, params);
              return res.rows;
            } catch (error) {
              console.error('[OppBot Tool] SearchEvents Error:', error);
              return { error: 'Failed to search events' };
            }
          },
        }),
      },
      onFinish: ({ text }) => {
        console.log('[OppBot] Response finished:', text.substring(0, 50) + '...');
      },
    });

    return result.toTextStreamResponse();
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
