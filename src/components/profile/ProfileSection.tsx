import React, { useState } from 'react';
import { User, Scale, Ruler, Target, Edit3, Save, X, ShieldCheck, RefreshCw } from 'lucide-react';
import { UserProfile } from '../../hooks/useProfileManager';
import CharacterLevelWidget from './CharacterLevelWidget';

interface ProfileSectionProps {
    profile: UserProfile;
    onUpdate: (updates: Partial<UserProfile>) => Promise<void> | void;
    isLoading: boolean;
    syncStatus?: { status: string, time: string, message: string }; // v13.2
    recordCount?: number; // v13.2
    onRefreshData?: () => void; // v13.3
    onClose: () => void;
    points: number; // v16.0
    calculateLevelInfo: (points: number) => any; // v16.0
}

const KODARI_CHARACTERS: Record<string, any[]> = {
    male: [
        { id: 1, name: '신참 질주자', emoji: '🐣', description: '질주 꿈나무' },
        { id: 2, name: '열혈 러너', emoji: '🔥', description: '열정의 러너' },
        { id: 3, name: '강철 근육', emoji: '💪', description: '무한 체력' },
        { id: 4, name: '광속 스프린터', emoji: '⚡', description: '속도의 지배자' },
        { id: 5, name: '질주 마스터', emoji: '👑', description: '질주의 신' }
    ],
    female: [
        { id: 1, name: '꿈나무 러너', emoji: '🐣', description: '질주 꿈나무' },
        { id: 2, name: '빛나는 질주자', emoji: '✨', description: '빛나는 질주자' },
        { id: 3, name: '웰니스 퀸', emoji: '🌿', description: '웰니스 퀸' },
        { id: 4, name: '표범의 속도', emoji: '🐆', description: '표범의 속도' },
        { id: 5, name: '질주의 여왕', emoji: '👑', description: '질주의 여왕' }
    ]
};

const ProfileSection: React.FC<ProfileSectionProps> = ({
    profile, onUpdate, syncStatus, recordCount, onRefreshData, onClose,
    points, calculateLevelInfo
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<Partial<UserProfile>>(profile);

    const handleSave = () => {
        onUpdate(editData);
        setIsEditing(false);
    };


    const levelInfo = calculateLevelInfo(points);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            zIndex: 100,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '1rem'
        }}>
            <section className="glass-card" style={{
                padding: '2rem',
                width: '100%',
                maxWidth: '800px',
                maxHeight: '90vh', // 저해상도 대응: 최대 높이 제한
                overflowY: 'auto', // 저해상도 대응: 스크롤바 허용
                overscrollBehavior: 'contain',
                position: 'relative',
                overflowX: 'hidden',
                animation: 'slideUp 0.3s ease-out'
            }}>
                {/* Background Decorative Element */}
                <div style={{ position: 'absolute', top: '-10%', right: '-5%', opacity: 0.05, pointerEvents: 'none' }}>
                    <User size={300} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        {/* v16.0: 진화하는 캐릭터 위젯 배치 */}
                        <CharacterLevelWidget
                            totalPoints={points}
                            calculateLevelInfo={calculateLevelInfo}
                        />

                        <div>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editData.name}
                                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                    className="neon-input"
                                    style={{ fontSize: '1.5rem', fontWeight: 'bold', width: '200px', marginBottom: '4px' }}
                                    placeholder="성함을 입력하세요"
                                />
                            ) : (
                                <h2 className="neon-text-blue" style={{ fontSize: '2rem', fontWeight: 'bold', fontFamily: 'Outfit, sans-serif', margin: 0 }}>
                                    {profile.name} <span style={{ fontSize: '1rem', opacity: 0.5, fontWeight: 'normal' }}>런너님</span>
                                </h2>
                            )}
                            <p style={{
                                marginTop: '8px',
                                padding: '4px 12px',
                                background: 'rgba(0, 209, 255, 0.1)',
                                borderRadius: '20px',
                                color: 'var(--electric-blue)',
                                fontSize: '0.85rem',
                                display: 'inline-block',
                                border: '1px solid rgba(0, 209, 255, 0.2)'
                            }}>
                                {levelInfo.name} 모드로 질주 중 | {levelInfo.level}단계 달성
                            </p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="nav-chip"
                                style={{
                                    padding: '0.6rem 1.2rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    background: 'var(--electric-blue)',
                                    color: 'black',
                                    border: 'none',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    borderRadius: '12px',
                                    boxShadow: '0 0 15px rgba(0, 209, 255, 0.4)'
                                }}
                            >
                                <Edit3 size={16} /> 정보 수정
                            </button>
                        ) : (
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={handleSave} className="nav-chip" style={{ background: 'var(--neon-green)', color: 'black', border: 'none', fontWeight: 'bold', padding: '0.6rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '12px' }}>
                                    <Save size={16} /> 저장
                                </button>
                                <button onClick={() => setIsEditing(false)} className="nav-chip" style={{ padding: '0.6rem 1.2rem', border: '1px solid rgba(255,255,255,0.1)', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '12px' }}>
                                    <X size={16} /> 취소
                                </button>
                            </div>
                        )}
                        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', opacity: 0.5, padding: '5px' }}>
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* v18.2: 캐릭터 레벨 카드 전시기능 (스크롤 가능) */}
                <div style={{ marginBottom: '2.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <p style={{ fontSize: '1rem', fontWeight: 'bold', color: 'white', margin: 0, fontFamily: 'Outfit, sans-serif' }}>🧬 캐릭터 진화 타임라인</p>
                        {isEditing && (
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={() => setEditData({ ...editData, gender: 'male' })} style={{ padding: '4px 12px', borderRadius: '10px', fontSize: '0.75rem', cursor: 'pointer', background: editData.gender === 'male' ? 'rgba(0,209,255,0.2)' : 'rgba(255,255,255,0.05)', border: editData.gender === 'male' ? '1px solid var(--electric-blue)' : '1px solid transparent', color: editData.gender === 'male' ? 'var(--electric-blue)' : 'white' }}>남성</button>
                                <button onClick={() => setEditData({ ...editData, gender: 'female' })} style={{ padding: '4px 12px', borderRadius: '10px', fontSize: '0.75rem', cursor: 'pointer', background: editData.gender === 'female' ? 'rgba(189,0,255,0.2)' : 'rgba(255,255,255,0.05)', border: editData.gender === 'female' ? '1px solid var(--vibrant-purple)' : '1px solid transparent', color: editData.gender === 'female' ? 'var(--vibrant-purple)' : 'white' }}>여성</button>
                            </div>
                        )}
                    </div>

                    <div className="custom-scrollbar" style={{
                        display: 'flex',
                        gap: '1rem',
                        overflowX: 'auto',
                        paddingBottom: '1.2rem',
                        paddingTop: '0.5rem',
                        maskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
                    }}>
                        <div style={{ minWidth: '5px' }} />
                        {KODARI_CHARACTERS[editData.gender === 'female' ? 'female' : 'male'].map(char => {
                            const isCurrent = profile.characterId === char.id;
                            const isAchieved = levelInfo.level >= char.id;
                            const isSelected = editData.characterId === char.id;

                            return (
                                <div
                                    key={char.id}
                                    onClick={() => isEditing && setEditData({ ...editData, characterId: char.id })}
                                    style={{
                                        minWidth: '160px',
                                        width: '160px',
                                        padding: '1.5rem 1rem',
                                        borderRadius: '20px',
                                        textAlign: 'center',
                                        background: isSelected ? 'rgba(0,209,255,0.1)' : 'rgba(255,255,255,0.03)',
                                        border: isSelected ? '2px solid var(--electric-blue)' : '1px solid rgba(255,255,255,0.05)',
                                        boxShadow: isSelected ? '0 0 20px rgba(0,209,255,0.2)' : 'none',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        opacity: isAchieved || isEditing ? 1 : 0.4,
                                        cursor: isEditing ? 'pointer' : 'default',
                                        position: 'relative',
                                        transform: isSelected ? 'translateY(-5px)' : 'none'
                                    }}
                                >
                                    {isCurrent && (
                                        <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'var(--electric-blue)', color: 'black', fontSize: '0.6rem', padding: '2px 6px', borderRadius: '6px', fontWeight: 'bold' }}>ACTIVE</div>
                                    )}
                                    <div style={{ fontSize: '3rem', marginBottom: '1rem', filter: isAchieved || isEditing ? 'none' : 'grayscale(100%)' }}>{char.emoji}</div>
                                    <div style={{ fontSize: '1rem', fontWeight: 'bold', color: isAchieved || isEditing ? 'white' : 'rgba(255,255,255,0.3)', marginBottom: '4px' }}>Lv.{char.id} {char.name}</div>
                                    <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>{char.description}</div>
                                </div>
                            );
                        })}
                        <div style={{ minWidth: '5px' }} />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    {/* Weight Card */}
                    <div className="glass-card" style={{ padding: '1.2rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem', opacity: 0.7 }}>
                            <Scale size={18} className="neon-text-green" />
                            <span style={{ fontSize: '0.9rem' }}>체중</span>
                        </div>
                        {isEditing ? (
                            <input
                                type="number"
                                step="0.1"
                                value={editData.weight}
                                onChange={(e) => setEditData({ ...editData, weight: parseFloat(e.target.value) })}
                                className="neon-input"
                                style={{ width: '100%', fontSize: '1.2rem' }}
                            />
                        ) : (
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{profile.weight}<span style={{ fontSize: '0.9rem', opacity: 0.5, marginLeft: '0.3rem' }}>kg</span></div>
                        )}
                    </div>

                    {/* Height Card */}
                    <div className="glass-card" style={{ padding: '1.2rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem', opacity: 0.7 }}>
                            <Ruler size={18} className="neon-text-blue" />
                            <span style={{ fontSize: '0.9rem' }}>신장</span>
                        </div>
                        {isEditing ? (
                            <input
                                type="number"
                                value={editData.height}
                                onChange={(e) => setEditData({ ...editData, height: parseFloat(e.target.value) })}
                                className="neon-input"
                                style={{ width: '100%', fontSize: '1.2rem' }}
                            />
                        ) : (
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{profile.height}<span style={{ fontSize: '0.9rem', opacity: 0.5, marginLeft: '0.3rem' }}>cm</span></div>
                        )}
                    </div>

                    {/* Goal Card */}
                    <div className="glass-card" style={{ gridColumn: 'span 2', padding: '1.2rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem', opacity: 0.7 }}>
                            <Target size={18} className="neon-text-purple" />
                            <span style={{ fontSize: '0.9rem' }}>런너님의 질주 목표</span>
                        </div>
                        {isEditing ? (
                            <textarea
                                value={editData.goal}
                                onChange={(e) => setEditData({ ...editData, goal: e.target.value })}
                                className="neon-input"
                                style={{ width: '100%', height: '60px', resize: 'none' }}
                            />
                        ) : (
                            <div style={{ fontSize: '1.1rem', fontStyle: 'italic', color: 'var(--electric-blue)' }}>"{profile.goal}"</div>
                        )}
                    </div>
                </div>

                <div style={{ marginTop: '1.5rem', padding: '1.2rem', background: 'rgba(189,0,255,0.05)', borderRadius: '16px', borderLeft: '4px solid var(--vibrant-purple)', boxShadow: 'var(--inner-light)' }}>
                    <p style={{ fontSize: '0.95rem', color: 'var(--vibrant-purple)', fontWeight: 'bold', fontFamily: 'Outfit, sans-serif' }}>✨ 코칭 시스템 전문 분석 :</p>
                    <p style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: '0.3rem' }}>
                        {profile.weight && profile.height ?
                            `체질량 지수(BMI) 기반으로 볼 때, 현재 매우 건강한 질주 베이스를 갖추고 계십니다. 런너님의 ${profile.weight}kg 무게는 질주 시 지면 반발력을 극대화하기에 최적입니다.` :
                            "런너님의 상세 정보를 입력해 주시면 더욱 정밀한 코칭 분석 리포트를 제공해 드릴 수 있습니다."}
                    </p>
                </div>



                {/* 계정 관리 섹션 (신규) */}
                <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: 'rgba(0,209,255,0.03)', borderRadius: '12px', border: '1px solid rgba(0,209,255,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                        <ShieldCheck size={20} className="neon-text-blue" />
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0, fontFamily: 'Outfit, sans-serif' }}>런매직 공식 인증 계정</h3>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '10px' }}>
                        <div>
                            <p style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: '2px' }}>연결된 이메일</p>
                            <p style={{ fontSize: '1rem', color: 'var(--electric-blue)', fontWeight: 'bold' }}>{profile.id.includes('@') ? profile.id : "정식 로그인 상태 🫡"}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: '2px' }}>데이터베이스 상태</p>
                            <p style={{ fontSize: '0.9rem', color: 'var(--neon-green)' }}>● 구름 요새 연결됨</p>
                        </div>
                    </div>

                    {/* v13.4: Cloud Diagnostic HUD (영자실장 정밀 진단기 - Premium) */}
                    <div style={{
                        marginTop: '1.5rem',
                        padding: '1.5rem',
                        background: 'rgba(0, 10, 20, 0.6)',
                        borderRadius: '20px',
                        border: '1px solid rgba(0, 209, 255, 0.3)',
                        boxShadow: '0 0 20px rgba(0, 209, 255, 0.1)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {/* Decorative Gradient Glow */}
                        <div style={{
                            position: 'absolute',
                            top: '-20%',
                            left: '-20%',
                            width: '60%',
                            height: '60%',
                            background: 'radial-gradient(circle, rgba(0, 209, 255, 0.15) 0%, transparent 70%)',
                            pointerEvents: 'none'
                        }} />

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                            <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--electric-blue)', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold', fontFamily: 'Outfit, sans-serif' }}>
                                <ShieldCheck size={18} /> 클라우드 연동 정밀 진단
                            </h4>
                            {onRefreshData && (
                                <button
                                    onClick={() => {
                                        const btn = document.getElementById('refresh-icon');
                                        if (btn) btn.classList.add('spin-animation');
                                        onRefreshData();
                                        setTimeout(() => {
                                            if (btn) btn.classList.remove('spin-animation');
                                        }, 1000);
                                    }}
                                    className="glass-button"
                                    style={{
                                        padding: '6px 12px',
                                        fontSize: '0.75rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        background: 'rgba(0, 209, 255, 0.1)',
                                        border: '1px solid rgba(0, 209, 255, 0.3)',
                                        borderRadius: '10px'
                                    }}
                                >
                                    <RefreshCw id="refresh-icon" size={14} /> 강제 새로고침
                                </button>
                            )}
                        </div>

                        <div style={{ display: 'grid', gap: '1rem', fontSize: '0.85rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <span style={{ opacity: 0.5 }}>기기 식별 UUID</span>
                                <span style={{ fontFamily: 'monospace', color: 'var(--neon-green)', letterSpacing: '1px' }}>
                                    {profile.id.substring(0, 8)}...{profile.id.substring(profile.id.length - 4)}
                                </span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <span style={{ opacity: 0.5 }}>보관된 기록</span>
                                <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--electric-blue)' }}>
                                    {recordCount || 0} <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>sessions</span>
                                </span>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginTop: '0.4rem' }}>
                                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.8rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <p style={{ fontSize: '0.7rem', opacity: 0.4, marginBottom: '4px' }}>통신 상태</p>
                                    <p style={{
                                        color: syncStatus?.status?.includes('SUCCESS') ? 'var(--neon-green)' : (syncStatus?.status === 'IDLE' ? 'white' : '#FF4B4B'),
                                        fontWeight: 'bold',
                                        fontSize: '0.9rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '5px'
                                    }}>
                                        <div style={{
                                            width: '6px',
                                            height: '6px',
                                            borderRadius: '50%',
                                            background: syncStatus?.status?.includes('SUCCESS') ? 'var(--neon-green)' : (syncStatus?.status === 'IDLE' ? '#ccc' : '#FF4B4B'),
                                            boxShadow: syncStatus?.status?.includes('SUCCESS') ? '0 0 8px var(--neon-green)' : 'none'
                                        }} />
                                        {syncStatus?.status || 'STANDBY'}
                                    </p>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.8rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <p style={{ fontSize: '0.7rem', opacity: 0.4, marginBottom: '4px' }}>마지막 동기화</p>
                                    <p style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{syncStatus?.time || '-'}</p>
                                </div>
                            </div>

                            <div style={{
                                fontSize: '0.75rem',
                                opacity: 0.5,
                                padding: '0.8rem',
                                background: 'rgba(0,0,0,0.3)',
                                borderRadius: '10px',
                                border: '1px solid rgba(255,255,255,0.03)',
                                lineHeight: '1.4'
                            }}>
                                <span style={{ color: 'var(--electric-blue)', fontWeight: 'bold' }}>📡 시스템 메시지:</span> {syncStatus?.message || '대기 중...'}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ProfileSection;
