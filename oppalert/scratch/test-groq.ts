
import fs from 'fs';
import path from 'path';

// Load .env
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const envStr = fs.readFileSync(envPath, 'utf8');
  envStr.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let val = match[2].trim();
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      process.env[key] = val;
    }
  });
}

async function testGroq() {
  const apiKey = process.env.GROQ_API_KEY;
  console.log('Testing Groq with key:', apiKey ? apiKey.substring(0, 5) + '...' : 'MISSING');
  
  try {
    const res = await fetch('https://api.groq.com/openai/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });
    const data = await res.json();
    if (res.ok) {
      console.log('Groq models available:', data.data.map((m: any) => m.id));
    } else {
      console.error('Groq Error:', data);
    }
  } catch (err) {
    console.error('Fetch Error:', err);
  }
}

testGroq();
