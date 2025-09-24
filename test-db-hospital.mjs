import { sql } from '@vercel/postgres';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    
    // 1. 기존 hospital 사용자 확인
    const existingHospitals = await sql`
      SELECT id, "loginId", "hospitalName", "businessNumber", "createdAt" 
      FROM users 
      WHERE "userType" = 'HOSPITAL'
      ORDER BY "createdAt" DESC
      LIMIT 5
    `;
    console.log('\nExisting hospital users:', existingHospitals.rows);
    
    // 2. hospital_business_licenses 테이블 확인
    const licenses = await sql`
      SELECT * FROM hospital_business_licenses
      ORDER BY "uploadedAt" DESC
      LIMIT 5
    `;
    console.log('\nBusiness licenses:', licenses.rows);
    
    // 3. 테스트 아이디 중복 체크
    const testLoginId = 'testhospital001';
    const duplicateCheck = await sql`
      SELECT id FROM users 
      WHERE "loginId" = ${testLoginId} 
      AND "isActive" = true
    `;
    console.log(`\nDuplicate check for '${testLoginId}':`, duplicateCheck.rows.length > 0 ? 'Already exists' : 'Available');
    
    // 4. 테스트 사업자번호 중복 체크
    const testBusinessNumber = '123-45-67890';
    const businessDuplicateCheck = await sql`
      SELECT id FROM users 
      WHERE REPLACE("businessNumber", '-', '') = ${testBusinessNumber.replace(/-/g, '')} 
      AND "isActive" = true
    `;
    console.log(`\nBusiness number duplicate check for '${testBusinessNumber}':`, businessDuplicateCheck.rows.length > 0 ? 'Already exists' : 'Available');
    
  } catch (error) {
    console.error('Database test error:', error);
  } finally {
    process.exit();
  }
}

testDatabase();