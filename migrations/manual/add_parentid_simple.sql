-- Simple SQL to add parentId column to lecture_comments table
-- Run this directly in your PostgreSQL database

-- Add parentId column if it doesn't exist
ALTER TABLE lecture_comments 
ADD COLUMN IF NOT EXISTS "parentId" VARCHAR(255) NULL;

-- Add foreign key constraint for self-referencing (optional)
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_lecture_comment_parent'
    ) THEN
        ALTER TABLE lecture_comments 
        ADD CONSTRAINT fk_lecture_comment_parent 
        FOREIGN KEY ("parentId") REFERENCES lecture_comments(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_lecture_comments_parent_id 
ON lecture_comments("parentId");

CREATE INDEX IF NOT EXISTS idx_lecture_comments_lecture_id 
ON lecture_comments("lectureId");

-- Verify the changes
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'lecture_comments' 
ORDER BY ordinal_position;