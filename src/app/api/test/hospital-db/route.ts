import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log('Testing hospital database...');
    
    // 1. 기존 hospital 사용자 확인
    const existingHospitals = await sql`
      SELECT id, "loginId", "hospitalName", "businessNumber", "createdAt" 
      FROM users 
      WHERE "userType" = 'HOSPITAL'
      ORDER BY "createdAt" DESC
      LIMIT 5
    `;
    
    // 2. hospital_business_licenses 테이블 확인
    const licenses = await sql`
      SELECT * FROM hospital_business_licenses
      ORDER BY "uploadedAt" DESC
      LIMIT 5
    `;
    
    // 3. 테스트 아이디 중복 체크
    const testLoginId = 'testhospital001';
    const duplicateCheck = await sql`
      SELECT id FROM users 
      WHERE "loginId" = ${testLoginId} 
      AND "isActive" = true
    `;
    
    // 4. 테스트 사업자번호 중복 체크
    const testBusinessNumber = '123-45-67890';
    const businessDuplicateCheck = await sql`
      SELECT id FROM users 
      WHERE REPLACE("businessNumber", '-', '') = ${testBusinessNumber.replace(/-/g, '')} 
      AND "isActive" = true
    `;
    
    const result = {
      hospitals: existingHospitals,
      licenses: licenses,
      loginIdCheck: {
        loginId: testLoginId,
        exists: duplicateCheck.length > 0
      },
      businessNumberCheck: {
        businessNumber: testBusinessNumber,
        exists: businessDuplicateCheck.length > 0
      }
    };
    
    console.log('Test result:', result);
    
    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Hospital DB test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}