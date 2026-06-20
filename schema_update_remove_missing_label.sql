-- 1. point_transactions 테이블의 description 컬럼에서 ' (누락분 복구)' 텍스트를 일괄 삭제합니다.
UPDATE point_transactions 
SET description = replace(description, ' (누락분 복구)', '') 
WHERE description LIKE '%(누락분 복구)%';

-- 2. 기존 '일일 첫 러닝 인증' 설명을 '러닝 운동 등록 완료'로 일괄 수정합니다.
UPDATE point_transactions
SET description = replace(description, '일일 첫 러닝 인증', '러닝 운동 등록 완료')
WHERE description LIKE '%일일 첫 러닝 인증%';

