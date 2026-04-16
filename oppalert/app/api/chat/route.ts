import { createOpenAI } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { getUserFromRequest } from '@/lib/auth';
import { query } from '@/lib/db';
import { NextRequest } from 'next/server';

// Set to true to use the Groq API
export const maxDuration = 30;

const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const user = getUserFromRequest(req);

    const result = await streamText({
      model: groq('llama-3.1-70b-versatile'),
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
      tools: {
        search_opportunities: tool({
          description: 'Search for scholarships, remote jobs, fellowships, or grants.',
          parameters: z.object({
            query: z.string().describe('The search query (e.g., "scholarships for Nigerians")'),
            category: z.string().optional().describe('The category (e.g., "Scholarship", "Job")'),
            limit: z.number().optional().default(5),
          }),
          execute: async ({ query: searchQuery, category, limit }) => {
            const params: any[] = [`%${searchQuery}%`];
            let sql = `
              SELECT id, title, organization, category, funding_type, deadline, location 
              FROM opportunities 
              WHERE is_active = TRUE 
              AND (title ILIKE $1 OR organization ILIKE $1 OR description ILIKE $1)
            `;
            
            if (category) {
              sql += ` AND category = $2`;
              params.push(category);
            }
            
            sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
            params.push(limit);
            
            const res = await query(sql, params);
            return res.rows;
          },
        }),
        get_my_events: tool({
          description: 'Get a list of events created by the logged-in organizer.',
          parameters: z.object({}),
          execute: async () => {
            if (!user) return "Please log in to see your events.";
            const { rows } = await query(
              'SELECT id, title, slug, current_registrations, max_capacity FROM events WHERE organizer_id = $1',
              [user.id]
            );
            return rows.length > 0 ? rows : "You haven't created any events yet.";
          },
        }),
        get_event_registrations: tool({
          description: 'Get details about registrations for a specific event.',
          parameters: z.object({
            event_id: z.string().describe('The UUID of the event'),
          }),
          execute: async ({ event_id }) => {
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
          },
        }),
      },
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('OppBot API Error:', error);
    return new Response('Error processing request', { status: 500 });
  }
}
