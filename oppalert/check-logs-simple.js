const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

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

async function run() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    const res = await pool.query('SELECT source, status, items_added, created_at FROM sync_logs ORDER BY created_at DESC LIMIT 5');
    console.log("LOGS:", res.rows);
    await pool.end();
  } catch (e) {
    console.error(e);
    await pool.end();
  }
}
run();
