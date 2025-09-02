// src/lib/db.ts
import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set");
  throw new Error("Database connection string is required");
}

export const sql = neon(DATABASE_URL);
