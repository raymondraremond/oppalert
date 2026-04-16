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

    // 2. INTENT DETECTION & DIRECT DATA INJECTION
    const lastUserMsg = normalizedMessages.filter(m => m.role === 'user').at(-1)?.content || '';
    let searchData = '';
    
    // Simple regex to detect if user is asking for database info
    const isSearchRequest = /find|show|search|scholarship|job|grant|internship/i.test(lastUserMsg);

    if (isSearchRequest) {
      console.log('[OppBot] SEARCH INTENT DETECTED. PRE-FETCHING DATA...');
      const keywords = lastUserMsg.replace(/find|show|me|search|for|available/gi, '').trim();
      try {
        const results = await withTimeout(opportunityService.searchAll({
          keyword: keywords || 'scholarship',
          limit: 5
        }));
        
        if (results && results.length > 0) {
          searchData = `\n### CURRENT DATABASE RESULTS FOR "${keywords || 'Scholarships'}":\n` + 
            results.map((r: any) => `- [${r.icon || '🎓'}] ${r.title} at ${r.organization || 'Various'}. Type: ${r.funding_type || 'Fully Funded'}. URL: /opportunities/${r.id}`).join('\n');
        } else {
          searchData = `\n### DATABASE NOTE: No exact matches found in the live database for "${keywords}". Suggest the user browse all /opportunities.`;
        }
      } catch (err) {
        console.error('[OppBot] PRE-FETCH ERROR:', err);
      }
    }

    const result = await streamText({
      model: groq('llama-3.3-70b-versatile'),
      system: `### YOUR IDENTITY:
- You are OppBot, an elite, emerald-themed assistant for OppAlert.
- You guide users to scholarships, jobs, and grants.
- PERSONALITY: Concise, professional, and results-oriented.

### CRITICAL:
${searchData ? `I have pre-fetched some data for you to use in this response: ${searchData}\n\nUSE THIS DATA DIRECTLY. DO NOT hallucinate or pretend to search.` : 'Answer the user naturally. If they ask for opportunities, provide general guidance or suggest they try a specific search.'}

### GUIDELINES:
- ALWAYS provide direct links like [/opportunities](/opportunities) or specific item links if provided.
- NO technical jargon or tool names.`,
      messages: normalizedMessages,
      onFinish: () => console.log('[OppBot] STREAM FINISHED SUCCESSFULLY'),
    });

    console.log('[OppBot] STREAM CREATED (DIRECT INJECTION), RESPONDING...');
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
