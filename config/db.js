import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const getDatabaseUrl = () => {
    if (process.env.DATABASE_URL) {
        console.log('[DB] Using cloud database (Supabase)');
        return process.env.DATABASE_URL;
    }
    
    // Fallback to local PostgreSQL for development
    const localUrl = `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || ''}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'url_shortener'}`;
    console.log('[DB] Using local database');
    return localUrl;
};

const databaseUrl = getDatabaseUrl();
console.log('[DB] Connecting to database...');
const pool = new Pool({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });
export const db = drizzle(pool);
console.log('[DB] ✅ Database initialized');