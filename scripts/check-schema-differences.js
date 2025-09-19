const { Client } = require('pg');
const fs = require('fs');

// 환경별 DATABASE_URL
const LOCAL_DB_URL = "postgresql://neondb_owner:npg_stzc9ESNIAf4@ep-round-mouse-a1lqm39w-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
const PROD_DB_URL = "postgresql://neondb_owner:npg_stzc9ESNIAf4@ep-fancy-cherry-a1179pkn-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function getSchemaInfo(connectionString, envName) {
  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    console.log(`\n✅ ${envName} 환경 연결 성공`);

    // 모든 테이블 조회
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);

    const schema = {};

    // 각 테이블의 컬럼 정보 조회
    for (const table of tablesResult.rows) {
      const columnsResult = await client.query(`
        SELECT 
          column_name,
          data_type,
          character_maximum_length,
          is_nullable,
          column_default
        FROM information_schema.columns
        WHERE table_schema = 'public' 
        AND table_name = $1
        ORDER BY ordinal_position;
      `, [table.table_name]);

      schema[table.table_name] = columnsResult.rows;
    }

    return schema;
  } finally {
    await client.end();
  }
}

async function compareSchemas() {
  console.log('🔍 스키마 비교 시작...\n');

  // 로컬과 배포환경 스키마 가져오기
  const localSchema = await getSchemaInfo(LOCAL_DB_URL, '로컬');
  const prodSchema = await getSchemaInfo(PROD_DB_URL, '배포');

  const differences = {
    missingTables: [],
    extraTables: [],
    tableDifferences: {}
  };

  // 로컬에만 있는 테이블 찾기
  for (const tableName of Object.keys(localSchema)) {
    if (!prodSchema[tableName]) {
      differences.missingTables.push(tableName);
    }
  }

  // 배포에만 있는 테이블 찾기
  for (const tableName of Object.keys(prodSchema)) {
    if (!localSchema[tableName]) {
      differences.extraTables.push(tableName);
    }
  }

  // 공통 테이블의 컬럼 차이 비교
  for (const tableName of Object.keys(localSchema)) {
    if (prodSchema[tableName]) {
      const localColumns = localSchema[tableName];
      const prodColumns = prodSchema[tableName];
      
      const localColumnNames = localColumns.map(c => c.column_name);
      const prodColumnNames = prodColumns.map(c => c.column_name);
      
      const missingColumns = localColumnNames.filter(c => !prodColumnNames.includes(c));
      const extraColumns = prodColumnNames.filter(c => !localColumnNames.includes(c));
      
      if (missingColumns.length > 0 || extraColumns.length > 0) {
        differences.tableDifferences[tableName] = {
          missingColumns: missingColumns,
          extraColumns: extraColumns
        };
      }
    }
  }

  // 결과 출력
  console.log('\n📊 스키마 비교 결과:\n');
  console.log('='.repeat(60));

  if (differences.missingTables.length > 0) {
    console.log('\n❌ 배포환경에 없는 테이블:');
    differences.missingTables.forEach(t => console.log(`  - ${t}`));
  }

  if (differences.extraTables.length > 0) {
    console.log('\n⚠️  배포환경에만 있는 테이블:');
    differences.extraTables.forEach(t => console.log(`  - ${t}`));
  }

  if (Object.keys(differences.tableDifferences).length > 0) {
    console.log('\n📋 테이블별 컬럼 차이:');
    for (const [tableName, diff] of Object.entries(differences.tableDifferences)) {
      console.log(`\n  📁 ${tableName}:`);
      if (diff.missingColumns.length > 0) {
        console.log('    ❌ 배포환경에 없는 컬럼:');
        diff.missingColumns.forEach(c => console.log(`      - ${c}`));
      }
      if (diff.extraColumns.length > 0) {
        console.log('    ⚠️  배포환경에만 있는 컬럼:');
        diff.extraColumns.forEach(c => console.log(`      - ${c}`));
      }
    }
  }

  // 상세 정보를 JSON 파일로 저장
  fs.writeFileSync('schema-differences.json', JSON.stringify({
    timestamp: new Date().toISOString(),
    differences,
    localSchema,
    prodSchema
  }, null, 2));

  console.log('\n\n💾 상세 정보가 schema-differences.json 파일에 저장되었습니다.');
  
  return differences;
}

// 실행
compareSchemas().catch(console.error);