-- Run-Magic Records 테이블 생성 SQL
-- Supabase SQL Editor에 복사해서 실행해 주세요!

create table records (
  id bigint primary key,
  date date not null,
  time text not null,
  distance float8 not null,
  pace text not null,
  calories integer not null,
  weather text,
  dust text,
  condition text,
  temp float8,
  weight float8,
  memo text,
  isImproved boolean,
  paceDiff text,
  splits jsonb,
  user_id uuid not null, -- Magic Key 연동 필드
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS 보안 설정 (모두 허용 - 나중에 사용자 인증 추가 시 강화 가능)
alter table records enable row level security;
create policy "Allow all access" on records for all using (true) with check (true);

-- profiles 테이블 생성
create table if not exists profiles (
  id uuid primary key, -- Magic Key
  name text default '런너님',
  weight float8,
  height float8,
  goal text,
  birthdate date,
  gender text,
  characterId integer,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Profiles RLS 보안 설정
alter table profiles enable row level security;
create policy "Allow all access on profiles" on profiles for all using (true) with check (true);
