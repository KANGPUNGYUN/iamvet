#!/usr/bin/env node

/**
 * Database Migration Script
 * 
 * Usage:
 *   node scripts/migrate.js
 *   npm run migrate
 * 
 * This script runs all pending database migrations to ensure
 * the production database has the same structure as development.
 */

const https = require('https');
const http = require('http');

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function runMigration() {
  console.log('🚀 Starting database migration...');
  console.log(`📍 Target: ${BASE_URL}`);
  
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}/api/migrate`;
    const protocol = url.startsWith('https') ? https : http;
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const req = protocol.request(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          
          if (response.status === 'success') {
            console.log('✅ Migration completed successfully!');
            console.log('\n📋 Migration Results:');
            response.data.results.forEach(result => {
              console.log(`  ${result}`);
            });
            
            console.log('\n📊 Applied Migrations:');
            response.data.appliedMigrations.forEach(migration => {
              console.log(`  📅 ${migration.migration_name} - ${migration.executed_at}`);
              if (migration.description) {
                console.log(`     ${migration.description}`);
              }
            });
            
            resolve(response);
          } else {
            console.error('❌ Migration failed:', response.message);
            reject(new Error(response.message));
          }
        } catch (parseError) {
          console.error('❌ Failed to parse response:', parseError.message);
          console.error('Raw response:', data);
          reject(parseError);
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('❌ Migration request failed:', error.message);
      reject(error);
    });
    
    req.end();
  });
}

async function checkMigrationStatus() {
  console.log('📊 Checking migration status...');
  
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}/api/migrate`;
    const protocol = url.startsWith('https') ? https : http;
    
    const req = protocol.request(url, { method: 'GET' }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          
          if (response.status === 'success') {
            console.log('📋 Available Migrations:');
            response.data.availableMigrations.forEach(migration => {
              console.log(`  📄 ${migration}`);
            });
            
            console.log('\n📊 Applied Migrations:');
            if (response.data.appliedMigrations.length === 0) {
              console.log('  🔍 No migrations found');
            } else {
              response.data.appliedMigrations.forEach(migration => {
                console.log(`  ✅ ${migration.migration_name} - ${migration.executed_at}`);
              });
            }
            
            resolve(response);
          } else {
            console.error('❌ Failed to check status:', response.message);
            reject(new Error(response.message));
          }
        } catch (parseError) {
          console.error('❌ Failed to parse response:', parseError.message);
          reject(parseError);
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('❌ Status check failed:', error.message);
      reject(error);
    });
    
    req.end();
  });
}

async function main() {
  try {
    const command = process.argv[2];
    
    if (command === 'status') {
      await checkMigrationStatus();
    } else {
      await runMigration();
    }
    
    process.exit(0);
  } catch (error) {
    console.error('💥 Migration script failed:', error.message);
    process.exit(1);
  }
}

main();