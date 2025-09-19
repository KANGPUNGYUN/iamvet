import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

export async function GET(request: NextRequest) {
  try {
    // Check jobs table content
    const jobsQuery = `
      SELECT id, title, status, "createdAt" 
      FROM jobs 
      ORDER BY "createdAt" DESC 
      LIMIT 10
    `;
    
    const jobs = await pool.query(jobsQuery);
    
    // Check specific job in jobs table
    const specificJobInJobsQuery = `
      SELECT id, title FROM jobs 
      WHERE id = $1
    `;
    
    const specificJobInJobs = await pool.query(specificJobInJobsQuery, ['HlstieUzUGIpyrDS']);
    
    return NextResponse.json({
      status: 'success',
      data: {
        jobsTableCount: jobs.rows.length,
        jobsTableData: jobs.rows,
        specificJobInJobs: specificJobInJobs.rows
      }
    });
  } catch (error) {
    console.error('Check jobs table error:', error);
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}