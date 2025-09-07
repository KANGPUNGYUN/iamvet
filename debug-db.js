// 데이터베이스 구조 확인용 임시 파일
// 이 파일을 실행해서 users 테이블의 구조를 확인해보세요

import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL;
const sql = neon(DATABASE_URL);

async function checkDatabase() {
  try {
    // 테이블 구조 확인
    console.log("=== Users table structure ===");
    const tableInfo = await sql`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'users'
      ORDER BY ordinal_position;
    `;
    console.log("Table columns:", tableInfo);

    // 샘플 데이터 확인 (첫 3개 row만)
    console.log("\n=== Sample users data ===");
    const sampleData = await sql`
      SELECT id, username, email, "userType", "isActive", "createdAt"
      FROM users 
      LIMIT 3
    `;
    console.log("Sample data:", sampleData);

    // 총 사용자 수
    console.log("\n=== Total users count ===");
    const totalCount = await sql`SELECT COUNT(*) as count FROM users`;
    console.log("Total users:", totalCount[0].count);

  } catch (error) {
    console.error("Database check error:", error);
  }
}

checkDatabase();