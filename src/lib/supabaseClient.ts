import { createClient } from '@supabase/supabase-js';

// 주의: 런너님, 실제 Supabase 프로젝트의 URL과 Anon Key를 아래에 입력해 주셔야 합니다!
// .env 파일에 보관하는 것이 보안상 가장 좋지만, 우선 구조를 잡아두겠습니다.
const env = (import.meta as any).env || {};
const supabaseUrl = env.VITE_SUPABASE_URL || 'https://your-project-url.supabase.co';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
