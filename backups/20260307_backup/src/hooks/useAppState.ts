import { useState, useEffect, useCallback } from 'react';
import { coaches } from '../data/coaches';

export const useAppState = (user: any, signOut: () => Promise<void>) => {
    const [points, setPoints] = useState<number>(0);
    const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);
    const [unlockedMedals, setUnlockedMedals] = useState<string[]>([]);
    const [medalAchievements, setMedalAchievements] = useState<{ [id: string]: string }>({});

    const [isSyncing, setIsSyncing] = useState(false);
    const [viewingDate, setViewingDate] = useState(new Date());

    // Modals
    const [showManualForm, setShowManualForm] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showCoachReport, setShowCoachReport] = useState(false);
    const [showLegalModal, setShowLegalModal] = useState(false);
    const [showRecordResult, setShowRecordResult] = useState<any>(null);

    // Other UI state
    const [initialManualDate, setInitialManualDate] = useState<string | null>(null);
    const [editingRecord, setEditingRecord] = useState<any>(null);
    const [selectedCoach, setSelectedCoach] = useState(() => {
        const randomIndex = Math.floor(Math.random() * coaches.length);
        return coaches[randomIndex];
    });

    // Reset state on user change
    useEffect(() => {
        if (!user?.id) {
            setPoints(0);
            setUnlockedBadges([]);
            setUnlockedMedals([]);
            setMedalAchievements({});
        }
    }, [user?.id]);

    const handleSignOut = useCallback(async () => {
        if (window.confirm("로그아웃 하시겠습니까? 🫡\n(마지막 기록을 서버에 안전하게 보관 후 종료합니다)")) {
            setIsSyncing(true);
            try {
                // Simulate/Ensure final sync
                await new Promise(resolve => setTimeout(resolve, 1000));

                setPoints(0);
                setUnlockedBadges([]);
                setUnlockedMedals([]);
                setMedalAchievements({});
                await signOut();
            } finally {
                setIsSyncing(false);
            }
        }
    }, [signOut]);

    // Scroll Lock Logic
    useEffect(() => {
        const isAnyModalOpen = showManualForm || showProfileModal || showCoachReport || showLegalModal || !!showRecordResult;
        if (isAnyModalOpen) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            document.documentElement.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
            document.documentElement.style.overflow = 'unset';
        };
    }, [showManualForm, showProfileModal, showCoachReport, showLegalModal, showRecordResult]);

    return {
        points, setPoints,
        unlockedBadges, setUnlockedBadges,
        unlockedMedals, setUnlockedMedals,
        medalAchievements, setMedalAchievements,
        isSyncing, setIsSyncing,
        viewingDate, setViewingDate,
        showManualForm, setShowManualForm,
        showProfileModal, setShowProfileModal,
        showCoachReport, setShowCoachReport,
        showLegalModal, setShowLegalModal,
        showRecordResult, setShowRecordResult,
        initialManualDate, setInitialManualDate,
        editingRecord, setEditingRecord,
        selectedCoach, setSelectedCoach,
        handleSignOut
    };
};
