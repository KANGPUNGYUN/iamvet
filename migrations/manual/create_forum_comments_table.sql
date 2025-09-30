-- 포럼 댓글 테이블 생성
CREATE TABLE IF NOT EXISTS forum_comments (
  id VARCHAR(255) PRIMARY KEY,
  forum_id VARCHAR(255) NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  parent_id VARCHAR(255) NULL, -- 대댓글을 위한 부모 댓글 ID
  content TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "deletedAt" TIMESTAMP WITH TIME ZONE NULL,
  
  FOREIGN KEY (forum_id) REFERENCES forum_posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_id) REFERENCES forum_comments(id) ON DELETE CASCADE
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_forum_comments_forum_id ON forum_comments(forum_id);
CREATE INDEX IF NOT EXISTS idx_forum_comments_user_id ON forum_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_forum_comments_parent_id ON forum_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_forum_comments_created_at ON forum_comments("createdAt");

-- 댓글 수 업데이트를 위한 트리거 함수 (선택사항)
CREATE OR REPLACE FUNCTION update_forum_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- 댓글이 추가될 때 포럼 댓글 수 증가 (만약 forum_posts에 commentCount 컬럼이 있다면)
    -- UPDATE forum_posts SET comment_count = comment_count + 1 WHERE id = NEW.forum_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- 댓글이 삭제될 때 포럼 댓글 수 감소
    -- UPDATE forum_posts SET comment_count = comment_count - 1 WHERE id = OLD.forum_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 트리거 생성 (선택사항)
-- CREATE TRIGGER forum_comment_count_trigger
--   AFTER INSERT OR DELETE ON forum_comments
--   FOR EACH ROW
--   EXECUTE FUNCTION update_forum_comment_count();