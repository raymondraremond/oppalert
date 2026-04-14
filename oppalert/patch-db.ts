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

async function patch() {
  try {
    console.log("Patching db missing columns...");
    await query(`ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS source VARCHAR(50) DEFAULT 'internal';`);
    await query(`ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS external_id VARCHAR(255);`);
    await query(`ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS icon VARCHAR(10) DEFAULT '🌍';`);
    await query(`ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;`);
    console.log("Patched!");
    process.exit(0);
  } catch(e) {
    console.error("Patch error:", e);
    process.exit(1);
  }
}
patch();
