const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Environment variables
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function setupJobPostingsTable() {
  try {
    console.log('Connecting to database...');
    
    // Check if job_postings table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'job_postings'
      );
    `);
    
    console.log('job_postings table exists:', tableCheck.rows[0].exists);
    
    if (!tableCheck.rows[0].exists) {
      console.log('Creating job_postings table...');
      
      // Read the SQL file
      const sqlFile = path.join(__dirname, 'create_job_postings_table.sql');
      const sql = fs.readFileSync(sqlFile, 'utf8');
      
      // Execute the SQL
      await pool.query(sql);
      console.log('job_postings table created successfully!');
    } else {
      console.log('job_postings table already exists');
    }
    
    // Check for sample data
    const dataCheck = await pool.query('SELECT COUNT(*) as count FROM job_postings');
    console.log('Current job postings count:', dataCheck.rows[0].count);
    
    if (parseInt(dataCheck.rows[0].count) === 0) {
      console.log('No job postings found. Creating sample data...');
      
      // Create sample hospital users if they don't exist
      const hospitalUser1 = await pool.query(`
        INSERT INTO users (id, email, "userType", "hospitalName", "hospitalAddress", "isActive", "createdAt", "updatedAt")
        VALUES ('hospital-001', 'hospital1@example.com', 'HOSPITAL', '강남 동물병원', '서울시 강남구 테헤란로 123', true, NOW(), NOW())
        ON CONFLICT (id) DO NOTHING
        RETURNING id;
      `);
      
      const hospitalUser2 = await pool.query(`
        INSERT INTO users (id, email, "userType", "hospitalName", "hospitalAddress", "isActive", "createdAt", "updatedAt")
        VALUES ('hospital-002', 'hospital2@example.com', 'HOSPITAL', '부산 펫케어 병원', '부산시 해운대구 해운대로 456', true, NOW(), NOW())
        ON CONFLICT (id) DO NOTHING
        RETURNING id;
      `);
      
      // Create sample job postings
      const sampleJobs = [
        {
          id: 'job-001',
          hospitalId: 'hospital-001',
          title: '임상수의사 채용',
          position: '임상수의사',
          workType: ['정규직'],
          experience: ['신입', '1~3년'],
          major: ['수의학'],
          salary: '면접 후 결정',
          salaryType: '월급',
          workDays: ['월', '화', '수', '목', '금'],
          managerName: '김수의',
          managerPhone: '010-1234-5678',
          managerEmail: 'kim@hospital1.com',
          department: '진료부'
        },
        {
          id: 'job-002',
          hospitalId: 'hospital-002',
          title: '수의학과 인턴 모집',
          position: '인턴',
          workType: ['인턴', '파트타임'],
          experience: ['신입'],
          major: ['수의학'],
          salary: '시급 15,000원',
          salaryType: '시급',
          workDays: ['월', '화', '수', '목', '금'],
          managerName: '박병원',
          managerPhone: '010-5678-9012',
          managerEmail: 'park@hospital2.com',
          department: '교육팀'
        },
        {
          id: 'job-003',
          hospitalId: 'hospital-001',
          title: '야간 응급수의사',
          position: '응급수의사',
          workType: ['정규직'],
          experience: ['3~5년', '5년이상'],
          major: ['수의학'],
          salary: '연봉 5500만원',
          salaryType: '연봉',
          workDays: ['월', '화', '수', '목', '금', '토'],
          managerName: '이원장',
          managerPhone: '010-9876-5432',
          managerEmail: 'lee@hospital1.com',
          department: '응급실'
        }
      ];
      
      for (const job of sampleJobs) {
        await pool.query(`
          INSERT INTO job_postings (
            id, "hospitalId", title, position, "workType", experience, major, 
            salary, "salaryType", "workDays", "managerName", "managerPhone", 
            "managerEmail", department, "isActive", "isDraft", "createdAt", "updatedAt"
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW(), NOW()
          )
        `, [
          job.id, job.hospitalId, job.title, job.position, job.workType, job.experience,
          job.major, job.salary, job.salaryType, job.workDays, job.managerName,
          job.managerPhone, job.managerEmail, job.department, true, false
        ]);
      }
      
      console.log('Sample job postings created!');
    }
    
    // Final count check
    const finalCount = await pool.query('SELECT COUNT(*) as count FROM job_postings WHERE "isActive" = true AND "isDraft" = false');
    console.log('Active job postings count:', finalCount.rows[0].count);
    
  } catch (error) {
    console.error('Error setting up job_postings table:', error);
  } finally {
    await pool.end();
  }
}

setupJobPostingsTable();