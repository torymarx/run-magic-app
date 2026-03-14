import { useEffect } from 'react';

// Custom Hooks
import { useRunTimer } from './hooks/useRunTimer';
import { useRecordManager } from './hooks/useRecordManager';
import { useAICoachSystem } from './hooks/useAICoachSystem';
import { useProfileManager } from './hooks/useProfileManager';
import { useAuth } from './hooks/useAuth';
import { useAppState } from './hooks/useAppState';
import { useRecordHandlers } from './hooks/useRecordHandlers';

// Components
import AuroraBackground from './components/layout/AuroraBackground';
import Header from './components/layout/Header';
import RecordResultModal from './components/dashboard/RecordResultModal';
import AICoachSidebar from './components/AICoachSidebar';
import CoachReportModal from './components/dashboard/CoachReportModal';
import ManualRecordForm from './components/ManualRecordForm';
import CalendarSection from './components/CalendarSection';
import BadgeHallOfFame from './components/BadgeHallOfFame';
import BioPerformanceChart from './components/BioPerformanceChart';
import ProfileSection from './components/profile/ProfileSection';
import AuthSection from './components/AuthSection';
import LegalNoticeModal from './components/dashboard/LegalNoticeModal';
import { SyncOverlay, GPSOverlay } from './components/common/Overlays';

function App() {
    // 0. Auth Session & App State Logic
    const { session, user, loading: authLoading, signIn, signUp, signOut } = useAuth();
    const appState = useAppState(user, async () => { await signOut(); });
    const {
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
    } = appState;

    // 1. Run Timer & Distance Logic
    const { isRecording, timer, distance, handleStartRun } = useRunTimer();

    // 2. Profile Management
    const {
        profile,
        updateProfile,
        refreshProfile: refreshProfileData,
        isProfileLoaded
    } = useProfileManager(user?.id);

    // 3. Record Management Logic
    const {
        records,
        lastSavedRecord,
        setLastSavedRecord,
        isCloudConnected,
        handleManualSave,
        handleDeleteRecord,
        handleImportRecords,
        totalDays,
        lastSyncStatus,
        calculateLevelInfo,
        medalAchievements: currentMedalAchievements
    } = useRecordManager(setPoints, setUnlockedBadges, setUnlockedMedals, user?.id);

    // 4. Record Handlers (Operation Diet)
    const {
        handleEditRecord,
        handleAddNewFromCalendar,
        handleImport,
        handleExport
    } = useRecordHandlers(
        setEditingRecord,
        setShowManualForm,
        setInitialManualDate,
        handleImportRecords,
        updateProfile,
        user,
        records,
        profile
    );

    // v17.0: 메달 달성일 상태 동기화
    useEffect(() => {
        if (currentMedalAchievements) {
            setMedalAchievements(currentMedalAchievements);
        }
    }, [currentMedalAchievements, setMedalAchievements]);

    // 5. AI Coach System Logic
    const levelInfo = calculateLevelInfo(points);
    const { message: coachMessage, recommendation, periodStats, runnerProfile } = useAICoachSystem(
        selectedCoach.id,
        isRecording,
        distance,
        timer,
        records,
        lastSavedRecord,
        profile,
        levelInfo
    );

    // v19.1: 레벨 기반 자동 캐릭터 진화 시스템
    useEffect(() => {
        // v19.1.1: 프로필 로딩 완료 후 에만 자동 진화 체크 (데이터 손실 방지 🛡️)
        if (user && profile && isProfileLoaded && points > 0 && levelInfo.level !== profile.characterId) {
            console.log(`🧬 레벨 업 탐지: [${profile.characterId} -> ${levelInfo.level}]. 캐릭터 자동 진화를 시작합니다.`);
            updateProfile({ characterId: levelInfo.level });
        }
    }, [points, profile?.characterId, user, levelInfo.level, updateProfile, isProfileLoaded]);

    if (authLoading) {
        return (
            <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <AuroraBackground />
                <p className="neon-text-blue" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>런매직 보안 체크 중... 🛡️</p>
            </div>
        );
    }

    if (!session) {
        return <AuthSection onSignIn={signIn} onSignUp={signUp} loading={authLoading} />;
    }

    return (
        <div className="app-container" style={{ position: 'relative', minHeight: '100vh', padding: '80px 1rem 2rem 1rem', maxWidth: '1400px', margin: '0 auto' }}>
            <AuroraBackground />

            <SyncOverlay isVisible={isSyncing} />

            <Header
                isRecording={isRecording}
                points={points}
                totalDays={totalDays}
                isCloudConnected={isCloudConnected}
                profile={profile}
                onOpenManualForm={() => setShowManualForm(true)}
                onOpenProfile={() => setShowProfileModal(true)}
                onImport={handleImport}
                onExport={handleExport}
                onSignOut={handleSignOut}
            />

            {showManualForm && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
                    <div style={{ width: '100%', maxWidth: '1000px' }}>
                        <ManualRecordForm
                            onSave={async (data) => {
                                setIsSyncing(true);
                                try {
                                    await handleManualSave({
                                        ...data,
                                        coachId: selectedCoach.id,
                                        runnerName: profile.name
                                    });
                                    if (data.weight) {
                                        await updateProfile({ weight: data.weight });
                                    }
                                    setEditingRecord(null);
                                } finally {
                                    setIsSyncing(false);
                                }
                            }}
                            onCancel={() => { setShowManualForm(false); setEditingRecord(null); setInitialManualDate(null); }}
                            lastRecord={editingRecord || records[0]}
                            initialDate={initialManualDate}
                            allRecords={records}
                            onDelete={handleDeleteRecord}
                            isCloudConnected={isCloudConnected}
                            profile={profile}
                        />
                    </div>
                </div>
            )}

            {(lastSavedRecord || showRecordResult) && (
                <RecordResultModal
                    record={lastSavedRecord || showRecordResult}
                    allRecords={records}
                    onClose={() => { setLastSavedRecord(null); setShowRecordResult(null); }}
                />
            )}

            {showCoachReport && (
                <CoachReportModal
                    coach={selectedCoach}
                    coachMessage={coachMessage}
                    recommendation={recommendation}
                    periodStats={periodStats}
                    runnerProfile={runnerProfile}
                    onClose={() => setShowCoachReport(false)}
                />
            )}

            <div className="reveal delay-1">
                <BadgeHallOfFame
                    unlockedBadges={unlockedBadges}
                    unlockedMedals={unlockedMedals}
                    medalAchievements={medalAchievements}
                />
            </div>

            {showProfileModal && (
                <ProfileSection
                    profile={profile}
                    onUpdate={updateProfile}
                    syncStatus={lastSyncStatus}
                    onRefreshData={refreshProfileData}
                    onClose={() => setShowProfileModal(false)}
                    points={points}
                    calculateLevelInfo={calculateLevelInfo}
                />
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="reveal delay-2" style={{ position: 'relative' }}>
                    <BioPerformanceChart
                        records={records}
                        viewingDate={viewingDate}
                        onDateChange={setViewingDate}
                    />
                    <GPSOverlay isRecording={isRecording} />
                </div>

                <div className="action-zone reveal delay-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
                    <CalendarSection
                        records={records}
                        onDelete={handleDeleteRecord}
                        onEdit={handleEditRecord}
                        onViewDetails={(r) => setShowRecordResult(r)}
                        onAddNew={handleAddNewFromCalendar}
                        viewingDate={viewingDate}
                        onDateChange={setViewingDate}
                    />

                    <AICoachSidebar
                        isRecording={isRecording}
                        onStart={() => isRecording ? handleStartRun() : setShowCoachReport(true)}
                        selectedCoach={selectedCoach}
                        onCoachSelect={setSelectedCoach}
                        coaches={[]} // Passed as empty since it's already in the component or use default
                        coachMessage={coachMessage}
                        recommendation={recommendation}
                    />
                </div>
            </div>

            {showLegalModal && <LegalNoticeModal onClose={() => setShowLegalModal(false)} />}

            <footer style={{ marginTop: '5rem', padding: '2rem 0', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                    <p style={{ opacity: 0.6, fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '1px' }}>
                        🚀 DEVELOPED BY <span style={{ color: 'var(--electric-blue)' }}>NAKU LAB STUDIO</span>
                    </p>
                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.75rem', opacity: 0.4 }}>
                        <span onClick={() => setShowLegalModal(true)} style={{ cursor: 'pointer' }}>이용약관 및 개인정보처리방침</span>
                        <span>고객지원: naku.lab.studio@kakao.com</span>
                    </div>
                    <p style={{ opacity: 0.3, fontSize: '0.7rem' }}>© 2026 Run-Magic AI. 런너님의 건강한 마법 같은 질주를 응원합니다! 💖</p>
                </div>
            </footer>
        </div>
    );
}

export default App;
