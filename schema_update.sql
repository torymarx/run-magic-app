-- v18.0 버추얼 레이스 기능을 위한 컬럼 추가
-- Supabase SQL Editor에 복사하여 실행해 주세요! 🚀

ALTER TABLE records 
ADD COLUMN IF NOT EXISTS "raceComparisons" JSONB;

-- 혹시 누락되었을 수 있는 이전 버전 컬럼들 체크
ALTER TABLE records 
ADD COLUMN IF NOT EXISTS "paceDiff" TEXT,
ADD COLUMN IF NOT EXISTS "isImproved" BOOLEAN,
ADD COLUMN IF NOT EXISTS "calories" INTEGER;

-- 인덱스 추가 (조회 성능 최적화)
-- CREATE INDEX IF NOT EXISTS idx_records_user_id ON records(user_id);
-- CREATE INDEX IF NOT EXISTS idx_records_date ON records(date DESC);
