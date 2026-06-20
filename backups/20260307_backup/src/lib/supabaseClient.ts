import { createClient } from '@supabase/supabase-js';

/**
 * 시스템 보안 및 데이터 무결성 가이드 🛡️✨
 * Vite 환경에서는 import.meta.env를 통해 변수를 로드합니다.
 * Vercel 배포 시에는 대시보드에서 해당 변수들을 반드시 설정해 주셔야 합니다!
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseUrl.startsWith('https://')) {
    console.error("%c⚠️ Supabase Connection Error!", "color: #ff4b4b; font-size: 1.2rem; font-weight: bold;");
    console.warn("VITE_SUPABASE_URL이 올바르지 않거나 누락되었습니다. \nVercel 대시보드(Settings > Environment Variables)에서 설정 후 Redeploy 해주세요! 🫡🛡️");
}

if (!supabaseAnonKey || supabaseAnonKey === 'placeholder-key') {
    console.error("%c⚠️ Supabase Auth Key Error!", "color: #ff4b4b; font-size: 1.2rem; font-weight: bold;");
    console.warn("VITE_SUPABASE_ANON_KEY가 설정되지 않았습니다. \n데이터 요새의 열쇠가 없으면 접근이 불가능합니다! 🫡🛡️");
}

export const supabase = createClient(
    supabaseUrl || 'https://placeholder-url.supabase.co',
    supabaseAnonKey || 'placeholder-key',
    {
        auth: {
            persistSession: true, // v12.2: 자동 로그인 재활성화 (페이지 방문 시 데이터 즉시 표시)
            autoRefreshToken: true,
            detectSessionInUrl: true
        }
    }
);
