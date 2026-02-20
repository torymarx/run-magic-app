
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
    id: '00000000-0000-0000-0000-000000000000',
    name: '런너님',
    weight: 70.0,
    height: 175.0,
    goal: '오늘도 즐겁게 질주합시다!',
    birthdate: '1990-01-01',
    gender: 'male',
    characterId: 1,
    updated_at: new Date().toISOString()
};

export const useProfileManager = () => {
    const [profile, setProfile] = useState<UserProfile>(() => {
        const saved = localStorage.getItem('run-magic-profile');
        return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    });

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', profile.id)
                .single();

            if (data && !error) {
                setProfile(data);
                localStorage.setItem('run-magic-profile', JSON.stringify(data));
            } else if (error && error.code !== 'PGRST116') {
                console.error("Profile Fetch Error:", error);
            }
        } catch (err) {
            console.error("Profile Manager Init Error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const updateProfile = async (updates: Partial<UserProfile>) => {
        const newProfile = { ...profile, ...updates, updated_at: new Date().toISOString() };
        setProfile(newProfile);
        localStorage.setItem('run-magic-profile', JSON.stringify(newProfile));

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
