import {drizzle} from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

// Support both DATABASE_URL and individual connection parameters
const getDatabaseConfig = () => {
    const databaseUrl = process.env.DATABASE_URL;
    
    if (databaseUrl) {
        // Parse DATABASE_URL format: mysql://user:password@host:port/database
        return { connectionString: databaseUrl };
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