import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

export async function GET(request: NextRequest) {
  try {
    console.log('=== Debug Jobs API ===');
    
    // Check if jobs table exists
    const tableCheck = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name IN ('jobs', 'job_postings')
    `);
    
    console.log('Available tables:', tableCheck.rows);
    
    // Count all jobs regardless of status
    const allJobsCount = await pool.query(`
      SELECT COUNT(*) as total FROM jobs
    `);
    
    console.log('Total jobs in database:', allJobsCount.rows[0].total);
    
    // Count active jobs
    const activeJobsCount = await pool.query(`
      SELECT COUNT(*) as total 
      FROM jobs 
      WHERE "isActive" = true AND "isDraft" = false AND "deletedAt" IS NULL
    `);
    
    console.log('Active jobs count:', activeJobsCount.rows[0].total);
    
    // Check recent jobs
    const recentJobs = await pool.query(`
      SELECT id, title, "hospitalId", "isActive", "isDraft", "deletedAt", "createdAt"
      FROM jobs 
      ORDER BY "createdAt" DESC 
      LIMIT 5
    `);
    
    console.log('Recent jobs:', recentJobs.rows);
    
    // Check if hospitals table exists and has data
    const hospitalsCheck = await pool.query(`
      SELECT COUNT(*) as total FROM hospitals
    `);
    
    console.log('Hospitals count:', hospitalsCheck.rows[0].total);
    
    // Try the exact query used in getJobsWithPagination
    const testQuery = await pool.query(`
      SELECT COUNT(*) as total
      FROM jobs j
      JOIN users u ON j."hospitalId" = u.id
      JOIN hospitals h ON u.id = h."userId"
      WHERE j."isActive" = true AND j."isDraft" = false AND j."deletedAt" IS NULL
    `);
    
    console.log('Test query result:', testQuery.rows[0].total);
    
    return NextResponse.json({
      status: 'success',
      data: {
        availableTables: tableCheck.rows,
        totalJobs: allJobsCount.rows[0].total,
        activeJobs: activeJobsCount.rows[0].total,
        recentJobs: recentJobs.rows,
        hospitalsCount: hospitalsCheck.rows[0].total,
        testQueryResult: testQuery.rows[0].total
      }
    });
    
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
      error: error
    }, { status: 500 });
  }
}