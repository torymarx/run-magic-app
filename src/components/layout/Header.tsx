
import React from 'react';
import { PlusCircle, Zap, ArrowDownRight, Download, User } from 'lucide-react';

interface HeaderProps {
    isRecording: boolean;
    distance: number;
    points: number;
    totalDays: number;
    isCloudConnected: boolean;
    profile: any; // Quick handle to avoid deep type imports if not needed, but UserProfile is better
    onOpenManualForm: () => void;
    onOpenProfile: () => void;
    onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onExport: () => void;
    onSignOut: () => void;
}

const Header: React.FC<HeaderProps> = ({
    isRecording,
    distance,
    points,
    totalDays,
    isCloudConnected,
    profile,
    onOpenManualForm,
    onOpenProfile,
    onImport,
    onExport,
    onSignOut
}) => {
    const KODARI_EMOJIS: Record<string, Record<number, string>> = {
        male: { 1: '🐣', 2: '🔥', 3: '💪', 4: '⚡', 5: '👑' },
        female: { 1: '🐣', 2: '✨', 3: '🌿', 4: '🐆', 5: '👑' }
    };
    const gender = profile?.gender === 'female' ? 'female' : 'male';
    const characterEmoji = KODARI_EMOJIS[gender][profile?.characterId || 1] || '🐣';

    return (
        <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
                <h1 className="neon-text-blue" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Run-Magic</h1>
                <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                    <p style={{ opacity: 0.7 }}>
                        {isRecording ? `🏃‍♂️ ${profile?.name} 런너님, 지금 달리고 계시군요! 파이팅입니다!` : `안녕하세요 ${profile?.name} 런너님, 오늘은 러닝하기 딱 좋은 날씨예요! ${characterEmoji}`}
                    </p>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                        {distance >= 5 && <span title="5km 완주" style={{ color: 'var(--electric-blue)', fontSize: '1.2rem' }}>💎</span>}
                        {distance >= 10 && <span title="10km 완주" style={{ color: 'var(--neon-green)', fontSize: '1.2rem' }}>🏆</span>}
                        {distance >= 30 && <span title="30km 돌파" style={{ color: 'var(--vibrant-purple)', fontSize: '1.2rem' }}>👑</span>}
                    </div>
                </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <button
                    onClick={onOpenProfile}
                    title="런너님 프로필 관리"
                    style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(0,209,255,0.3)',
                        color: 'white',
                        padding: '0.6rem',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 10px rgba(0,209,255,0.1)'
                    }}
                >
                    <User size={18} className="neon-text-blue" />
                </button>
                <button
                    onClick={onOpenManualForm}
                    style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'white',
                        padding: '0.6rem 1.2rem',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.9rem'
                    }}
                >
                    <PlusCircle size={18} /> 과거 기록 입력
                </button>
                <div className="glass-card" style={{ padding: '0.6rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Zap size={16} className="neon-text-green" />
                    <span className="neon-text-green" style={{ fontWeight: 'bold', fontSize: '1rem' }}> {points.toLocaleString()} MP</span>
                </div>
                <div title={isCloudConnected ? "클라우드 백업 중" : "로컬 저장소 사용 중"} className="glass-card" style={{ padding: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', border: isCloudConnected ? '1px solid #00FF85' : '1px solid #FF4B4B' }}>
                    {isCloudConnected ? <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#00FF85', boxShadow: '0 0 10px #00FF85' }} /> : <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF4B4B' }} />}
                </div>
                {totalDays > 0 && (
                    <div className="glass-card" style={{ padding: '0.6rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #FF4B4B' }}>
                        🔥 {totalDays}일째
                    </div>
                )}
                <button
                    onClick={() => document.getElementById('import-input')?.click()}
                    title="데이터 가져오기 (복구)"
                    style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'white',
                        padding: '0.6rem',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        marginRight: '0.5rem'
                    }}
                >
                    <ArrowDownRight size={18} style={{ transform: 'rotate(180deg)' }} />
                </button>
                <input
                    type="file"
                    id="import-input"
                    accept=".json"
                    style={{ display: 'none' }}
                    onChange={onImport}
                />
                <button
                    onClick={onExport}
                    title="데이터 내보내기 (백업)"
                    style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'white',
                        padding: '0.6rem',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        marginRight: '0.5rem'
                    }}
                >
                    <Download size={18} />
                </button>
                <button
                    onClick={onSignOut}
                    title="로그아웃"
                    style={{
                        background: 'rgba(255, 75, 75, 0.1)',
                        border: '1px solid rgba(255, 75, 75, 0.3)',
                        color: '#ff4b4b',
                        padding: '0.6rem 1rem',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '0.85rem'
                    }}
                >
                    로그아웃 🫡
                </button>
            </div>
        </header>
    );
};

export default Header;
