const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function testJobsAPI() {
  try {
    console.log('Testing jobs API query...');
    
    // Test the exact query from the API
    const jobsResult = await pool.query(`
      SELECT 
        j.id,
        j.title,
        j.benefits as description,
        j."workType",
        j.salary,
        j."salaryType",
        j.department,
        j.benefits,
        j."isActive",
        j."isDraft",
        j."createdAt",
        j."updatedAt",
        j."viewCount",
        j."recruitEndDate",
        h.id as hospital_id,
        hosp."hospitalName" as hospital_name,
        h.phone as hospital_phone,
        hosp."hospitalAddress" as hospital_address,
        COUNT(DISTINCT a.id) as applicant_count,
        COUNT(DISTINCT l.id) as like_count
      FROM jobs j
      LEFT JOIN users h ON j."hospitalId" = h.id
      LEFT JOIN hospitals hosp ON h.id = hosp."userId"
      LEFT JOIN applications a ON j.id = a."jobId"
      LEFT JOIN job_likes l ON j.id = l."jobId"
      GROUP BY j.id, h.id, h.phone, hosp."hospitalName", hosp."hospitalAddress"
      ORDER BY j."createdAt" DESC
      LIMIT 2
    `);
    
    console.log('Query successful!');
    console.log('Jobs found:', jobsResult.rows.length);
    
    // Test the data transformation
    const jobs = jobsResult.rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description || row.benefits || '',
      hospitalName: row.hospital_name,
      hospitalId: row.hospital_id,
      hospitalPhone: row.hospital_phone,
      hospitalAddress: row.hospital_address,
      location: row.hospital_address || row.department,
      workType: Array.isArray(row.workType) ? row.workType[0] : 'FULL_TIME',
      salary: row.salary,
      salaryType: row.salaryType,
      requirements: '',
      benefits: row.benefits,
      status: row.isActive && !row.isDraft ? 'ACTIVE' : row.isDraft ? 'PENDING' : 'INACTIVE',
      isUrgent: false,
      deadline: row.recruitEndDate,
      createdAt: row.createdAt?.toISOString().split('T')[0],
      updatedAt: row.updatedAt?.toISOString().split('T')[0],
      viewCount: parseInt(row.viewCount) || 0,
      applicantCount: parseInt(row.applicant_count) || 0,
      reportCount: 0,
      likeCount: parseInt(row.like_count) || 0,
    }));
    
    console.log('Data transformation successful!');
    console.log('First job:', JSON.stringify(jobs[0], null, 2));
    
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await pool.end();
  }
}

testJobsAPI();