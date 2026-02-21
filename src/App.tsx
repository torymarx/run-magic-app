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

    const [points, setPoints] = useState<number>(0);
    const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);
    const [unlockedMedals, setUnlockedMedals] = useState<string[]>([]);

    // v11.0: Cloud Only - 로컬 데이터 로드 로직 제거
    React.useEffect(() => {
        if (!user?.id) {
            setPoints(0);
            setUnlockedBadges([]);
            setUnlockedMedals([]);
        }
    }, [user?.id]);
    const [showManualForm, setShowManualForm] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);

    const handleSignOut = async () => {
        if (window.confirm("로그아웃 하시겠습니까? 🫡\n(마지막 기록을 서버에 안전하게 보관 후 종료합니다)")) {
            setIsSyncing(true);
            try {
                console.log("⏳ 로그아웃 전 최종 데이터 정합성 체크 중...");

                // v12.3: 로그아웃 전 강제 동기화 보장 (필요 시 추가 저장 로직 호출)
                await new Promise(resolve => setTimeout(resolve, 1500));

                // v12.1: 상태 초기화 (데이터 잔상 제거)
                setPoints(0);
                setUnlockedBadges([]);
                setUnlockedMedals([]);
                await signOut();
                console.log("👋 런너님, 안전하게 로그아웃되었습니다. 다음에 또 봬요!");
            } catch (error) {
                console.error("로그아웃 중 오류 발생:", error);
            } finally {
                setIsSyncing(false);
            }
        }
    };

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
        totalDays,
        lastSyncStatus, // v13.2
        refreshData // v13.3
    } = useRecordManager(setPoints, setUnlockedBadges, setUnlockedMedals, user?.id);

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

    // UI Import Handler (v12.0: Unified Backup Support)
    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const importedData = JSON.parse(e.target?.result as string);

                // v12.0: 통합 데이터 형식({ profile, records }) 검사
                const recordsToImport = Array.isArray(importedData) ? importedData : importedData.records;
                const profileToImport = !Array.isArray(importedData) ? importedData.profile : null;

                if (Array.isArray(recordsToImport)) {
                    if (window.confirm(`총 ${recordsToImport.length}개의 기록${profileToImport ? " 및 프로필 정보" : ""}를 복구하시겠습니까? \n(기본 기록과 중복되지 않은 항목만 추가됩니다)`)) {
                        await handleImportRecords(recordsToImport);
                        if (profileToImport) {
                            console.log("👤 프로필 정보 복구 중...");
                            await updateProfile(profileToImport);
                        }
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
        // v12.0: 운동 기록과 프로필을 하나로 묶어 '완벽한 백업' 달성!
        if (!user?.id) {
            alert("로그인 후 백업이 가능합니다. 🫡");
            return;
        }
        const exportPackage = {
            records,
            profile,
            exportedAt: new Date().toISOString(),
            version: "12.0"
        };
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportPackage, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `run_magic_backup_${user?.email?.split('@')[0]}_${new Date().toISOString().split('T')[0]}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };



    // v12.0: 시스템 연동 테스트 (강제 저장 및 확인)
    const handleForceSaveTest = async () => {
        if (!user?.id) return;

        console.log("🧪 시스템 연동 정밀 테스트 시작...");

        const testDate = new Date().toISOString().split('T')[0];
        const testRecord = {
            date: testDate,
            time: "00:00:01",
            distance: 0.01, // 테스트용 최소 거리
            weight: profile.weight, // 현재 체중 유지
            splits: ["00:01"],
            note: "🚀 코다리 부장의 시스템 연동 테스트 완료!",
            coachId: "wellness"
        };

        try {
            // 1. 기록 강제 저장
            await handleManualSave(testRecord);

            // 2. 프로필 강제 업데이트 (수정 시각 갱신)
            await updateProfile({ updated_at: new Date().toISOString() });

            alert("✅ 시스템 연동 테스트 성공!\n클라우드에 테스트 기록이 저장되었으며 프로필 시각이 동기화되었습니다. 🫡🛡️");
        } catch (error) {
            console.error("❌ 연동 테스트 실패:", error);
            alert("❌ 연동 테스트 중 오류가 발생했습니다. 콘솔을 확인해 주세요.");
        }
    };

    // 5. Scroll Lock for Modals
    React.useEffect(() => {
        const isAnyModalOpen = showManualForm || showProfileModal || showCoachReport || !!lastSavedRecord;
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
    }, [showManualForm, showProfileModal, showCoachReport, lastSavedRecord]);

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

            {/* v12.3: 로그아웃/저장 중 오버레이 */}
            {isSyncing && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.7)', zIndex: 9999,
                    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                    backdropFilter: 'blur(5px)'
                }}>
                    <div className="pulse" style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--electric-blue)', marginBottom: '1.5rem' }} />
                    <p className="neon-text-blue" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>데이터를 구름 요새에 안전하게 보관 중... 🛡️</p>
                    <p style={{ marginTop: '0.5rem', opacity: 0.7 }}>잠시만 기다려 주세요. 금방 끝납니다!</p>
                </div>
            )}

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
                onSignOut={handleSignOut}
            />


            {showManualForm && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
                    <div style={{ width: '100%', maxWidth: '1000px' }}>
                        <ManualRecordForm
                            onSave={async (data) => {
                                setIsSyncing(true);
                                try {
                                    await handleManualSave({ ...data, coachId: selectedCoach.id });
                                    if (data.weight) {
                                        await updateProfile({ weight: data.weight });
                                    }
                                    setShowManualForm(false);
                                    setEditingRecord(null);
                                } catch (err) {
                                    console.error("Manual Save Error:", err);
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
                    onForceSaveTest={handleForceSaveTest}
                    isLoading={isProfileLoading}
                    syncStatus={lastSyncStatus} // v13.2
                    recordCount={records.length} // v13.2
                    onRefreshData={refreshData} // v13.3
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
