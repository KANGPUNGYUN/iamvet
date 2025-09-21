// Quick migration runner script
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Database configuration - update these values as needed
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'your_database_name',
  user: process.env.DB_USER || 'your_username',
  password: process.env.DB_PASSWORD || 'your_password',
});

async function runMigration(migrationFile) {
  try {
    console.log(`Running migration: ${migrationFile}`);
    
    const migrationPath = path.join(__dirname, 'migrations', migrationFile);
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    await pool.query(sql);
    console.log(`✅ Migration ${migrationFile} completed successfully`);
    
  } catch (error) {
    console.error(`❌ Migration ${migrationFile} failed:`, error.message);
    throw error;
  }
}

async function main() {
  try {
    // Run the specific migration
    await runMigration('003_add_parentid_to_lecture_comments.sql');
    
    console.log('\n🎉 All migrations completed successfully!');
    
  } catch (error) {
    console.error('\n💥 Migration failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run if this file is executed directly
if (require.main === module) {
  main();
}

module.exports = { runMigration };