
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

import { Pool } from 'pg';

async function testDB() {
  console.log('Testing DB connection to:', process.env.DATABASE_URL?.split('@')[1]);
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    const client = await pool.connect();
    console.log('Connected!');
    const res = await client.query('SELECT COUNT(*) FROM opportunities');
    console.log('Opportunities count:', res.rows[0].count);
    client.release();
  } catch (err) {
    console.error('DB Error:', err);
  } finally {
    await pool.end();
  }
}

testDB();
