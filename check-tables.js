const { Pool } = require('pg');

// Read environment variables
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function checkTables() {
  const client = await pool.connect();
  
  try {
    console.log('Connected to database');
    
    // Check if job_postings table exists
    const tableCheck = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('jobs', 'job_postings')
      ORDER BY table_name;
    `);
    
    console.log('Existing job-related tables:');
    tableCheck.rows.forEach(row => {
      console.log(`- ${row.table_name}`);
    });
    
    // Check columns in job_postings if it exists
    if (tableCheck.rows.some(row => row.table_name === 'job_postings')) {
      console.log('\nColumns in job_postings table:');
      const columnsCheck = await client.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns 
        WHERE table_name = 'job_postings' 
        ORDER BY ordinal_position;
      `);
      
      columnsCheck.rows.forEach(row => {
        console.log(`- ${row.column_name}: ${row.data_type} (${row.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
      });
      
      // Check if there are any records
      const countResult = await client.query('SELECT COUNT(*) as count FROM job_postings');
      console.log(`\nNumber of records in job_postings: ${countResult.rows[0].count}`);
      
      // Show recent records if any
      if (parseInt(countResult.rows[0].count) > 0) {
        const recentRecords = await client.query(`
          SELECT id, title, "hospitalId", "createdAt" 
          FROM job_postings 
          ORDER BY "createdAt" DESC 
          LIMIT 5
        `);
        
        console.log('\nRecent job postings:');
        recentRecords.rows.forEach(row => {
          console.log(`- ${row.id}: ${row.title} (Hospital: ${row.hospitalId}, Created: ${row.createdAt})`);
        });
      }
    } else {
      console.log('\njob_postings table does not exist!');
    }
    
    // Check columns in jobs table if it exists
    if (tableCheck.rows.some(row => row.table_name === 'jobs')) {
      console.log('\nColumns in jobs table:');
      const columnsCheck = await client.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns 
        WHERE table_name = 'jobs' 
        ORDER BY ordinal_position;
      `);
      
      columnsCheck.rows.forEach(row => {
        console.log(`- ${row.column_name}: ${row.data_type} (${row.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
      });
      
      // Check if there are any records
      const countResult = await client.query('SELECT COUNT(*) as count FROM jobs');
      console.log(`\nNumber of records in jobs: ${countResult.rows[0].count}`);
    }
    
  } catch (error) {
    console.error('Error checking tables:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

checkTables();