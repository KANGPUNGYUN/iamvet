const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function testAPI() {
  try {
    console.log('Testing database connection...');
    
    // Test 1: Check if job_postings table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'job_postings'
      );
    `);
    console.log('✓ job_postings table exists:', tableCheck.rows[0].exists);
    
    // Test 2: Count all job postings
    const countAll = await pool.query('SELECT COUNT(*) as count FROM job_postings');
    console.log('✓ Total job_postings:', countAll.rows[0].count);
    
    // Test 3: Count active job postings
    const countActive = await pool.query('SELECT COUNT(*) as count FROM job_postings WHERE "isActive" = true AND "isDraft" = false');
    console.log('✓ Active job_postings:', countActive.rows[0].count);
    
    // Test 4: Test the exact query used in API
    const apiQuery = `
      SELECT j.*, h."hospitalName" as hospital_name, u."profileImage" as hospital_logo, h."hospitalAddress" as hospital_location
      FROM job_postings j
      JOIN users u ON j."hospitalId" = u.id
      JOIN hospitals h ON u.id = h."userId"
      WHERE j."isActive" = true AND j."isDraft" = false AND j."deletedAt" IS NULL
      ORDER BY j."createdAt" DESC
      LIMIT 5
    `;
    
    console.log('\nTesting API query...');
    const result = await pool.query(apiQuery);
    console.log('✓ API query successful, rows returned:', result.rows.length);
    
    if (result.rows.length > 0) {
      console.log('\nFirst job data:');
      const job = result.rows[0];
      console.log('- ID:', job.id);
      console.log('- Title:', job.title);
      console.log('- Hospital:', job.hospital_name);
      console.log('- Position:', job.position);
      console.log('- Work Type:', job.workType);
      console.log('- Experience:', job.experience);
      console.log('- Hospital Location:', job.hospital_location);
    } else {
      console.log('No jobs found. Let\'s check why...');
      
      // Check if there are any job_postings at all
      const allJobs = await pool.query('SELECT id, "hospitalId", "isActive", "isDraft", "deletedAt" FROM job_postings LIMIT 3');
      console.log('Sample job_postings:', allJobs.rows);
      
      // Check if there are hospital users
      const hospitalUsers = await pool.query('SELECT id, "userType" FROM users WHERE "userType" = \'HOSPITAL\' LIMIT 3');
      console.log('Sample hospital users:', hospitalUsers.rows);
      
      // Check hospitals table
      const hospitals = await pool.query('SELECT "userId", "hospitalName", "hospitalAddress" FROM hospitals LIMIT 3');
      console.log('Sample hospitals:', hospitals.rows);
      
      // Check JOIN compatibility
      const joinTest = await pool.query(`
        SELECT j.id as job_id, j."hospitalId", u.id as user_id, h."hospitalName"
        FROM job_postings j
        LEFT JOIN users u ON j."hospitalId" = u.id
        LEFT JOIN hospitals h ON u.id = h."userId"
        LIMIT 3
      `);
      console.log('JOIN test results:', joinTest.rows);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Error details:', error);
  } finally {
    await pool.end();
  }
}

testAPI();