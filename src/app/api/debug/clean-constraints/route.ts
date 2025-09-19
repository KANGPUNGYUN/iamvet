import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

export async function POST(request: NextRequest) {
  try {
    console.log('=== Cleaning up foreign key constraints ===');
    
    // Drop the wrong constraint (pointing to jobs table)
    const dropWrongConstraintQuery = `
      ALTER TABLE applications DROP CONSTRAINT IF EXISTS applications_jobId_fkey;
    `;
    
    await pool.query(dropWrongConstraintQuery);
    console.log('Dropped wrong constraint (jobs table)');
    
    // Verify the cleanup
    const verifyQuery = `
      SELECT 
        tc.constraint_name,
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM 
        information_schema.table_constraints AS tc 
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
      WHERE 
        tc.constraint_type = 'FOREIGN KEY' 
        AND tc.table_name = 'applications'
        AND kcu.column_name = 'jobId'
    `;
    
    const verification = await pool.query(verifyQuery);
    
    return NextResponse.json({
      status: 'success',
      message: 'Constraint cleanup completed',
      data: {
        remainingConstraints: verification.rows
      }
    });
  } catch (error) {
    console.error('Clean constraints error:', error);
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
      error: {
        code: (error as any)?.code,
        detail: (error as any)?.detail
      }
    }, { status: 500 });
  }
}