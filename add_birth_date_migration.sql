-- Add birthDate column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS "birthDate" TIMESTAMP(3);

-- Add comment to the column
COMMENT ON COLUMN users."birthDate" IS '사용자 생년월일';