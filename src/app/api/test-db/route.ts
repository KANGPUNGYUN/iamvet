import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

// Neon 데이터베이스에 직접 연결
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export async function GET(request: NextRequest) {
  try {
    // 1. 데이터베이스 연결 테스트
    const connTest = await pool.query('SELECT NOW()');
    console.log("DB Connection successful:", connTest.rows[0]);

    // 2. forum_posts 테이블 구조 확인
    const forumTableStructure = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'forum_posts'
      ORDER BY ordinal_position
    `);
    console.log("Forum_posts table structure:", forumTableStructure.rows);

    // 3. 외래 키 제약 조건 확인
    const foreignKeys = await pool.query(`
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
      WHERE tc.constraint_type = 'FOREIGN KEY' 
      AND tc.table_name = 'forum_posts'
    `);
    console.log("Forum_posts foreign keys:", foreignKeys.rows);

    // 4. users 테이블 존재 및 구조 확인
    const usersTable = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'users'
    `);
    console.log("Users table exists:", usersTable.rows.length > 0);

    // 5. 모든 테이블 목록 확인
    const allTables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    console.log("All tables:", allTables.rows);

    // 6. 실제 데이터 확인
    const forumData = await pool.query(`
      SELECT * FROM forum_posts LIMIT 5
    `);
    console.log("Forum posts data:", forumData.rows);

    return NextResponse.json({
      success: true,
      connection: "OK",
      forumTableStructure: forumTableStructure.rows,
      foreignKeys: foreignKeys.rows,
      usersTableExists: usersTable.rows.length > 0,
      allTables: allTables.rows,
      forumData: forumData.rows
    });
  } catch (error) {
    console.error("Database test error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}