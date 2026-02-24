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
    character_id: number;
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
    character_id: 1,
    updated_at: new Date().toISOString()
};

export const useProfileManager = (userId?: string) => {
    const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (userId) {
            fetchProfile();
        }
    }, [userId]);

    const fetchProfile = async () => {
        if (!userId) return;
        setIsLoading(true);
        try {
            // 2. 클라우드에서 최신 정보 가져오기
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (data && !error) {
                setProfile(data);
                console.log("✅ Profile Synced from Cloud 🛡️");
            } else if (error && (error.code === 'PGRST116' || error.message?.includes('No object found'))) {
                // 3. 프로필이 없는 신규 유저라면 서버에도 기본 프로필 생성 시도 (Proactive Sync)
                console.log("🐣 신규 런너님을 위한 클라우드 요새를 준비합니다...");
                const newProfile = { ...DEFAULT_PROFILE, id: userId, updated_at: new Date().toISOString() };

                const { error: upsertError } = await supabase
                    .from('profiles')
                    .upsert(newProfile);

                if (!upsertError) {
                    setProfile(newProfile);
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

        // character_id는 레벨 시스템에 의해 자동 결정되므로 수동 업데이트에서 필터링하거나 보호
        const newProfile = { ...profile, ...updates, id: userId, updated_at: new Date().toISOString() };

        try {
            const { error } = await supabase
                .from('profiles')
                .upsert(newProfile);

            if (!error) {
                setProfile(newProfile);
                console.log("✅ 프로필이 구름 요새에 저장되었습니다.");
            } else {
                console.error("❌ 프로필 저장 에러:", error);
                alert(`저장 실패: ${error.message} (데이터베이스 상태를 확인해 주세요)`);
            }
        } catch (err) {
            console.error("Profile Update Error:", err);
        }
    };

    return {
        profile,
        updateProfile,
        isLoading,
        refreshProfile: fetchProfile
    };
};
