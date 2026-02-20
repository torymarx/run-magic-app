import { createClient } from '@supabase/supabase-js';

/**
 * 코다리 부장의 보안 팁 🐟✨
 * Vite 환경에서는 import.meta.env를 통해 변수를 로드합니다.
 * Vercel 배포 시에는 대시보드에서 해당 변수들을 반드시 설정해 주셔야 합니다!
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("⚠️ Supabase 접속 정보가 누락되었습니다! 로컬 모드로 동작합니다. (Vercel 환경 변수 설정을 확인해 주세요)");
}

export const supabase = createClient(
    supabaseUrl || 'https://placeholder-url.supabase.co',
    supabaseAnonKey || 'placeholder-key'
);
