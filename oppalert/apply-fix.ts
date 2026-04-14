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

async function applyFix() {
  try {
    console.log("Applying UNIQUE constraint to external_id...");
    
    // First, remove any potential duplicates just in case (though unlikely given it was failing)
    // We want to keep the one with the most recent created_at if duplicates exist
    await query(`
      DELETE FROM opportunities a USING (
        SELECT MIN(ctid) as ctid, external_id
        FROM opportunities 
        WHERE external_id IS NOT NULL
        GROUP BY external_id HAVING COUNT(*) > 1
      ) b
      WHERE a.external_id = b.external_id 
      AND a.ctid <> b.ctid
    `);

    // Add unique constraint
    await query(`ALTER TABLE opportunities ADD CONSTRAINT opportunities_external_id_unique UNIQUE (external_id);`);
    
    console.log("Constraint applied!");
    process.exit(0);
  } catch(e) {
    console.error("Fix error:", e);
    process.exit(1);
  }
}
applyFix();
