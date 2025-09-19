-- Migration: Create migration log table
-- Date: 2025-09-19
-- Description: Create a table to track database migrations

-- Create migration_log table if it doesn't exist
CREATE TABLE IF NOT EXISTS migration_log (
  id SERIAL PRIMARY KEY,
  migration_name VARCHAR(255) UNIQUE NOT NULL,
  executed_at TIMESTAMP DEFAULT NOW(),
  description TEXT
);

-- Log this migration
INSERT INTO migration_log (migration_name, executed_at, description) 
VALUES (
  '000_create_migration_log', 
  NOW(), 
  'Created migration_log table to track database migrations'
) ON CONFLICT (migration_name) DO NOTHING;