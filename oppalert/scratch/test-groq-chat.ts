
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

async function testGroqChat() {
  const apiKey = process.env.GROQ_API_KEY;
  const model = 'llama-3.3-70b-versatile';
  console.log(`Testing Groq Chat (${model}) with key:`, apiKey ? apiKey.substring(0, 5) + '...' : 'MISSING');
  
  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: 'user', content: 'Hello' }],
        max_tokens: 10
      })
    });
    
    const data = await res.json();
    if (res.ok) {
      console.log('Groq Chat Success:', data.choices[0].message.content);
    } else {
      console.error('Groq Chat Error:', data);
    }
  } catch (err) {
    console.error('Fetch Error:', err);
  }
}

testGroqChat();
