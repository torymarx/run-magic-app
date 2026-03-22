
import React from 'react';
import { PlusCircle, Zap, ArrowDownRight, Download, User } from 'lucide-react';

interface HeaderProps {
    isRecording: boolean;
    points: number;
    totalDays: number;
    isCloudConnected: boolean;
    profile: any;
    levelInfo: any;
    hasRunToday: boolean; // v24.6
    onOpenManualForm: () => void;
    onOpenProfile: () => void;
    onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onExport: () => void;
    onSignOut: () => void;
}

const Header: React.FC<HeaderProps> = ({
    isRecording,
    points,
    totalDays,
    isCloudConnected,
    profile,
    levelInfo,
    hasRunToday,
    onOpenManualForm,
    onOpenProfile,
    onImport,
    onExport,
    onSignOut
}) => {
    const CHARACTER_EMOJIS: Record<string, Record<number, string>> = {
        male: { 1: '🐣', 2: '🔥', 3: '💪', 4: '⚡', 5: '👑' },
        female: { 1: '🐣', 2: '✨', 3: '🌿', 4: '🐆', 5: '👑' }
    };
    const gender = profile?.gender === 'female' ? 'female' : 'male';
    const characterEmoji = CHARACTER_EMOJIS[gender][profile?.characterId || 1] || '🐣';

    return (
        <header className="global-nav">
            {/* Left Box: Logo & Persona Message */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <h1 className="neon-text-blue logo-text" style={{ fontSize: '1.8rem', margin: 0, cursor: 'pointer' }}>Run-Magic</h1>
                <div className="hide-mobile" style={{ height: '24px', width: '1px', background: 'rgba(255,255,255,0.1)' }} />
                <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <div className="character-avatar-mini" style={{
                        width: '40px',
                        height: '40px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        position: 'relative',
                        cursor: 'pointer'
                    }} onClick={onOpenProfile}>
                        {characterEmoji}
                        <div style={{
                            position: 'absolute',
                            bottom: '-4px',
                            right: '-4px',
                            background: 'var(--electric-blue)',
                            color: 'black',
                            fontSize: '0.6rem',
                            padding: '1px 4px',
                            borderRadius: '4px',
                            fontWeight: 'bold'
                        }}>
                            LV.{profile?.characterId || 1}
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{levelInfo?.name || '비기너'}</span>
                        <p style={{ fontSize: '0.75rem', opacity: 0.6, margin: 0 }}>
                            {isRecording ? `🏃‍♂️ 달리는 중...` : `${profile?.name || '런너'}님, 환영합니다!`}
                        </p>
                    </div>
                </div>
            </div>

            {/* Center Box: Integrated Status Cluster */}
            <div className="nav-status-group" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <div className="nav-chip" title="누적 마법 포인트">
                    <Zap size={14} className="neon-text-green" />
                    <span style={{ fontWeight: 'bold' }}>{points.toLocaleString()} MP</span>
                </div>
                {totalDays > 0 && (
                    <div className="nav-chip" style={{ border: '1px solid rgba(255, 75, 75, 0.3)' }} title="연속 주행 일수">
                        <span style={{ color: '#FF4B4B' }}>🔥 {totalDays}일</span>
                    </div>
                )}
                <div className="nav-chip"
                    title={isCloudConnected ? "서버 동기화 보호 중" : "데이터 전송 중..."}
                    style={{ border: isCloudConnected ? '1px solid rgba(0, 255, 133, 0.3)' : '1px solid rgba(255, 204, 0, 0.3)' }}
                >
                    <div className={isCloudConnected ? "" : "pulse"} style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: isCloudConnected ? '#00FF85' : '#FFCC00',
                        boxShadow: `0 0 8px ${isCloudConnected ? '#00FF85' : '#FFCC00'}`
                    }} />
                    <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: isCloudConnected ? '#00FF85' : '#FFCC00' }}>
                        {isCloudConnected ? "SYNC" : "SYNCING"}
                    </span>
                </div>

                {/* v24.6: 일일 퀘스트 (Daily Quest) 스테이터스 */}
                <div className="daily-quest-group hide-mobile" style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    background: 'rgba(0,0,0,0.2)',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.05)'
                }}>
                    <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold', textTransform: 'uppercase', marginRight: '4px' }}>QUEST</span>
                    
                    {/* 방문 퀘스트 (Attendance) - 프로필에 오늘 날짜가 있으면 완료 */}
                    {(() => {
                        const todayStr = new Date().toLocaleDateString('en-CA');
                        const hasVisited = profile?.attendanceDates?.includes(todayStr);
                        return (
                            <div style={{ 
                                display: 'flex', alignItems: 'center', gap: '4px', 
                                opacity: hasVisited ? 1 : 0.4,
                                color: hasVisited ? '#00FF85' : 'white',
                                transition: 'all 0.3s'
                            }} title={hasVisited ? "오늘의 방문 완료! (10 XP)" : "오늘의 방문 전 (10 XP 획기 가능)"}>
                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: hasVisited ? '#00FF85' : 'white' }} />
                                <span style={{ fontSize: '0.7rem', fontWeight: 'bold' }}>방문</span>
                            </div>
                        );
                    })()}

                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />

                    {/* 러닝 퀘스트 (Running) */}
                    <div style={{ 
                        display: 'flex', alignItems: 'center', gap: '4px',
                        opacity: hasRunToday ? 1 : 0.4,
                        color: hasRunToday ? '#00D1FF' : 'white',
                        transition: 'all 0.3s'
                    }} title={hasRunToday ? "오늘의 러닝 완료! (10 XP)" : "오늘의 러닝 전 (10 XP 획득 가능)"}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: hasRunToday ? '#00D1FF' : 'white' }} />
                        <span style={{ fontSize: '0.7rem', fontWeight: 'bold' }}>러닝</span>
                    </div>
                </div>
            </div>

            {/* Right Box: Integrated Action Cluster */}
            <div className="nav-action-group" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                {/* Data Tools */}
                <div className="hide-mobile" style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '2px' }}>
                    <button onClick={() => document.getElementById('import-input')?.click()} title="복구" style={{ background: 'none', border: 'none', padding: '0.5rem', color: 'white', cursor: 'pointer', display: 'flex' }}><ArrowDownRight size={16} style={{ transform: 'rotate(180deg)', opacity: 0.6 }} /></button>
                    <button onClick={onExport} title="백업" style={{ background: 'none', border: 'none', padding: '0.5rem', color: 'white', cursor: 'pointer', display: 'flex' }}><Download size={16} style={{ opacity: 0.6 }} /></button>
                </div>

                <button
                    onClick={onOpenManualForm}
                    className="nav-chip"
                    style={{ background: 'var(--electric-blue)', color: 'black', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
                >
                    <PlusCircle size={16} /> 기록 입력
                </button>

                <button
                    onClick={onOpenProfile}
                    style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid var(--glass-border)',
                        color: 'white',
                        width: '38px', height: '38px',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--electric-blue)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}
                >
                    <User size={18} className="neon-text-blue" />
                </button>

                <button
                    onClick={onSignOut}
                    title="로그아웃"
                    className="hide-mobile"
                    style={{
                        background: 'rgba(255, 75, 75, 0.05)',
                        border: '1px solid rgba(255, 75, 75, 0.2)',
                        color: '#ff4b4b',
                        padding: '0.5rem 0.8rem',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                    }}
                >
                    OUT
                </button>
                <input type="file" id="import-input" accept=".json" style={{ display: 'none' }} onChange={onImport} />
            </div>
        </header>
    );
};

export default Header;
