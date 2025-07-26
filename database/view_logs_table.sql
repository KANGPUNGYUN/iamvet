-- 조회 로그 테이블 생성
CREATE TABLE IF NOT EXISTS view_logs (
  id SERIAL PRIMARY KEY,
  content_type VARCHAR(20) NOT NULL, -- 'forum', 'job', 'lecture', 'resume', 'transfer'
  content_id VARCHAR(255) NOT NULL,  -- 조회한 콘텐츠의 ID
  user_id VARCHAR(255),              -- 로그인한 사용자 ID (NULL 가능)
  user_identifier VARCHAR(255) NOT NULL, -- 사용자 식별자 (IP+UserAgent 해시 또는 user_ID)
  ip_address VARCHAR(45),            -- IP 주소 (IPv6 지원)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- 인덱스 추가
  INDEX idx_content_lookup (content_type, content_id),
  INDEX idx_user_lookup (user_id),
  INDEX idx_identifier_lookup (user_identifier),
  INDEX idx_created_at (created_at),
  
  -- 복합 인덱스 (중복 확인용)
  INDEX idx_duplicate_check (content_type, content_id, user_identifier, created_at)
);

-- 24시간 이상 된 로그 자동 삭제를 위한 이벤트 (선택사항)
-- 이는 MySQL의 경우이며, PostgreSQL에서는 다른 방식을 사용해야 합니다.

-- PostgreSQL용 자동 정리 함수
CREATE OR REPLACE FUNCTION cleanup_view_logs()
RETURNS void AS $$
BEGIN
  DELETE FROM view_logs 
  WHERE created_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

-- 매일 자정에 실행되는 크론 잡을 설정하려면 pg_cron 확장이 필요합니다.
-- SELECT cron.schedule('cleanup-view-logs', '0 0 * * *', 'SELECT cleanup_view_logs();');