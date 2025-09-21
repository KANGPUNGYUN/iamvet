-- Migration: Add parentId column to lecture_comments table for reply functionality
-- Date: 2025-01-21

-- Check if the table exists first, if not create it
CREATE TABLE IF NOT EXISTS lecture_comments (
    id VARCHAR(255) PRIMARY KEY,
    "lectureId" VARCHAR(255) NOT NULL,
    "userId" VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW(),
    "deletedAt" TIMESTAMP NULL
);

-- Add parentId column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'lecture_comments' 
        AND column_name = 'parentId'
    ) THEN
        ALTER TABLE lecture_comments 
        ADD COLUMN "parentId" VARCHAR(255) NULL;
        
        -- Add foreign key constraint for self-referencing
        ALTER TABLE lecture_comments 
        ADD CONSTRAINT fk_lecture_comment_parent 
        FOREIGN KEY ("parentId") REFERENCES lecture_comments(id) ON DELETE CASCADE;
        
        -- Add index for better performance on parent lookups
        CREATE INDEX IF NOT EXISTS idx_lecture_comments_parent_id 
        ON lecture_comments("parentId");
        
        -- Add index for lecture queries
        CREATE INDEX IF NOT EXISTS idx_lecture_comments_lecture_id 
        ON lecture_comments("lectureId");
        
        RAISE NOTICE 'Added parentId column to lecture_comments table successfully';
    ELSE
        RAISE NOTICE 'parentId column already exists in lecture_comments table';
    END IF;
END $$;

-- Log this migration
INSERT INTO migration_log (migration_name, executed_at, description) 
VALUES (
  '003_add_parentid_to_lecture_comments', 
  NOW(), 
  'Added parentId column to lecture_comments table for reply functionality'
) ON CONFLICT (migration_name) DO NOTHING;