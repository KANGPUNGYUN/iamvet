import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

export async function DELETE(request: NextRequest) {
  try {
    console.log('=== Starting job_postings table removal ===');
    
    // Check if job_postings table exists
    const tableExistsQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'job_postings'
      );
    `;
    
    const tableCheck = await pool.query(tableExistsQuery);
    const tableExists = tableCheck.rows[0].exists;
    
    if (!tableExists) {
      return NextResponse.json({
        status: 'success',
        message: 'job_postings 테이블이 이미 존재하지 않습니다.'
      });
    }
    
    // Drop job_postings table
    const dropTableQuery = `DROP TABLE IF EXISTS job_postings CASCADE;`;
    await pool.query(dropTableQuery);
    
    console.log('job_postings table dropped successfully');
    
    return NextResponse.json({
      status: 'success',
      message: 'job_postings 테이블이 성공적으로 제거되었습니다.'
    });
  } catch (error) {
    console.error('Drop job_postings table error:', error);
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}