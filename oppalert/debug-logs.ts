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

import { query } from './lib/db';

async function checkUserLogs() {
  try {
    const r = await query('SELECT * FROM sync_logs ORDER BY created_at DESC LIMIT 10');
    console.log("RECENT SYNC LOGS:");
    console.log(JSON.stringify(r.rows, null, 2));
    
    const count = await query('SELECT count(*) FROM opportunities');
    console.log("TOTAL OPPORTUNITIES:", count.rows[0].count);
    
    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}
checkUserLogs();
