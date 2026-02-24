
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nuevoeetazxxenftplwb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51ZXZvZWV0YXp4eGVuZnRwbHdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzg1NzUsImV4cCI6MjA4NjY1NDU3NX0.NkkqzkgKE-Miqx0dEZI_TTBxSHc3JozVFxO5_4IJctU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const TARGET_USER_ID = '7580cf5f-7a98-40d9-be33-623076771aef';

const SAMPLE_RECORDS = [
    { date: '2026-01-05', time: '07:00', totalTime: '00:32:15', distance: 5.2, pace: '06:12', calories: 385, weather: 'sun', temp: 12, condition: 'good', dust: 'good', memo: '런매직 첫 시작! 코치들의 조언이 신기하다.', coachId: 'apex', isImproved: true, splits: ["06:10", "06:15", "06:12", "06:10", "06:08"] },
    { date: '2026-01-08', time: '06:30', totalTime: '00:45:30', distance: 7.5, pace: '06:04', calories: 560, weather: 'cloud', temp: 8, condition: 'great', dust: 'soso', memo: 'Insight 코치가 말한 상체 각도를 신경 써 보았다.', coachId: 'insight', isImproved: true, splits: ["06:05", "06:04", "06:03", "06:05", "06:04", "06:02", "06:01"] },
    { date: '2026-01-12', time: '08:00', totalTime: '01:05:00', distance: 10.2, pace: '06:22', calories: 780, weather: 'snow', temp: -2, condition: 'soso', dust: 'good', memo: 'Atlas 코치와 함께한 생애 첫 10km! 힘들지만 뿌듯하다.', coachId: 'atlas', isImproved: false, splits: ["06:15", "06:18", "06:20", "06:22", "06:25"] },
    { date: '2026-01-15', time: '07:15', totalTime: '00:28:45', distance: 5.0, pace: '05:45', calories: 410, weather: 'sun', temp: 5, condition: 'great', dust: 'good', memo: 'Swift 코치의 비트감 있는 조언 덕분에 페이스가 빨라졌다.', coachId: 'swift', isImproved: true, splits: ["05:50", "05:48", "05:45", "05:42", "05:40"] },
    { date: '2026-01-19', time: '06:00', totalTime: '00:35:00', distance: 5.5, pace: '06:21', calories: 390, weather: 'cloud', temp: 3, condition: 'bad', dust: 'bad', memo: '컨디션이 안 좋았지만 Zen 코치의 호흡법으로 끝까지 완주.', coachId: 'zen', isImproved: false, splits: ["06:20", "06:25", "06:30", "06:15", "06:10"] },
    { date: '2026-02-03', time: '07:30', totalTime: '00:31:00', distance: 5.0, pace: '06:12', calories: 370, weather: 'sun', temp: 5, condition: 'good', dust: 'good', memo: '새로운 목표 설정: 하프 마라톤 완주!', coachId: 'insight', isImproved: true, splits: ["06:15", "06:12", "06:10", "06:10", "06:03"] },
    { date: '2026-02-14', time: '09:00', totalTime: '01:10:00', distance: 11.5, pace: '06:05', calories: 860, weather: 'sun', temp: 8, condition: 'great', dust: 'good', memo: '발렌타인 기념 런! 11km 돌파.', coachId: 'atlas', isImproved: true, splits: ["06:10", "06:10", "06:10", "06:05", "06:05", "06:05", "06:00", "06:00", "06:05", "06:05", "06:00"] },
    { date: '2026-02-21', time: '07:00', totalTime: '00:46:00', distance: 8.0, pace: '05:45', calories: 610, weather: 'sun', temp: 12, condition: 'great', dust: 'good', memo: '최상의 컨디션. 8km를 5분대 평속으로 완주.', coachId: 'apex', isImproved: true, splits: ["05:50", "05:50", "05:45", "05:45", "05:40", "05:40", "05:40", "05:35"] }
];

async function seedData() {
    console.log("🏙️ 튜토리얼 데이터 시딩 시작 (UUID: " + TARGET_USER_ID + ")");

    // 1. 프로필 설정
    const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
            id: TARGET_USER_ID,
            name: '튜토리얼 런너',
            weight: 72.5,
            height: 178.0,
            goal: '전설의 아크메이지 런킹이 되기 위한 여정! 🏆',
            birthdate: '1995-05-15',
            gender: 'male',
            characterId: 3,
            updated_at: new Date().toISOString()
        });

    if (profileError) console.error("❌ 프로필 시딩 실패:", profileError.message);
    else console.log("✅ 프로필 시딩 완료");

    // 2. 레코드 설정
    // 기존 데이터 충돌 방지를 위해 먼저 삭제 (튜토리얼 계정에 대해서만)
    await supabase.from('records').delete().eq('user_id', TARGET_USER_ID);

    for (const record of SAMPLE_RECORDS) {
        const { error: recordError } = await supabase
            .from('records')
            .insert({
                ...record,
                user_id: TARGET_USER_ID,
                id: Date.now() + Math.floor(Math.random() * 1000),
                weight: 72.5 // 몸무게 누락 방지
            });

        if (recordError) console.error(`❌ 레코드 시딩 실패 (${record.date}):`, recordError.message);
        else console.log(`✅ 레코드 시딩 완료 (${record.date})`);
    }

    console.log("🚀 모든 튜토리얼 데이터가 성공적으로 주입되었습니다!");
}

seedData();
