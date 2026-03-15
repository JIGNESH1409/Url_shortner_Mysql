import {drizzle} from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

// Parse DATABASE_URL in format: mysql://user:password@host:port/database
const parseDatabaseUrl = (url) => {
    const dbUrl = new URL(url);
    return {
        host: dbUrl.hostname,
        user: dbUrl.username,
        password: dbUrl.password,
        database: dbUrl.pathname.slice(1),
        port: parseInt(dbUrl.port || '3306'),
    };
};

const getDatabaseConfig = () => {
    const databaseUrl = process.env.DATABASE_URL;
    
    if (databaseUrl) {
        try {
            return parseDatabaseUrl(databaseUrl);
        } catch (error) {
            console.error('Failed to parse DATABASE_URL:', error);
        }
    }
    
    // Fallback to individual parameters for local development
    return {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'url_shortener_drizzle',
        port: parseInt(process.env.DB_PORT || '3306'),
    };
};

const config = getDatabaseConfig();
const pool = mysql.createPool(config);

export const db = drizzle(pool);