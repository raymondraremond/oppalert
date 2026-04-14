import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
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

import { query, SCHEMA_SQL } from './lib/db';
import { syncService } from './lib/services/sync-service';

async function run() {
  try {
    console.log("Running SCHEMA_SQL...");
    await query(SCHEMA_SQL);
    console.log("SCHEMA_SQL executed.");

    const res = await syncService.syncAll();
    console.log(JSON.stringify(res, null, 2));
    process.exit(0);
  } catch(e) {
    console.error("Error:", e);
    process.exit(1);
  }
}
run();
