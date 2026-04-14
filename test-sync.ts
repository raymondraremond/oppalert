import { query } from './oppalert/lib/db';

async function run() {
  try {
    const res = await query('SELECT * FROM sync_logs ORDER BY created_at DESC LIMIT 5');
    console.log("Recent Sync Logs:", JSON.stringify(res.rows, null, 2));
  } catch(e) {
    console.error("FAILED:", e);
  }
}

run();
