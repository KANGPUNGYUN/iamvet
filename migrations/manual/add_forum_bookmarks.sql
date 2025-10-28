-- 임상포럼 북마크 기능을 위한 forum_bookmarks 테이블 생성
-- 기존 북마크 테이블들(job_bookmarks, resume_bookmarks, lecture_bookmarks, transfer_bookmarks)과 동일한 패턴

CREATE TABLE IF NOT EXISTS forum_bookmarks (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    forum_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- 외래 키 제약 조건
    CONSTRAINT forum_bookmarks_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT forum_bookmarks_forum_id_fkey 
        FOREIGN KEY (forum_id) REFERENCES forums(id) ON DELETE CASCADE,
    
    -- 중복 북마크 방지를 위한 유니크 제약 조건 (deleted_at이 NULL인 경우만)
    UNIQUE (user_id, forum_id) WHERE deleted_at IS NULL
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_forum_bookmarks_user_id ON forum_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_forum_bookmarks_forum_id ON forum_bookmarks(forum_id);
CREATE INDEX IF NOT EXISTS idx_forum_bookmarks_created_at ON forum_bookmarks(created_at);

-- 확인을 위한 쿼리 (실행 후 확인용)
-- SELECT table_name, column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_name = 'forum_bookmarks'
-- ORDER BY ordinal_position;