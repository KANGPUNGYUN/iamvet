const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// 배포환경 DATABASE_URL
const DATABASE_URL = "postgresql://neondb_owner:npg_stzc9ESNIAf4@ep-fancy-cherry-a1179pkn-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function runMigration() {
  const client = new Client({
    connectionString: DATABASE_URL,
  });

  try {
    console.log('🔗 배포환경 데이터베이스에 연결 중...');
    await client.connect();
    console.log('✅ 연결 성공!');

    // SQL 파일 읽기
    const sqlPath = path.join(__dirname, '..', 'fix_production_schema.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    console.log('🚀 마이그레이션 실행 중...');
    const result = await client.query(sqlContent);
    
    console.log('✅ 마이그레이션 완료!');
    console.log('결과:', result);

    // 검증 쿼리 실행
    console.log('\n📋 스키마 검증 중...');
    const checkResult = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'users' 
      AND column_name IN ('licenseImage', 'realName', 'birthDate', 'nickname', 'loginId')
      ORDER BY ordinal_position;
    `);
    
    console.log('\nusers 테이블의 새로운 컬럼들:');
    checkResult.rows.forEach(row => {
      console.log(`- ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
    });

  } catch (error) {
    console.error('❌ 마이그레이션 실패:', error);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n🔌 데이터베이스 연결 종료');
  }
}

// 실행
runMigration();