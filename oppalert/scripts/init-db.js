const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function init() {
const poolConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
};

if (!poolConfig.connectionString) {
  try {
    const envPath = path.join(__dirname, '..', '.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const match = envContent.match(/DATABASE_URL=["']?(.*?)["']?(\s|$)/);
      if (match && match[1]) {
        poolConfig.connectionString = match[1];
      }
    }
  } catch (e) {
    console.error('Error reading .env file manually:', e.message);
  }
}

if (!poolConfig.connectionString || poolConfig.connectionString.includes('user:password')) {
  console.error('ERROR: DATABASE_URL environment variable is not set or is still a placeholder.');
  process.exit(1);
}

const pool = new Pool(poolConfig);

  const sqlPath = path.join(__dirname, 'schema.sql');
  if (!fs.existsSync(sqlPath)) {
    console.error(`ERROR: SQL file not found at ${sqlPath}`);
    process.exit(1);
  }

  const sql = fs.readFileSync(sqlPath, 'utf8');

  try {
    console.log('Connecting to database...');
    // Split by semicolons for cleaner execution if needed, 
    // but pool.query(sql) handles multiple statements for postgres.
    await pool.query(sql);
    console.log('SUCCESS: Database schema initialized successfully.');
  } catch (err) {
    console.error('ERROR during initialization:');
    console.error(err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

init();
