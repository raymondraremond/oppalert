import { Pool } from 'pg';

declare global {
  var _pgPool: Pool | undefined;
}

export const SCHEMA_SQL = `
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  country VARCHAR(100),
  status VARCHAR(50) DEFAULT 'free',
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon VARCHAR(10) DEFAULT '🌍',
  title VARCHAR(500) NOT NULL,
  organization VARCHAR(255),
  category VARCHAR(100),
  location VARCHAR(255),
  funding_type VARCHAR(100),
  description TEXT,
  about TEXT,
  eligibility TEXT[],
  benefits TEXT[],
  application_url TEXT,
  deadline DATE,
  days_remaining INT DEFAULT 30,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS saved_opportunities (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, opportunity_id)
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  provider VARCHAR(50) DEFAULT 'stripe',
  provider_subscription_id TEXT UNIQUE,
  status VARCHAR(50),
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  frequency VARCHAR(20) DEFAULT 'weekly',
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS alert_preferences (
  user_id UUID REFERENCES users(id) PRIMARY KEY,
  new_opportunity_email BOOLEAN DEFAULT TRUE,
  deadline_reminders BOOLEAN DEFAULT TRUE,
  weekly_digest BOOLEAN DEFAULT TRUE,
  instant_alerts BOOLEAN DEFAULT FALSE,
  categories TEXT[],
  countries TEXT[]
);
`;

function getPool(): Pool | null {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.warn('WARNING: DATABASE_URL is not set. Running in mock mode.');
    return null;
  }

  if (global._pgPool) {
    return global._pgPool;
  }

  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 10,
  });

  global._pgPool = pool;
  return pool;
}

export async function query(text: string, params?: any[]): Promise<any> {
  const pool = getPool();
  if (!pool) {
    throw new Error('No database connection: DATABASE_URL is not configured.');
  }
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

export default { query };
