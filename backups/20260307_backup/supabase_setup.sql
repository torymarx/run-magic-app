-- Run-Magic Records & Profiles 테이블 보안 설정 최신화 (Auth 기반)
-- Supabase SQL Editor에 복사해서 실행해 주세요! 🫡🐟🚀

-- 1. 기존 정책 삭제 (깔끔한 재시작을 위해)
drop policy if exists "Allow all access" on records;
drop policy if exists "Allow all access on profiles" on profiles;
drop policy if exists "Individuals can view their own records" on records;
drop policy if exists "Individuals can create their own records" on records;
drop policy if exists "Individuals can update their own records" on records;
drop policy if exists "Individuals can delete their own records" on records;
drop policy if exists "Individuals can view their own profile" on profiles;
drop policy if exists "Individuals can update their own profile" on profiles;

-- 2. Records 테이블 RLS 정책 (본인 데이터만!)
alter table records enable row level security;

create policy "Users can view their own records" on records
  for select using (auth.uid() = user_id);

create policy "Users can insert their own records" on records
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own records" on records
  for update using (auth.uid() = user_id);

create policy "Users can delete their own records" on records
  for delete using (auth.uid() = user_id);

-- 3. Profiles 테이블 RLS 정책 (본인 데이터만!)
alter table profiles enable row level security;

create policy "Users can view their own profile" on profiles
  for select using (auth.uid() = id);

create policy "Users can insert their own profile" on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update their own profile" on profiles
  for update using (auth.uid() = id);


-- 4. 부족한 컬럼 추가 (v12.0 유기적 연동용)
-- profiles 테이블에 characterId가 없는 경우 아래 명령을 실행해 주세요!
-- alter table profiles add column if not exists "characterId" integer default 1;
