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
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (data && !error) {
                setProfile(data);
                localStorage.setItem(`run-magic-profile-${userId}`, JSON.stringify(data));
            } else if (error && error.code !== 'PGRST116') {
                console.error("Profile Fetch Error:", error);
            } else if (error && error.code === 'PGRST116') {
                // 프로필이 없는 신규 유저라면 기본 프로필로 세팅
                setProfile({ ...DEFAULT_PROFILE, id: userId });
            }
        } catch (err) {
            console.error("Profile Manager Init Error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const updateProfile = async (updates: Partial<UserProfile>) => {
        if (!userId) return;
        const newProfile = { ...profile, ...updates, id: userId, updated_at: new Date().toISOString() };
        setProfile(newProfile);
        localStorage.setItem(`run-magic-profile-${userId}`, JSON.stringify(newProfile));

        try {
            const { error } = await supabase
                .from('profiles')
                .upsert(newProfile);

            if (error) {
                console.error("Profile Update Sync Error:", error);
            }
        } catch (err) {
            console.error("Profile Update Error:", err);
        }
    };

    return {
        profile,
        updateProfile,
        isLoading,
        fetchProfile
    };
};
