import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export interface UserProfile {
    id: string;
    name: string;
    weight: number;
    height: number;
    goal: string;
    birthdate: string;
    gender: string;
    characterId: number;
    attendanceDates?: string[]; // v24.6
    aiFeedbackDates?: string[]; // v26.0: AI 피드백 보상을 위한 기록
    points?: number;            // v26.4: 최종 합산 포인트 스냅샷 💎
    locationCity?: string;    // v25.0: 도시명 (예: '광주', '서울')
    locationStation?: string; // v25.0: 에어코리아 측정소명 (예: '서석동')
    updated_at: string;
}

const DEFAULT_PROFILE: UserProfile = {
    id: '',
    name: '런너님',
    weight: 70.0,
    height: 175.0,
    goal: '오늘도 즐겁게 질주합시다!',
    birthdate: '1990-01-01',
    gender: 'male',
    characterId: 1,
    attendanceDates: [],
    aiFeedbackDates: [],
    points: 0,
    locationCity: '',    // v25.0: 기본 미설정
    locationStation: '', // v25.0: 기본 미설정
    updated_at: new Date().toISOString()
};


export const useProfileManager = (userId?: string) => {
    const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
    const [isLoading, setIsLoading] = useState(false);
    const [isProfileLoaded, setIsProfileLoaded] = useState(false);

    useEffect(() => {
        if (userId && userId !== '00000000-0000-0000-0000-000000000000') {
            fetchProfile();
        } else {
            // v21.2: 로그아웃 시 프로필 정보 즉시 초기화 (잔상 제거)
            setProfile(DEFAULT_PROFILE);
            setIsProfileLoaded(false);
        }
    }, [userId]);

    const fetchProfile = async () => {
        if (!userId || userId === '00000000-0000-0000-0000-000000000000') return;
        setIsLoading(true);
        try {
            // 2. 클라우드에서 최신 정보 가져오기
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (data && !error) {
                // v24.6: 자동 출석 체크 로직 (Daily Quest) 🏁
                const todayStr = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
                const currentAttendance = data.attendanceDates || [];
                
                if (!currentAttendance.includes(todayStr)) {
                    console.log(`🎫 자동 출석 보상! [${todayStr}]. 클라우드 저장소를 업데이트합니다.`);
                    const updatedAttendance = [...currentAttendance, todayStr];
                    const updatedProfile = { ...data, attendanceDates: updatedAttendance, updated_at: new Date().toISOString() };
                    
                    // Supabase에 즉시 반영
                    await supabase.from('profiles').upsert(updatedProfile);
                    setProfile(updatedProfile);
                } else {
                    setProfile(data);
                }
                
                setIsProfileLoaded(true);
                console.log("✅ Profile Synced from Cloud 🛡️");
            } else if (error && (error.code === 'PGRST116' || error.message?.includes('No object found'))) {
                // 3. 프로필이 없는 신규 유저라면 서버에도 기본 프로필 생성 시도 (Proactive Sync)
                console.log("🐣 신규 런너님을 위한 클라우드 요새를 준비합니다...");
                const todayStr = new Date().toLocaleDateString('en-CA');
                const newProfile = { 
                    ...DEFAULT_PROFILE, 
                    id: userId, 
                    attendanceDates: [todayStr], // 신규 가입 시 첫 출석 자동 기록
                    updated_at: new Date().toISOString() 
                };

                const { error: upsertError } = await supabase
                    .from('profiles')
                    .upsert(newProfile);

                if (!upsertError) {
                    setProfile(newProfile);
                    setIsProfileLoaded(true);
                    console.log("✅ New Cloud Profile Established! 🏁");
                } else {
                    console.error("❌ Profile Auto-Creation Failed:", upsertError);
                }
            } else if (error) {
                console.error("❌ Profile Fetch Error:", error);
            }
        } catch (err) {
            console.error("❌ Profile Manager Init Error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const updateProfile = async (updates: Partial<UserProfile>) => {
        if (!userId || userId === '00000000-0000-0000-0000-000000000000') {
            alert("로그인이 필요합니다. 🫡");
            return;
        }

        if (!isProfileLoaded) {
            console.warn("⚠️ 프로필 로딩이 완료되기 전에는 업데이트할 수 없습니다.");
            return;
        }

        const newProfile = { ...profile, ...updates, id: userId, updated_at: new Date().toISOString() };

        try {
            const { error } = await supabase
                .from('profiles')
                .upsert(newProfile);

            if (!error) {
                setProfile(newProfile);
                setIsProfileLoaded(true);
                console.log("✅ 프로필이 구름 요새에 저장되었습니다.");
            } else {
                console.error("❌ 프로필 저장 에러:", error);
                alert(`저장 실패: ${error.message}`);
            }
        } catch (err) {
            console.error("Profile Update Error:", err);
        }
    };

    const recordAiFeedback = async () => {
        if (!userId || userId === '00000000-0000-0000-0000-000000000000') return;
        
        const todayStr = new Date().toLocaleDateString('en-CA');
        const currentFeedback = profile.aiFeedbackDates || [];
        
        if (!currentFeedback.includes(todayStr)) {
            const updatedFeedback = [...currentFeedback, todayStr];
            await updateProfile({ aiFeedbackDates: updatedFeedback });
            console.log("💎 AI 피드백 보상 획득! [XP +5]");
        }
    };


    return {
        profile,
        updateProfile,
        recordAiFeedback,
        isLoading,
        isProfileLoaded,
        refreshProfile: fetchProfile
    };
};

