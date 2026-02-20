import React, { useState } from 'react';
import { Map as MapIcon } from 'lucide-react';

// Custom Hooks
import { useRunTimer } from './hooks/useRunTimer';
import { useRecordManager } from './hooks/useRecordManager';
import { useAICoachSystem } from './hooks/useAICoachSystem';
import { useProfileManager } from './hooks/useProfileManager';
import { useAuth } from './hooks/useAuth';

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

import { coaches } from './data/coaches';

function App() {
    // 0. Auth Session Logic
    const { session, user, loading: authLoading, signIn, signUp, signOut } = useAuth();

    // 1. Run Timer & Distance Logic
    const { isRecording, timer, distance, handleStartRun } = useRunTimer();

    // 2. Local State for UI Control & Points (Syncs with localStorage)
    const [points, setPoints] = useState<number>(() => {
        try {
            return parseInt(localStorage.getItem('run-magic-points') || '0');
        } catch (e) {
            console.error("Failed to parse points from localStorage", e);
            return 0;
        }
    });

    const [unlockedBadges, setUnlockedBadges] = useState<string[]>(() => {
        try {
            return JSON.parse(localStorage.getItem('run-magic-badges') || '[]');
        } catch (e) {
            console.error("Failed to parse badges from localStorage", e);
            return [];
        }
    });

    const [unlockedMedals, setUnlockedMedals] = useState<string[]>(() => {
        try {
            return JSON.parse(localStorage.getItem('run-magic-medals') || '[]');
        } catch (e) {
            console.error("Failed to parse medals from localStorage", e);
            return [];
        }
    });
    const [showManualForm, setShowManualForm] = useState(false);
    const [initialManualDate, setInitialManualDate] = useState<string | null>(null);
    const [editingRecord, setEditingRecord] = useState<any>(null);
    const [selectedCoach, setSelectedCoach] = useState(coaches[6]); // Default: Wellness (New!)
    const [viewingDate, setViewingDate] = useState(new Date()); // 전역 조회 날짜 (코칭 연동용)
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showCoachReport, setShowCoachReport] = useState(false);

    // 2.5 Profile Management
    const { profile, updateProfile, isLoading: isProfileLoading } = useProfileManager(user?.id);

    // 3. Record Management Logic
    const {
        records,
        lastSavedRecord,
        setLastSavedRecord,
        baselines,
        isCloudConnected,
        handleManualSave,
        handleDeleteRecord,
        handleImportRecords,
        totalDays
    } = useRecordManager(points, setPoints, unlockedBadges, setUnlockedBadges, unlockedMedals, setUnlockedMedals, user?.id);

    // 4. AI Coach System Logic (Refactored)
    const { message: coachMessage, recommendation, periodStats } = useAICoachSystem(
        selectedCoach.id,
        isRecording,
        distance,
        timer,
        records,
        baselines,
        lastSavedRecord,
        viewingDate // 신규: 조회 날짜 기반 분석 기능
    );

    const handleEditRecord = (record: any) => {
        setEditingRecord(record);
        setShowManualForm(true);
    };

    const handleAddNewFromCalendar = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        setInitialManualDate(dateStr);
        setEditingRecord(null);
        setShowManualForm(true);
    };

    // UI Import Handler
    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const importedData = JSON.parse(e.target?.result as string);
                if (Array.isArray(importedData)) {
                    if (window.confirm(`총 ${importedData.length}개의 기록을 복구하시겠습니까? \n(기본 기록과 중복되지 않은 항목만 추가됩니다)`)) {
                        await handleImportRecords(importedData);
                    }
                } else {
                    alert("올바르지 않은 백업 파일 형식입니다.");
                }
            } catch (err) {
                alert("파일을 읽는 중 오류가 발생했습니다.");
            }
        };
        reader.readAsText(file);
    };

    const handleExport = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(records, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `run_magic_data_${new Date().toISOString().split('T')[0]}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

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
        <div className="app-container" style={{ position: 'relative', minHeight: '100vh', padding: '1rem', maxWidth: '1400px', margin: '0 auto' }}>
            <AuroraBackground />

            <Header
                isRecording={isRecording}
                distance={distance}
                points={points}
                totalDays={totalDays}
                isCloudConnected={isCloudConnected}
                profile={profile}
                onOpenManualForm={() => setShowManualForm(true)}
                onOpenProfile={() => setShowProfileModal(true)}
                onImport={handleImport}
                onExport={handleExport}
                onSignOut={signOut}
            />

            {/* 신규 런너를 위한 Magic Key 안내 브릿지! */}
            {records.length === 0 && !isRecording && (
                <div
                    className="glass-card"
                    style={{
                        margin: '1rem 0',
                        padding: '1.2rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: 'linear-gradient(90deg, rgba(0,209,255,0.1) 0%, rgba(189,0,255,0.1) 100%)',
                        border: '1px solid rgba(0,209,255,0.2)',
                        animation: 'pulse 2s infinite'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ background: 'var(--vibrant-purple)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <span style={{ fontSize: '1.2rem' }}>✨</span>
                        </div>
                        <div>
                            <p style={{ fontWeight: 'bold', fontSize: '1rem', color: 'var(--electric-blue)' }}>이미 질주 중인 런너님이신가요?</p>
                            <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>기존에 사용하시던 **Magic Key**를 입력하면 모든 기록이 즉시 복구됩니다!</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowProfileModal(true)}
                        className="glass-button"
                        style={{ background: 'var(--vibrant-purple)', color: 'white', padding: '0.6rem 1.2rem' }}
                    >
                        지금 기록 불러오기 🫡
                    </button>
                </div>
            )}

            {showManualForm && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
                    <div style={{ width: '100%', maxWidth: '1000px' }}>
                        <ManualRecordForm
                            onSave={(data) => handleManualSave({ ...data, coachId: selectedCoach.id })}
                            onCancel={() => { setShowManualForm(false); setEditingRecord(null); setInitialManualDate(null); }}
                            lastRecord={editingRecord || records[0]}
                            initialDate={initialManualDate}
                            allRecords={records}
                            onDelete={handleDeleteRecord}
                            isCloudConnected={isCloudConnected}
                        />
                    </div>
                </div>
            )}

            {lastSavedRecord && (
                <RecordResultModal
                    record={lastSavedRecord}
                    onClose={() => setLastSavedRecord(null)}
                />
            )}

            {showCoachReport && (
                <CoachReportModal
                    coach={selectedCoach}
                    coachMessage={coachMessage}
                    recommendation={recommendation}
                    periodStats={periodStats}
                    onClose={() => setShowCoachReport(false)}
                    onStartRun={() => {
                        setShowCoachReport(false);
                        handleStartRun();
                    }}
                />
            )}

            <BadgeHallOfFame
                unlockedBadges={unlockedBadges}
                unlockedMedals={unlockedMedals}
            />

            {showProfileModal && (
                <ProfileSection
                    profile={profile}
                    onUpdate={updateProfile}
                    isLoading={isProfileLoading}
                    onClose={() => setShowProfileModal(false)}
                />
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ position: 'relative' }}>
                    <BioPerformanceChart
                        records={records}
                        viewingDate={viewingDate}
                        onDateChange={setViewingDate}
                    />
                    {isRecording && (
                        <div className="glass-card" style={{
                            position: 'absolute',
                            top: 0, left: 0, right: 0, bottom: 0,
                            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                            background: 'rgba(10, 10, 12, 0.8)',
                            zIndex: 10
                        }}>
                            <MapIcon size={48} className="neon-text-blue" style={{ marginBottom: '1rem' }} />
                            <p className="neon-text-blue" style={{ fontWeight: 'bold' }}>GPS 경로 실시간 추적 중...</p>
                            <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', opacity: 0.6 }}>런너님의 동선을 감각적으로 그리고 있어요 ✨</p>
                        </div>
                    )}
                </div>

                {/* 2. Action Zone */}
                <div className="action-zone" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
                    <CalendarSection
                        records={records}
                        onDelete={handleDeleteRecord}
                        onEdit={handleEditRecord}
                        onAddNew={handleAddNewFromCalendar}
                        viewingDate={viewingDate}
                        onDateChange={setViewingDate}
                    />

                    <AICoachSidebar
                        isRecording={isRecording}
                        onStart={() => isRecording ? handleStartRun() : setShowCoachReport(true)}
                        selectedCoach={selectedCoach}
                        onCoachSelect={setSelectedCoach}
                        coaches={coaches}
                        coachMessage={coachMessage}
                        recommendation={recommendation}
                    />
                </div>
            </div>

            <footer style={{ marginTop: '3rem', textAlign: 'center', opacity: 0.4, fontSize: '0.8rem' }}>
                <p>© 2026 Run-Magic AI Team. 런너님의 건강한 러닝을 응원합니다! 💖</p>
            </footer>
        </div>
    );
}

export default App;
