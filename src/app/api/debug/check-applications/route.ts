import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

export async function GET(request: NextRequest) {
  try {
    // Check applications table
    const applicationsQuery = `
      SELECT 
        id,
        "jobId",
        "veterinarianId", 
        status,
        "createdAt",
        "appliedAt"
      FROM applications 
      ORDER BY "createdAt" DESC 
      LIMIT 10
    `;
    
    const applications = await pool.query(applicationsQuery);
    
    // Check specific job applications
    const jobApplicationsQuery = `
      SELECT 
        id,
        "jobId",
        "veterinarianId", 
        status,
        "createdAt"
      FROM applications 
      WHERE "jobId" = $1
      ORDER BY "createdAt" DESC
    `;
    
    const jobApplications = await pool.query(jobApplicationsQuery, ['HlstieUzUGIpyrDS']);
    
    return NextResponse.json({
      status: 'success',
      data: {
        totalApplications: applications.rows.length,
        allApplications: applications.rows,
        jobSpecificApplications: jobApplications.rows,
        tableInfo: 'Applications are stored in the "applications" table'
      }
    });
  } catch (error) {
    console.error('Check applications error:', error);
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