const { Pool } = require('pg');

// Environment variables
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function addSampleJobs() {
  try {
    console.log('Connecting to database...');
    
    // Create more sample hospital users
    const hospitals = [
      {
        id: 'hospital-003',
        email: 'hospital3@example.com',
        phone: '010-1111-0000',
        hospitalName: '서울 종합동물병원',
        hospitalAddress: '서울시 서초구 서초대로 789'
      },
      {
        id: 'hospital-004',
        email: 'hospital4@example.com',
        phone: '010-2222-0000',
        hospitalName: '대구 24시 동물병원',
        hospitalAddress: '대구시 중구 동성로 321'
      },
      {
        id: 'hospital-005',
        email: 'hospital5@example.com',
        phone: '010-3333-0000',
        hospitalName: '인천 펫클리닉',
        hospitalAddress: '인천시 남동구 구월로 456'
      }
    ];
    
    for (const hospital of hospitals) {
      // 먼저 users 테이블에 병원 사용자 생성
      await pool.query(`
        INSERT INTO users (id, email, phone, "userType", "isActive", "termsAgreedAt", "privacyAgreedAt", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, 'HOSPITAL', true, NOW(), NOW(), NOW(), NOW())
        ON CONFLICT (id) DO NOTHING
      `, [hospital.id, hospital.email, hospital.phone]);
      
      // hospitals 테이블에 병원 정보 생성
      await pool.query(`
        INSERT INTO hospitals (id, "userId", "hospitalName", "representativeName", "hospitalAddress", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
        ON CONFLICT ("userId") DO NOTHING
      `, ['hosp-' + hospital.id, hospital.id, hospital.hospitalName, '대표원장', hospital.hospitalAddress]);
    }
    
    // Create more diverse job postings
    const sampleJobs = [
      {
        id: 'job-004',
        hospitalId: 'hospital-003',
        title: '외과 전문 수의사',
        position: '외과수의사',
        workType: ['정규직'],
        experience: ['3~5년', '5년이상'],
        major: ['수의학'],
        salary: '연봉 6000만원~7000만원',
        salaryType: '연봉',
        workDays: ['월', '화', '수', '목', '금'],
        managerName: '외과부장',
        managerPhone: '010-1111-2222',
        managerEmail: 'surgery@hospital3.com',
        department: '외과'
      },
      {
        id: 'job-005',
        hospitalId: 'hospital-004',
        title: '야간 응급 수의사',
        position: '응급수의사',
        workType: ['정규직', '파트타임'],
        experience: ['1~3년', '3~5년'],
        major: ['수의학'],
        salary: '면접 후 결정',
        salaryType: '월급',
        workDays: ['월', '화', '수', '목', '금', '토', '일'],
        managerName: '응급실장',
        managerPhone: '010-3333-4444',
        managerEmail: 'emergency@hospital4.com',
        department: '응급실'
      },
      {
        id: 'job-006',
        hospitalId: 'hospital-005',
        title: '신입 수의사 모집',
        position: '임상수의사',
        workType: ['정규직'],
        experience: ['신입'],
        major: ['수의학'],
        salary: '연봉 4500만원',
        salaryType: '연봉',
        workDays: ['월', '화', '수', '목', '금', '토'],
        managerName: '인사담당자',
        managerPhone: '010-5555-6666',
        managerEmail: 'hr@hospital5.com',
        department: '진료부'
      },
      {
        id: 'job-007',
        hospitalId: 'hospital-003',
        title: '수의학과 대학생 알바',
        position: '보조직',
        workType: ['파트타임'],
        experience: ['신입'],
        major: ['수의학'],
        salary: '시급 13,000원',
        salaryType: '시급',
        workDays: ['토', '일'],
        managerName: '관리팀',
        managerPhone: '010-7777-8888',
        managerEmail: 'parttime@hospital3.com',
        department: '관리팀'
      },
      {
        id: 'job-008',
        hospitalId: 'hospital-004',
        title: '치과 전문의',
        position: '치과수의사',
        workType: ['정규직'],
        experience: ['5년이상'],
        major: ['수의학'],
        salary: '연봉 7500만원',
        salaryType: '연봉',
        workDays: ['월', '화', '수', '목', '금'],
        managerName: '치과부장',
        managerPhone: '010-9999-0000',
        managerEmail: 'dental@hospital4.com',
        department: '치과'
      }
    ];
    
    for (const job of sampleJobs) {
      await pool.query(`
        INSERT INTO jobs (
          id, "hospitalId", title, position, "workType", experience, major, 
          salary, "salaryType", "workDays", "managerName", "managerPhone", 
          "managerEmail", department, "isActive", "isDraft", "createdAt", "updatedAt"
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW(), NOW()
        )
        ON CONFLICT (id) DO NOTHING
      `, [
        job.id, job.hospitalId, job.title, job.position, job.workType, job.experience,
        job.major, job.salary, job.salaryType, job.workDays, job.managerName,
        job.managerPhone, job.managerEmail, job.department, true, false
      ]);
    }
    
    console.log('Sample job postings added!');
    
    // Check final count
    const finalCount = await pool.query('SELECT COUNT(*) as count FROM jobs WHERE "isActive" = true AND "isDraft" = false');
    console.log('Total active job postings:', finalCount.rows[0].count);
    
    // Test the query that the API uses
    console.log('\nTesting API query...');
    const testQuery = `
      SELECT j.*, h."hospitalName" as hospital_name, u."profileImage" as hospital_logo, h."hospitalAddress" as hospital_location
      FROM jobs j
      JOIN users u ON j."hospitalId" = u.id
      JOIN hospitals h ON u.id = h."userId"
      WHERE j."isActive" = true AND j."isDraft" = false AND j."deletedAt" IS NULL
      ORDER BY j."createdAt" DESC
      LIMIT 5
    `;
    
    const testResult = await pool.query(testQuery);
    console.log('Test query result - jobs found:', testResult.rows.length);
    
    if (testResult.rows.length > 0) {
      console.log('First job data:', {
        id: testResult.rows[0].id,
        title: testResult.rows[0].title,
        hospitalName: testResult.rows[0].hospital_name,
        position: testResult.rows[0].position,
        workType: testResult.rows[0].workType,
        experience: testResult.rows[0].experience
      });
    }
    
  } catch (error) {
    console.error('Error adding sample jobs:', error);
    console.error('Error details:', error.message);
  } finally {
    await pool.end();
  }
}

addSampleJobs();