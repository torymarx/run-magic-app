
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nuevoeetazxxenftplwb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51ZXZvZWV0YXp4eGVuZnRwbHdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzg1NzUsImV4cCI6MjA4NjY1NDU3NX0.NkkqzkgKE-Miqx0dEZI_TTBxSHc3JozVFxO5_4IJctU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createTutorialUser() {
    console.log("🚀 튜토리얼 계정 생성 시도: tutorial@runmagic.com");

    // 이미 존재하는지 확인하기 위해 로그인을 먼저 시도해봅니다.
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: 'tutorial@runmagic.com',
        password: 'runmagic123!'
    });

    if (signInData.user) {
        console.log("✅ 계정이 이미 존재합니다. UUID:", signInData.user.id);
        return;
    }

    // 존재하지 않으면 회원가입 시도
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: 'tutorial@runmagic.com',
        password: 'runmagic123!'
    });

    if (signUpError) {
        console.error("❌ 계정 생성 실패:", signUpError.message);
        if (signUpError.message.includes('already registered')) {
            console.log("💡 이미 등록된 이메일입니다. 비밀번호를 확인해 주세요.");
        }
    } else {
        console.log("✨ 계정 생성 성공! UUID:", signUpData.user?.id);
        console.log("📢 주의: 이메일 확인(Confirmation)이 활성화되어 있다면 메일을 확인해야 할 수 있습니다.");
    }
}

createTutorialUser();
