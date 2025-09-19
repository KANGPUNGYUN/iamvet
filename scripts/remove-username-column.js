const { Client } = require('pg');

// 배포환경 DATABASE_URL
const DATABASE_URL = "postgresql://neondb_owner:npg_stzc9ESNIAf4@ep-fancy-cherry-a1179pkn-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function removeUsernameColumn() {
  const client = new Client({
    connectionString: DATABASE_URL,
  });

  try {
    console.log('🔗 배포환경 데이터베이스에 연결 중...');
    await client.connect();
    console.log('✅ 연결 성공!\n');

    // 트랜잭션 시작
    await client.query('BEGIN');

    // 1. username 컬럼이 있는지 확인
    console.log('📋 단계 1: username 컬럼 존재 여부 확인');
    const checkResult = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'users' 
      AND column_name = 'username'
    `);
    
    if (checkResult.rows.length === 0) {
      console.log('ℹ️  username 컬럼이 이미 존재하지 않습니다.');
      await client.query('ROLLBACK');
      return;
    }

    // 2. username 데이터를 loginId로 이동 (loginId가 비어있는 경우에만)
    console.log('\n📋 단계 2: username 데이터를 loginId로 마이그레이션');
    const migrateResult = await client.query(`
      UPDATE users 
      SET "loginId" = username 
      WHERE "loginId" IS NULL 
      AND username IS NOT NULL
      RETURNING id
    `);
    console.log(`✅ ${migrateResult.rowCount}개의 레코드에서 username을 loginId로 이동했습니다.`);

    // 3. username과 관련된 제약조건 확인
    console.log('\n📋 단계 3: username 관련 제약조건 확인');
    const constraintsResult = await client.query(`
      SELECT constraint_name, constraint_type
      FROM information_schema.table_constraints tc
      JOIN information_schema.constraint_column_usage ccu
        ON tc.constraint_name = ccu.constraint_name
      WHERE tc.table_name = 'users'
      AND ccu.column_name = 'username'
    `);

    // 4. username 관련 제약조건 제거
    for (const constraint of constraintsResult.rows) {
      console.log(`  - ${constraint.constraint_name} 제약조건 제거 중...`);
      await client.query(`ALTER TABLE users DROP CONSTRAINT IF EXISTS "${constraint.constraint_name}" CASCADE`);
      console.log(`  ✅ ${constraint.constraint_name} 제거 완료`);
    }

    // 5. username 관련 인덱스 확인 및 제거
    console.log('\n📋 단계 4: username 관련 인덱스 제거');
    const indexResult = await client.query(`
      SELECT indexname
      FROM pg_indexes
      WHERE tablename = 'users'
      AND indexdef LIKE '%username%'
    `);

    for (const index of indexResult.rows) {
      console.log(`  - ${index.indexname} 인덱스 제거 중...`);
      await client.query(`DROP INDEX IF EXISTS "${index.indexname}" CASCADE`);
      console.log(`  ✅ ${index.indexname} 제거 완료`);
    }

    // 6. username 컬럼 제거
    console.log('\n📋 단계 5: username 컬럼 제거');
    await client.query(`ALTER TABLE users DROP COLUMN username CASCADE`);
    console.log('✅ username 컬럼이 성공적으로 제거되었습니다!');

    // 7. 검증
    console.log('\n📋 검증: users 테이블 구조 확인');
    const verifyResult = await client.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'users' 
      AND column_name IN ('username', 'loginId')
      ORDER BY column_name
    `);
    
    console.log('\n현재 users 테이블의 관련 컬럼:');
    verifyResult.rows.forEach(row => {
      console.log(`  - ${row.column_name}`);
    });

    // 트랜잭션 커밋
    await client.query('COMMIT');
    console.log('\n✅ 모든 변경사항이 성공적으로 적용되었습니다!');

  } catch (error) {
    // 에러 발생 시 롤백
    await client.query('ROLLBACK');
    console.error('❌ 작업 실패:', error);
    console.error('에러 세부사항:', error.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n🔌 데이터베이스 연결 종료');
  }
}

// 실행
console.log('🚀 username 컬럼 제거 작업 시작\n');
removeUsernameColumn();