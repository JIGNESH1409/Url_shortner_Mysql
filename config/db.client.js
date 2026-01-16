import mysql from "mysql2/promise";
import { env } from "./env.js"; // adjust path if needed

export const db = await mysql.createConnection({
    host: env.DATABASE_HOST,
    user: env.DATABASE_USER,
    password: env.DATABASE_PASSWORD,
    database: env.DATABASE_NAME,
    port: Number(env.DATABASE_PORT),
});
