import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

export async function GET(request: NextRequest) {
  try {
    console.log("[TEST-DB] Testing database connection...");
    
    // 1. Users 테이블에서 hospital 타입 사용자 조회
    const usersQuery = `SELECT id, email, "userType", "realName" FROM users WHERE "userType" = 'HOSPITAL' LIMIT 5`;
    const usersResult = await pool.query(usersQuery);
    console.log("[TEST-DB] Hospital users found:", usersResult.rows.length);
    
    // 2. detailed_hospital_profiles 테이블 조회
    const profilesQuery = `SELECT "userId", "hospitalName", address, website FROM detailed_hospital_profiles LIMIT 5`;
    const profilesResult = await pool.query(profilesQuery);
    console.log("[TEST-DB] Hospital profiles found:", profilesResult.rows.length);
    
    // 3. jobs 테이블 조회
    const jobsQuery = `SELECT id, "hospitalId", title FROM jobs WHERE "deletedAt" IS NULL LIMIT 5`;
    const jobsResult = await pool.query(jobsQuery);
    console.log("[TEST-DB] Jobs found:", jobsResult.rows.length);
    
    return NextResponse.json({
      success: true,
      data: {
        hospitalUsers: usersResult.rows,
        hospitalProfiles: profilesResult.rows,
        jobs: jobsResult.rows,
      }
    });
  } catch (error) {
    console.error("[TEST-DB] Database test error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Database test failed"
    }, { status: 500 });
  }
}