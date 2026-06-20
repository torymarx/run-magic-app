-- [v24.6] 일일 출석(Daily Quest) 시스템을 위한 스키마 업데이트
-- Supabase SQL Editor에 복사해서 실행해 주세요! 🫡🐟🏁
-- 
-- profiles 테이블에 attendanceDates 컬럼(텍스트 배열)을 추가합니다.
-- 이 컬럼은 사용자의 일일 방문 날짜를 기록하여 출석 XP를 계산하는 데 사용됩니다.

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS "attendanceDates" text[] DEFAULT '{}';

-- 확인용 쿼리 (실행 후 컬럼이 추가되었는지 확인)
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'profiles';
