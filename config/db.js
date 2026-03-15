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

// Ensure required tables exist in Supabase/PostgreSQL before handling requests.
export const ensureDatabaseSchema = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id serial PRIMARY KEY,
            name varchar(30) NOT NULL,
            password varchar(255) NOT NULL,
            email varchar(255) UNIQUE NOT NULL,
            created_at timestamp DEFAULT now(),
            updated_at timestamp DEFAULT now()
        );
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS short_link (
            id serial PRIMARY KEY,
            url varchar(255) NOT NULL,
            short_code varchar(20) NOT NULL,
            "userID" int NOT NULL REFERENCES users(id),
            created_at timestamp DEFAULT now(),
            updated_at timestamp DEFAULT now(),
            CONSTRAINT unique_short_url_per_user UNIQUE (short_code, "userID")
        );
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS "session" (
            id serial PRIMARY KEY,
            "userID" int NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            valid boolean NOT NULL DEFAULT true,
            "user_Agent" text,
            ip varchar(255),
            "Created_At" timestamp NOT NULL DEFAULT now(),
            "updated_At" timestamp NOT NULL DEFAULT now()
        );
    `);
};