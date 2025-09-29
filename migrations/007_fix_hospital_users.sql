-- Fix hospital users without hospital records
-- This migration ensures all HOSPITAL type users have corresponding hospital records

-- Insert missing hospital records for HOSPITAL type users
INSERT INTO hospitals (
    id,
    "userId",
    "hospitalName",
    "representativeName",
    "createdAt",
    "updatedAt"
)
SELECT 
    'hosp_' || u.id as id,
    u.id as "userId",
    COALESCE(u."profileName", '병원') as "hospitalName",
    COALESCE(u."realName", '대표자') as "representativeName",
    u."createdAt",
    u."updatedAt"
FROM users u
WHERE u."userType" = 'HOSPITAL'
AND NOT EXISTS (
    SELECT 1 FROM hospitals h WHERE h."userId" = u.id
);

-- Log this migration
INSERT INTO migration_log (migration_name, description, executed_at) 
VALUES ('007_fix_hospital_users.sql', 'Create missing hospital records for HOSPITAL type users', NOW())
ON CONFLICT (migration_name) DO NOTHING;