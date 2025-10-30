import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    console.log('[DEBUG] Checking resume tables...');

    // 1. 테이블 존재 여부 확인
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE '%resume%'
      ORDER BY table_name
    `;

    console.log('[DEBUG] Resume tables found:', tables);

    // 2. 메인 이력서 테이블 데이터 확인
    let mainResumes: any[] = [];
    try {
      mainResumes = await sql`
        SELECT 
          id,
          "userId",
          name,
          email,
          phone,
          position,
          specialties,
          "preferredRegions",
          "createdAt",
          "updatedAt"
        FROM resumes 
        WHERE "deletedAt" IS NULL
        ORDER BY "createdAt" DESC
        LIMIT 10
      `;
    } catch (error) {
      console.log('[DEBUG] detailed_resumes table might not exist or have different schema');
      mainResumes = [];
    }

    // 3. 관련 테이블들 데이터 확인
    let experiences: any[] = [];
    let licenses: any[] = [];
    let educations: any[] = [];
    let medicalCapabilities: any[] = [];

    try {
      experiences = await sql`SELECT COUNT(*) as count FROM resume_experiences`;
    } catch (error) {
      experiences = [];
    }

    try {
      licenses = await sql`SELECT COUNT(*) as count FROM resume_licenses`;
    } catch (error) {
      licenses = [];
    }

    try {
      educations = await sql`SELECT COUNT(*) as count FROM resume_educations`;
    } catch (error) {
      educations = [];
    }

    try {
      medicalCapabilities = await sql`SELECT COUNT(*) as count FROM resume_medical_capabilities`;
    } catch (error) {
      medicalCapabilities = [];
    }

    const result = {
      success: true,
      data: {
        tables: tables,
        mainResumes: mainResumes,
        counts: {
          experiences: experiences,
          licenses: licenses,
          educations: educations,
          medicalCapabilities: medicalCapabilities
        }
      }
    };

    console.log('[DEBUG] Resume data result:', JSON.stringify(result, null, 2));

    return NextResponse.json(result);

  } catch (error) {
    console.error('[DEBUG] Error checking resume data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}