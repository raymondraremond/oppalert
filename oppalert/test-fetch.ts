import fs from 'fs';
import path from 'path';

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

import { AdzunaAdapter } from './lib/services/adzuna-adapter';
import { JoobleAdapter } from './lib/services/jooble-adapter';

async function testFetch() {
  const adz = new AdzunaAdapter();
  try {
    const aUrl = `https://api.adzuna.com/v1/api/jobs/za/search/1?app_id=${process.env.ADZUNA_APP_ID}&app_key=${process.env.ADZUNA_APP_KEY}&content-type=application/json`;
    console.log("Adzuna Request URL:", aUrl);
    const aRes = await fetch(aUrl);
    console.log("Adzuna Status:", aRes.status);
    const aData = await aRes.json();
    console.log("Adzuna sample jobs:", aData?.results?.length);
    if (!aData?.results) console.log("Adzuna err data:", aData);
  } catch(e) {
    console.error("Adz error", e);
  }

  try {
    const jRes = await fetch(`https://api.jooble.org/api/${process.env.JOOBLE_API_KEY}`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ keywords: 'opportunities', location: '', page: 1 })
    });
    console.log("Jooble Status:", jRes.status);
    const jData = await jRes.json();
    console.log("Jooble sample jobs:", jData?.jobs?.length);
    if (!jData?.jobs) console.log("Jooble err data:", jData);
  } catch(e) {
    console.error("Joo error", e);
  }
}
testFetch();
