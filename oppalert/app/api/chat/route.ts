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
      model: groq('llama-3.3-70b-versatile'),
      system: `### CRITICAL DIRECTIVE: ALWAYS SUMMARIZE DATA
- AFTER using a tool to find scholarships/jobs, YOU MUST describe the results in text.
- NEVER send an empty response.
- PERSONALITY: Elite, emerald-green growth metrics.`,
      messages: normalizedMessages,
      maxSteps: 5, 
      experimental_continueSteps: true,
      onFinish: () => console.log('[OppBot] STREAM FINISHED SUCCESSFULLY'),
      tools: {
        find_opportunities: {
          description: 'Search for scholarships, remote jobs, fellowships, or grants.',
          parameters: z.record(z.any()),
          execute: async (args: any) => {
            console.log(`[OppBot] TOOL: find_opportunities -> Args:`, JSON.stringify(args));
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
      }
    } as any);

    console.log('[OppBot] STREAM CREATED, RESPONDING...');
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
