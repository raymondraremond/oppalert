import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString || connectionString.includes('user:password@hostname')) {
  console.error('ERROR: DATABASE_URL is not configured. Please set a valid PostgreSQL connection string in your .env file.');
}

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false, // Required for Neon.tech
  },
});

export default pool;
