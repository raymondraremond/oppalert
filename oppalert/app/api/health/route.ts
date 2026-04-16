import { NextResponse } from 'next/server';

export async function GET() {
  const hasGroqKey = !!process.env.GROQ_API_KEY;
  const groqKeyLength = process.env.GROQ_API_KEY?.length || 0;
  const groqKeyPrefix = process.env.GROQ_API_KEY?.substring(0, 4) || 'none';
  const nodeEnv = process.env.NODE_ENV;
  const vercelEnv = process.env.VERCEL_ENV || 'local';

  // Test Groq Connectivity
  let connectivity = 'untested';
  let groqError = null;

  if (hasGroqKey) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout
      
      const res = await fetch('https://api.groq.com/openai/v1/models', {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
        },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        connectivity = 'ok';
      } else {
        connectivity = 'failed';
        groqError = await res.json();
      }
    } catch (err: any) {
      connectivity = 'error';
      groqError = err.message;
    }
  }

  return NextResponse.json({
    status: 'online',
    environment: {
      nodeEnv,
      vercelEnv,
    },
    groq: {
      hasKey: hasGroqKey,
      keyLength: groqKeyLength,
      keyPrefix: groqKeyPrefix,
      connectivity,
      error: groqError
    },
    timestamp: new Date().toISOString()
  });
}
