-- Run-Magic 프로젝트 보안 강화 스크립트 🫡🛡️
-- 이 스크립트는 모든 테이블에 RLS(행 단위 보안)를 강제하고 권한을 재정비합니다.
-- Supabase SQL Editor에서 실행해 주세요.

-- 1. RLS 활성화 재선언 (모든 테이블 대상)
ALTER TABLE IF EXISTS public.records ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. 기존 정책 초기화 (안전한 재설정을 위해)
DROP POLICY IF EXISTS "Allow all access" ON public.records;
DROP POLICY IF EXISTS "Allow all access on profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own records" ON public.records;
DROP POLICY IF EXISTS "Users can insert their own records" ON public.records;
DROP POLICY IF EXISTS "Users can update their own records" ON public.records;
DROP POLICY IF EXISTS "Users can delete their own records" ON public.records;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- 3. Records 테이블: 본인 데이터만 접근 허용
CREATE POLICY "Users can view their own records" ON public.records
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own records" ON public.records
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own records" ON public.records
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own records" ON public.records
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- 4. Profiles 테이블: 본인 데이터만 접근 허용
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 5. 보안 점검 알림
DO $$
BEGIN
  RAISE NOTICE '✅ Run-Magic 보안 강화 스크립트 실행 완료';
  RAISE NOTICE '  - 행 단위 보안(RLS) 강제 적용 완료';
  RAISE NOTICE '  - 익명 사용자(anon)의 무분별한 데이터 접근 차단 완료';
END;
$$;
