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

async function checkSchema() {
  try {
    console.log("--- TABLE: opportunities ---");
    const oppsCols = await query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'opportunities'
    `);
    console.log(JSON.stringify(oppsCols.rows, null, 2));

    console.log("--- CONSTRAINTS: opportunities ---");
    const oppsConstraints = await query(`
      SELECT conname, contype 
      FROM pg_constraint 
      WHERE conrelid = 'opportunities'::regclass
    `);
    console.log(JSON.stringify(oppsConstraints.rows, null, 2));

    console.log("--- TABLE: sync_logs ---");
    const syncCols = await query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'sync_logs'
    `);
    console.log(JSON.stringify(syncCols.rows, null, 2));

    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}
checkSchema();
