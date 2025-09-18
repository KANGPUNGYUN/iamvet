const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Read environment variables
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function runMigration() {
  const client = await pool.connect();
  
  try {
    console.log('Connected to database');
    
    // Read the SQL file
    const sqlContent = fs.readFileSync(path.join(__dirname, 'create_job_postings_table.sql'), 'utf8');
    
    console.log('Executing migration...');
    await client.query(sqlContent);
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();