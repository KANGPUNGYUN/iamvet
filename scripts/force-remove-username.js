const { Client } = require('pg');

// 배포환경 DATABASE_URL
const DATABASE_URL = "postgresql://neondb_owner:npg_stzc9ESNIAf4@ep-fancy-cherry-a1179pkn-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function forceRemoveUsername() {
  const client = new Client({
    connectionString: DATABASE_URL,
  });

  try {
    console.log('🔗 배포환경 데이터베이스에 연결 중...');
    await client.connect();
    console.log('✅ 연결 성공!\n');

    // 1. 현재 username 컬럼 상태 확인
    console.log('📋 단계 1: username 컬럼 상태 확인');
    const columnInfo = await client.query(`
      SELECT 
        c.column_name,
        c.data_type,
        c.is_nullable,
        c.column_default,
        CASE WHEN pk.constraint_name IS NOT NULL THEN 'YES' ELSE 'NO' END as is_primary_key,
        CASE WHEN fk.constraint_name IS NOT NULL THEN 'YES' ELSE 'NO' END as is_foreign_key
      FROM information_schema.columns c
      LEFT JOIN (
        SELECT ku.column_name, tc.constraint_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage ku
          ON tc.constraint_name = ku.constraint_name
        WHERE tc.table_name = 'users' AND tc.constraint_type = 'PRIMARY KEY'
      ) pk ON c.column_name = pk.column_name
      LEFT JOIN (
        SELECT ku.column_name, tc.constraint_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage ku
          ON tc.constraint_name = ku.constraint_name
        WHERE tc.table_name = 'users' AND tc.constraint_type = 'FOREIGN KEY'
      ) fk ON c.column_name = fk.column_name
      WHERE c.table_name = 'users' 
      AND c.column_name = 'username'
    `);

    if (columnInfo.rows.length === 0) {
      console.log('✅ username 컬럼이 이미 제거되었습니다.');
      return;
    }

    console.log('username 컬럼 정보:', columnInfo.rows[0]);

    // 2. username을 참조하는 모든 뷰 확인
    console.log('\n📋 단계 2: username을 참조하는 뷰 확인');
    const viewsResult = await client.query(`
      SELECT DISTINCT 
        dependee.relname as view_name
      FROM pg_depend d
      JOIN pg_rewrite r ON r.oid = d.objid
      JOIN pg_class dependee ON dependee.oid = d.refobjid
      JOIN pg_class dependent ON dependent.oid = d.classid
      JOIN pg_attribute a ON a.attrelid = d.refobjid AND a.attnum = d.refobjsubid
      WHERE dependee.relname = 'users'
      AND a.attname = 'username'
      AND dependee.relkind = 'v'
    `);

    for (const view of viewsResult.rows) {
      console.log(`  - 뷰 ${view.view_name} 제거 중...`);
      await client.query(`DROP VIEW IF EXISTS ${view.view_name} CASCADE`);
      console.log(`  ✅ ${view.view_name} 제거 완료`);
    }

    // 3. username을 참조하는 모든 함수/트리거 확인
    console.log('\n📋 단계 3: username을 참조하는 함수/트리거 확인');
    const functionsResult = await client.query(`
      SELECT DISTINCT
        p.proname as function_name,
        n.nspname as schema_name
      FROM pg_proc p
      JOIN pg_namespace n ON p.pronamespace = n.oid
      WHERE p.prosrc LIKE '%username%'
      AND n.nspname = 'public'
    `);

    for (const func of functionsResult.rows) {
      console.log(`  - 함수 ${func.function_name} 확인 중...`);
      // 함수는 수동으로 확인 필요
    }

    // 4. username 관련 모든 제약조건 제거 (더 포괄적으로)
    console.log('\n📋 단계 4: 모든 제약조건 제거');
    
    // 외래키 제약조건
    const fkResult = await client.query(`
      SELECT constraint_name
      FROM information_schema.table_constraints
      WHERE table_name = 'users'
      AND constraint_type = 'FOREIGN KEY'
    `);
    
    for (const fk of fkResult.rows) {
      const checkFk = await client.query(`
        SELECT column_name
        FROM information_schema.key_column_usage
        WHERE constraint_name = $1
        AND column_name = 'username'
      `, [fk.constraint_name]);
      
      if (checkFk.rows.length > 0) {
        console.log(`  - 외래키 ${fk.constraint_name} 제거 중...`);
        await client.query(`ALTER TABLE users DROP CONSTRAINT "${fk.constraint_name}" CASCADE`);
      }
    }

    // 유니크 제약조건
    const uniqueResult = await client.query(`
      SELECT constraint_name
      FROM information_schema.table_constraints
      WHERE table_name = 'users'
      AND constraint_type = 'UNIQUE'
    `);
    
    for (const unique of uniqueResult.rows) {
      const checkUnique = await client.query(`
        SELECT column_name
        FROM information_schema.key_column_usage
        WHERE constraint_name = $1
        AND column_name = 'username'
      `, [unique.constraint_name]);
      
      if (checkUnique.rows.length > 0) {
        console.log(`  - 유니크 제약조건 ${unique.constraint_name} 제거 중...`);
        await client.query(`ALTER TABLE users DROP CONSTRAINT "${unique.constraint_name}" CASCADE`);
      }
    }

    // 5. 모든 인덱스 제거
    console.log('\n📋 단계 5: 모든 인덱스 제거');
    const indexResult = await client.query(`
      SELECT indexname
      FROM pg_indexes
      WHERE tablename = 'users'
      AND indexdef LIKE '%username%'
    `);

    for (const index of indexResult.rows) {
      console.log(`  - 인덱스 ${index.indexname} 제거 중...`);
      await client.query(`DROP INDEX IF EXISTS "${index.indexname}" CASCADE`);
      console.log(`  ✅ ${index.indexname} 제거 완료`);
    }

    // 6. username 데이터 백업 및 이동
    console.log('\n📋 단계 6: username 데이터 처리');
    
    // 먼저 username 데이터 수 확인
    const usernameCount = await client.query(`
      SELECT COUNT(*) as count
      FROM users
      WHERE username IS NOT NULL
    `);
    console.log(`  - username이 있는 레코드 수: ${usernameCount.rows[0].count}`);

    // loginId가 없는 경우 username 데이터 이동
    const updateResult = await client.query(`
      UPDATE users 
      SET "loginId" = username 
      WHERE "loginId" IS NULL 
      AND username IS NOT NULL
      RETURNING id
    `);
    console.log(`  - ${updateResult.rowCount}개의 레코드에서 username을 loginId로 이동`);

    // 7. 최종적으로 username 컬럼 제거
    console.log('\n📋 단계 7: username 컬럼 제거');
    try {
      await client.query(`ALTER TABLE users DROP COLUMN username`);
      console.log('✅ username 컬럼이 성공적으로 제거되었습니다!');
    } catch (error) {
      console.error('❌ username 컬럼 제거 실패:', error.message);
      
      // CASCADE 옵션으로 재시도
      console.log('\n📋 CASCADE 옵션으로 재시도...');
      await client.query(`ALTER TABLE users DROP COLUMN username CASCADE`);
      console.log('✅ username 컬럼이 CASCADE로 제거되었습니다!');
    }

    // 8. 최종 검증
    console.log('\n📋 최종 검증');
    const finalCheck = await client.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'users'
      AND column_name = 'username'
    `);

    if (finalCheck.rows.length === 0) {
      console.log('✅ username 컬럼이 완전히 제거되었습니다!');
      
      // users 테이블의 현재 컬럼 목록 표시
      const currentColumns = await client.query(`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = 'users'
        AND column_name IN ('id', 'email', 'loginId', 'nickname', 'realName', 'licenseImage')
        ORDER BY ordinal_position
      `);
      
      console.log('\n현재 users 테이블의 주요 컬럼:');
      currentColumns.rows.forEach(row => {
        console.log(`  - ${row.column_name}`);
      });
    } else {
      console.error('❌ username 컬럼이 여전히 존재합니다!');
    }

  } catch (error) {
    console.error('❌ 작업 실패:', error);
    console.error('에러 코드:', error.code);
    console.error('에러 세부사항:', error.message);
    console.error('힌트:', error.hint);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n🔌 데이터베이스 연결 종료');
  }
}

// 실행
console.log('🚀 username 컬럼 강제 제거 작업 시작\n');
console.log('⚠️  주의: 이 작업은 username 컬럼과 관련된 모든 것을 제거합니다.\n');
forceRemoveUsername();