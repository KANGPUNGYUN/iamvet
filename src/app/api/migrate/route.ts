import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import { readFileSync } from "fs";
import { join } from "path";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

const MIGRATIONS_DIR = join(process.cwd(), "migrations");

const MIGRATIONS = [
  "000_create_migration_log.sql",
  "001_drop_job_postings_table.sql", 
  "002_ensure_jobs_table_structure.sql",
  "004_add_instructor_to_lectures.sql",
  "005_create_hospitals_table.sql",
  "006_debug_jobs_table.sql"
];

export async function POST(request: NextRequest) {
  try {
    console.log('=== Starting database migration ===');
    
    const results: string[] = [];
    
    for (const migrationFile of MIGRATIONS) {
      const migrationPath = join(MIGRATIONS_DIR, migrationFile);
      
      try {
        const migrationSQL = readFileSync(migrationPath, 'utf-8');
        
        console.log(`Executing migration: ${migrationFile}`);
        await pool.query(migrationSQL);
        
        const successMessage = `✅ ${migrationFile} executed successfully`;
        console.log(successMessage);
        results.push(successMessage);
        
      } catch (migrationError) {
        const errorMessage = `❌ ${migrationFile} failed: ${migrationError instanceof Error ? migrationError.message : 'Unknown error'}`;
        console.error(errorMessage);
        results.push(errorMessage);
        
        // Continue with other migrations even if one fails
      }
    }
    
    // Check migration status
    const migrationStatus = await pool.query(`
      SELECT migration_name, executed_at, description 
      FROM migration_log 
      ORDER BY executed_at DESC
    `);
    
    console.log('=== Migration completed ===');
    
    return NextResponse.json({
      status: 'success',
      message: 'Database migration completed',
      data: {
        results,
        appliedMigrations: migrationStatus.rows
      }
    });
    
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check current migration status
    const migrationStatus = await pool.query(`
      SELECT migration_name, executed_at, description 
      FROM migration_log 
      ORDER BY executed_at DESC
    `);
    
    return NextResponse.json({
      status: 'success',
      message: 'Migration status retrieved',
      data: {
        appliedMigrations: migrationStatus.rows,
        availableMigrations: MIGRATIONS
      }
    });
    
  } catch (error) {
    console.error('Migration status error:', error);
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}