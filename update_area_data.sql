-- 병원양도 게시글들에 평수 정보 추가
-- 각 게시글 ID에 맞는 평수를 설정하세요

-- 병원 월세 판매 -> 40평으로 설정
UPDATE transfers 
SET area = 40 
WHERE id = 'transfer_1758387668109_ob4fcgqwfb';

-- 병원 급쳐요 -> 60평으로 설정  
UPDATE transfers 
SET area = 60 
WHERE id = 'transfer_1758383185490_dquw4roc1b6';

-- 임시저장 테스트들은 NULL로 유지 (임시저장이므로)

-- 업데이트 결과 확인
SELECT id, title, category, area 
FROM transfers 
WHERE category = '병원양도' 
ORDER BY "createdAt" DESC;