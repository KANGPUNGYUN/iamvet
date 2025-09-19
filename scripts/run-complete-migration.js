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
    console.log('✅ 연결 성공!\n');

    // 단계별 마이그레이션 실행
    console.log('📋 단계 1: users 테이블 수정 (licenseImage 컬럼 추가)');
    
    // 1. users 테이블에 누락된 컬럼들 추가
    const userTableQueries = [
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS "realName" TEXT`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS "birthDate" TIMESTAMP`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS "nickname" VARCHAR(100)`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS "loginId" VARCHAR(100)`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS "universityEmail" TEXT`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS "hospitalName" TEXT`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS "establishedDate" TIMESTAMP`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS "businessNumber" TEXT`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS "hospitalWebsite" TEXT`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS "hospitalLogo" TEXT`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS "hospitalAddress" TEXT`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS "hospitalAddressDetail" TEXT`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS "licenseImage" TEXT`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS "seq" SERIAL`
    ];

    for (const query of userTableQueries) {
      try {
        await client.query(query);
        console.log(`✅ ${query.match(/ADD COLUMN.*"(\w+)"/)[1]} 컬럼 추가 완료`);
      } catch (error) {
        if (error.code === '42701') { // column already exists
          console.log(`ℹ️  ${query.match(/ADD COLUMN.*"(\w+)"/)[1]} 컬럼은 이미 존재합니다`);
        } else {
          throw error;
        }
      }
    }

    // 2. 제약조건 추가
    console.log('\n📋 단계 2: 제약조건 추가');
    const constraintQueries = [
      `CREATE UNIQUE INDEX IF NOT EXISTS users_loginId_unique ON users("loginId") WHERE "loginId" IS NOT NULL`,
      `CREATE UNIQUE INDEX IF NOT EXISTS users_universityEmail_unique ON users("universityEmail") WHERE "universityEmail" IS NOT NULL`,
      `CREATE UNIQUE INDEX IF NOT EXISTS users_businessNumber_unique ON users("businessNumber") WHERE "businessNumber" IS NOT NULL`,
      `CREATE UNIQUE INDEX IF NOT EXISTS users_seq_unique ON users("seq")`,
      `CREATE INDEX IF NOT EXISTS idx_users_loginid ON users("loginId")`,
      `CREATE INDEX IF NOT EXISTS idx_users_nickname ON users("nickname")`
    ];

    for (const query of constraintQueries) {
      await client.query(query);
      console.log(`✅ 인덱스 생성 완료`);
    }

    // 3. username 컬럼 제거 (배포환경에만 있는 불필요한 컬럼)
    console.log('\n📋 단계 3: username 컬럼 처리');
    try {
      // username 데이터를 loginId로 이동 (필요한 경우)
      await client.query(`UPDATE users SET "loginId" = username WHERE "loginId" IS NULL AND username IS NOT NULL`);
      // username 컬럼 제거
      await client.query(`ALTER TABLE users DROP COLUMN IF EXISTS username CASCADE`);
      console.log('✅ username 컬럼 제거 완료');
    } catch (error) {
      if (error.code === '42703') { // column does not exist
        console.log('ℹ️  username 컬럼이 존재하지 않습니다');
      } else {
        console.log('⚠️  username 컬럼 제거 중 오류 (무시하고 계속):', error.message);
      }
    }

    // 4. realName 기본값 설정
    console.log('\n📋 단계 4: 데이터 정리');
    await client.query(`UPDATE users SET "realName" = COALESCE(nickname, email) WHERE "realName" IS NULL`);
    console.log('✅ realName 기본값 설정 완료');

    // 5. 검증
    console.log('\n📋 검증: users 테이블의 licenseImage 컬럼 확인');
    const checkResult = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'users' 
      AND column_name = 'licenseImage'
    `);
    
    if (checkResult.rows.length > 0) {
      console.log('✅ licenseImage 컬럼이 성공적으로 추가되었습니다!');
      console.log(`   타입: ${checkResult.rows[0].data_type}`);
      console.log(`   Nullable: ${checkResult.rows[0].is_nullable}`);
    } else {
      throw new Error('❌ licenseImage 컬럼이 추가되지 않았습니다!');
    }

    // 5. 전체 스키마 동기화 여부 확인
    console.log('\n전체 스키마 동기화를 진행하시겠습니까?');
    console.log('전체 동기화에는 다음이 포함됩니다:');
    console.log('- 8개의 누락된 테이블 생성');
    console.log('- jobs 테이블 구조 수정');
    console.log('- 불필요한 컬럼 제거');
    console.log('\n전체 동기화를 원하시면 complete_schema_sync.sql 파일을 실행하세요.');

  } catch (error) {
    console.error('❌ 마이그레이션 실패:', error);
    console.error('에러 세부사항:', error.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n🔌 데이터베이스 연결 종료');
  }
}

// 실행
console.log('🚀 배포환경 데이터베이스 마이그레이션 시작\n');
runMigration();