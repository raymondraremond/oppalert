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
- You are OppBot, the elite AI guide for the OppAlert platform.
- You help African students, graduates, and founders find life-changing opportunities.
- PERSONALITY: Professional, visionary, energetic, and extremely helpful.

### PLATFORM KNOWLEDGE BASE:
- **Opportunities** (/opportunities): Searchable database of scholarships, jobs, grants, and fellowships.
- **Events** (/events): Webinars, workshops, and networking events.
- **Dashboard** (/dashboard): Where users manage their saved opportunities and registrations.
- **Organizer Portal** (/organizer): For organizations to post and manage their own events.
- **Pricing** (/pricing): Premium plans (Professional/Elite) for advanced features like AI CV export and priority alerts.
- **Blog** (/blog): Success stories and career advice.

### YOUR SUPER POWERS (TOOLS):
1. **search_opportunities**: ALWAYS call this when someone asks for "scholarships", "jobs", "grants", or "internships".
2. **get_opportunity_details**: Use this to give more depth when a user is interested in a specific opportunity.
3. **search_events**: Find upcoming workshops or webinars.
4. **get_my_status**: Call this to show the user their own saved items and registrations.
5. **get_platform_info**: Call this if the user asks "How do I..." or "What's the difference between..." regarding platform features.

### RULES:
- ALWAYS provide internal links in markdown: [Link Name](/path).
- If the user is NOT logged in and asks for personal data ('get_my_status'), tell them to [Login](/login) or [Register](/register) first.
- If a search tool returns no results, suggest they check back later or browse all at [/opportunities](/opportunities).
- NEVER hallucinate data. If you don't know, use 'get_platform_info' or refer them to [Support](/support).
- Keep responses concise but impactful. Use bullet points for lists.`,
      messages: await convertToModelMessages(messages),
      tools: {
        search_opportunities: tool({
          description: 'Search for scholarships, jobs, grants, or fellowships.',
          parameters: z.object({
            keyword: z.string().optional().describe('e.g. "tech", "undergraduate", "Nigeria"'),
            category: z.enum(['scholarship', 'job', 'fellowship', 'grant', 'internship', 'startup', 'all']).optional(),
            limit: z.number().optional().default(5),
          }),
          // @ts-ignore
          execute: async ({ keyword, category, limit }: any): Promise<any> => {
            try {
              const results = await opportunityService.searchAll({
                keyword: keyword || undefined,
                category: category === 'all' ? undefined : category,
                limit
              });
              return results;
            } catch (error) {
              return { error: 'Search service temporarily unavailable.' };
            }
          },
        }),
        get_opportunity_details: tool({
          description: 'Show full details (eligibility, benefits) for an opportunity.',
          parameters: z.object({ id: z.string() }),
          // @ts-ignore
          execute: async ({ id }: any): Promise<any> => {
            try {
              const opp = await opportunityService.getOne(id);
              return opp || { error: 'Opportunity details not found.' };
            } catch (error) {
              return { error: 'Details service temporarily unavailable.' };
            }
          },
        }),
        get_my_status: tool({
          description: 'Retrieve the user\'s registered events and saved opportunities.',
          parameters: z.object({}),
          // @ts-ignore
          execute: async (): Promise<any> => {
            if (!user) return { error: 'You need to be logged in to see your registrations and saved items.' };
            try {
              const { query } = await import('@/lib/db');
              const [registrations, saved] = await Promise.all([
                query('SELECT e.title, e.slug FROM event_registrations er JOIN events e ON er.event_id = e.id WHERE er.email = $1', [user.email]),
                query('SELECT o.title, o.id FROM saved_opportunities so JOIN opportunities o ON so.opportunity_id = o.id WHERE so.user_id = $1', [user.id])
              ]);
              return {
                registrations: registrations.rows,
                savedOpportunities: saved.rows,
                user: { email: user.email, plan: user.plan }
              };
            } catch (error) {
              return { error: 'Status service temporarily unavailable.' };
            }
          },
        }),
        get_platform_info: tool({
          description: 'Get information about platform features, pricing, or "how-to" guides.',
          parameters: z.object({
            topic: z.string().describe('The feature or question the user has (e.g. "pricing", "organizer portal", "CV export")'),
          }),
          // @ts-ignore
          execute: async ({ topic }: any): Promise<any> => {
            const topicLower = topic.toLowerCase();
            if (topicLower.includes('price') || topicLower.includes('premium') || topicLower.includes('sub')) {
              return {
                info: 'OppAlert offers Pro and Elite plans. Pro includes priority alerts and specialized search. Elite includes AI CV Export, mentor matching, and private networking.',
                action: 'View [Pricing Plans](/pricing)'
              };
            }
            if (topicLower.includes('organizer') || topicLower.includes('post')) {
              return {
                info: 'Organizations can host webinars and workshops. Register as an organizer to gain access to the Organizer Portal.',
                action: 'Join as [Organizer](/organizer/setup)'
              };
            }
            if (topicLower.includes('cv') || topicLower.includes('export')) {
              return {
                info: 'The AI CV Export feature is available for Elite members. It automatically builds a professional CV from your profile data.',
                action: 'Upgrade to [Elite](/pricing)'
              };
            }
            return {
              info: "OppAlert is Africa's premier discovery platform for career-defining opportunities.",
              action: 'Explore [About Us](/blog/about-oppalert)'
            };
          },
        }),
        search_events: tool({
          description: 'Find upcoming webinars and workshops.',
          parameters: z.object({
            type: z.enum(['event', 'webinar', 'workshop', 'all']).optional().default('all'),
          }),
          // @ts-ignore
          execute: async ({ type }: any): Promise<any> => {
            try {
              const { query } = await import('@/lib/db');
              const res = await query(
                `SELECT title, slug, event_type FROM events WHERE is_published = true AND is_active = true ${type !== 'all' ? 'AND event_type = $1' : ''} ORDER BY start_date ASC LIMIT 5`,
                type !== 'all' ? [type] : []
              );
              return res.rows;
            } catch (error) {
              return { error: 'Event search temporarily unavailable.' };
            }
          },
        }),
      },
      onFinish: ({ text }) => {
        console.log('[OppBot] Interaction complete.');
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
