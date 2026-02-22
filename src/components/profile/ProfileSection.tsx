import React, { useState } from 'react';
import { User, Scale, Ruler, Target, Edit3, X, ShieldCheck, RefreshCw, ChevronRight } from 'lucide-react';
import { UserProfile } from '../../hooks/useProfileManager';
import CharacterLevelWidget from './CharacterLevelWidget';
import { LEVEL_DATA } from '../../data/progression';

interface ProfileSectionProps {
    profile: UserProfile;
    onUpdate: (updates: Partial<UserProfile>) => Promise<void> | void;
    syncStatus?: { status: string, time: string, message: string };
    onRefreshData?: () => void;
    onClose: () => void;
    points: number;
    calculateLevelInfo: (points: number) => any;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
    profile, onUpdate, syncStatus, onRefreshData, onClose,
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
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.92)',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '1rem',
            backdropFilter: 'blur(10px)'
        }}>
            <section className="glass-card" style={{
                padding: '2.5rem',
                width: '100%',
                maxWidth: '850px',
                maxHeight: '90vh',
                overflowY: 'auto',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem',
                animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
                {/* Header Section: Title & Close/Edit Buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <CharacterLevelWidget
                            totalPoints={points}
                            calculateLevelInfo={calculateLevelInfo}
                        />
                        <div>
                            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', fontFamily: 'Outfit, sans-serif', margin: 0, color: 'white' }}>
                                {profile.name} <span style={{ fontSize: '1rem', opacity: 0.5, fontWeight: 'normal' }}>런너 프로필</span>
                            </h2>
                            <p style={{ marginTop: '4px', color: 'var(--electric-blue)', fontSize: '0.9rem', fontWeight: 'bold' }}>
                                LEVEL {levelInfo.level} · {levelInfo.name}
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="nav-chip"
                                style={{
                                    padding: '0.7rem 1.4rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.6rem',
                                    background: 'var(--electric-blue)',
                                    color: 'black',
                                    border: 'none',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    borderRadius: '14px',
                                    boxShadow: '0 4px 15px rgba(0, 209, 255, 0.3)'
                                }}
                            >
                                <Edit3 size={18} /> 정보 수정
                            </button>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                <button
                                    onClick={handleSave}
                                    style={{
                                        padding: '0.6rem 2rem',
                                        background: 'var(--neon-green)',
                                        color: 'black',
                                        border: 'none',
                                        fontWeight: 'bold',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 12px rgba(57, 255, 20, 0.2)'
                                    }}
                                >
                                    저장하기
                                </button>
                                <button
                                    onClick={() => { setIsEditing(false); setEditData(profile); }}
                                    style={{
                                        padding: '0.5rem 2rem',
                                        background: 'rgba(255,255,255,0.05)',
                                        color: 'white',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        fontWeight: 'bold',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        fontSize: '0.85rem'
                                    }}
                                >
                                    취소
                                </button>
                            </div>
                        )}
                        {!isEditing && (
                            <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', cursor: 'pointer', width: '44px', height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <X size={24} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Integrated Identity Card (개인정보 통합 입력창) */}
                <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    padding: '1.5rem',
                    borderRadius: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1.5rem',
                    flexWrap: 'wrap'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '120px', flex: 1 }}>
                        <span style={{ fontSize: '0.75rem', opacity: 0.5, display: 'flex', alignItems: 'center', gap: '4px' }}><User size={12} /> 성함</span>
                        {isEditing ? (
                            <input
                                type="text"
                                value={editData.name}
                                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                className="neon-input"
                                style={{ width: '100%', fontSize: '0.95rem', padding: '8px' }}
                                placeholder="이름"
                            />
                        ) : (
                            <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{profile.name}</div>
                        )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '100px', flex: 1 }}>
                        <span style={{ fontSize: '0.75rem', opacity: 0.5, display: 'flex', alignItems: 'center', gap: '4px' }}><ShieldCheck size={12} /> 성별</span>
                        {isEditing ? (
                            <div style={{ display: 'flex', gap: '4px' }}>
                                <button onClick={() => setEditData({ ...editData, gender: 'male' })} style={{ flex: 1, padding: '6px', borderRadius: '8px', fontSize: '0.75rem', cursor: 'pointer', background: editData.gender === 'male' ? 'rgba(0,209,255,0.2)' : 'rgba(255,255,255,0.05)', border: editData.gender === 'male' ? '1px solid var(--electric-blue)' : '1px solid transparent', color: editData.gender === 'male' ? 'var(--electric-blue)' : 'white' }}>남</button>
                                <button onClick={() => setEditData({ ...editData, gender: 'female' })} style={{ flex: 1, padding: '6px', borderRadius: '8px', fontSize: '0.75rem', cursor: 'pointer', background: editData.gender === 'female' ? 'rgba(189,0,255,0.2)' : 'rgba(255,255,255,0.05)', border: editData.gender === 'female' ? '1px solid var(--vibrant-purple)' : '1px solid transparent', color: editData.gender === 'female' ? 'var(--vibrant-purple)' : 'white' }}>여</button>
                            </div>
                        ) : (
                            <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{profile.gender === 'male' ? '남성' : '여성'}</div>
                        )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '90px', flex: 1 }}>
                        <span style={{ fontSize: '0.75rem', opacity: 0.5, display: 'flex', alignItems: 'center', gap: '4px' }}><Scale size={12} /> 체중</span>
                        {isEditing ? (
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={editData.weight}
                                    onChange={(e) => setEditData({ ...editData, weight: parseFloat(e.target.value) })}
                                    className="neon-input"
                                    style={{ width: '100%', fontSize: '0.95rem', padding: '8px 25px 8px 8px' }}
                                />
                                <span style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5, fontSize: '0.7rem' }}>kg</span>
                            </div>
                        ) : (
                            <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{profile.weight}<span style={{ fontSize: '0.8rem', opacity: 0.5, marginLeft: '2px' }}>kg</span></div>
                        )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '90px', flex: 1 }}>
                        <span style={{ fontSize: '0.75rem', opacity: 0.5, display: 'flex', alignItems: 'center', gap: '4px' }}><Ruler size={12} /> 신장</span>
                        {isEditing ? (
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="number"
                                    value={editData.height}
                                    onChange={(e) => setEditData({ ...editData, height: parseFloat(e.target.value) })}
                                    className="neon-input"
                                    style={{ width: '100%', fontSize: '0.95rem', padding: '8px 25px 8px 8px' }}
                                />
                                <span style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5, fontSize: '0.7rem' }}>cm</span>
                            </div>
                        ) : (
                            <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{profile.height}<span style={{ fontSize: '0.8rem', opacity: 0.5, marginLeft: '2px' }}>cm</span></div>
                        )}
                    </div>
                </div>

                {/* Character Evolution Showcase (1-5단계 전시형 창) */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <ChevronRight size={20} className="neon-text-blue" /> 캐릭터 진화 스테이지
                        </h3>
                        <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>레벨 달성 시 자동으로 진화합니다 ✨</span>
                    </div>

                    <div className="custom-scrollbar" style={{
                        display: 'flex',
                        gap: '1.5rem',
                        overflowX: 'auto',
                        paddingBottom: '1.5rem',
                        maskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
                    }}>
                        <div style={{ minWidth: '5px' }} />
                        {LEVEL_DATA.map(char => {
                            const isCurrent = levelInfo.level === char.level;
                            const isAchieved = levelInfo.level >= char.level;

                            return (
                                <div
                                    key={char.level}
                                    style={{
                                        minWidth: '180px',
                                        padding: '1.5rem',
                                        borderRadius: '24px',
                                        textAlign: 'center',
                                        background: isCurrent ? 'rgba(0, 209, 255, 0.08)' : 'rgba(255,255,255,0.02)',
                                        border: isCurrent ? '2px solid var(--electric-blue)' : '1px solid rgba(255,255,255,0.05)',
                                        boxShadow: isCurrent ? '0 0 30px rgba(0, 209, 255, 0.15)' : 'none',
                                        opacity: isAchieved ? 1 : 0.4,
                                        transition: 'all 0.4s ease',
                                        position: 'relative'
                                    }}
                                >
                                    {isCurrent && (
                                        <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'var(--electric-blue)', color: 'black', fontSize: '0.65rem', padding: '3px 8px', borderRadius: '8px', fontWeight: 'bold' }}>CURRENT</div>
                                    )}

                                    <div style={{
                                        width: '90px',
                                        height: '90px',
                                        margin: '0 auto 1.2rem',
                                        borderRadius: '50%',
                                        overflow: 'hidden',
                                        border: `2px solid ${isCurrent ? 'var(--electric-blue)' : 'rgba(255,255,255,0.1)'}`,
                                        background: 'rgba(0,0,0,0.3)',
                                        filter: isAchieved ? 'none' : 'grayscale(100%) brightness(0.6)'
                                    }}>
                                        {char.imageUrl ? (
                                            <img
                                                src={char.imageUrl.replace('file:///', '')}
                                                alt={char.name}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <User opacity={0.3} />
                                            </div>
                                        )}
                                    </div>

                                    <div style={{ fontSize: '1rem', fontWeight: 'bold', color: isAchieved ? 'white' : 'rgba(255,255,255,0.3)', marginBottom: '6px' }}>
                                        STAGE {char.level}
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: isCurrent ? 'var(--electric-blue)' : 'white', opacity: isAchieved ? 0.9 : 0.3, fontWeight: isCurrent ? 'bold' : 'normal' }}>
                                        {char.name}
                                    </div>
                                </div>
                            );
                        })}
                        <div style={{ minWidth: '5px' }} />
                    </div>
                </div>

                {/* Additional Info: Goal & System Status */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        <span style={{ fontSize: '0.8rem', opacity: 0.5, display: 'flex', alignItems: 'center', gap: '6px' }}><Target size={14} /> 질주 목표</span>
                        {isEditing ? (
                            <textarea
                                value={editData.goal}
                                onChange={(e) => setEditData({ ...editData, goal: e.target.value })}
                                className="neon-input"
                                style={{ width: '100%', height: '80px', resize: 'none', padding: '12px', fontSize: '1rem' }}
                                placeholder="당신의 질주 목표를 공유하세요"
                            />
                        ) : (
                            <div style={{ padding: '1.2rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', fontStyle: 'italic', border: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)' }}>
                                "{profile.goal}"
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        <span style={{ fontSize: '0.8rem', opacity: 0.5, display: 'flex', alignItems: 'center', gap: '6px' }}><ShieldCheck size={14} /> 시스템 분석 현황</span>
                        <div style={{ padding: '1.2rem', background: 'rgba(189,0,255,0.03)', borderRadius: '16px', borderLeft: '4px solid var(--vibrant-purple)', minHeight: '80px' }}>
                            <p style={{ fontSize: '0.85rem', lineHeight: '1.5', margin: 0, opacity: 0.8 }}>
                                {profile.weight && profile.height ?
                                    `현재 레벨 ${levelInfo.level}단계 도달을 위해 총 ${points}포인트를 획득했습니다. 다음 단계까지 ${levelInfo.xpToNext}P 남았습니다.` :
                                    "상세 정보를 입력하면 더욱 정밀한 코칭 알고리즘이 가동됩니다."}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Diagnostic Footer */}
                {onRefreshData && (
                    <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(0, 10, 20, 0.4)', borderRadius: '16px', border: '1px solid rgba(0, 209, 255, 0.1)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <RefreshCw size={14} className="neon-text-blue" />
                            <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>CLOUD SYNC : {syncStatus?.time || 'LAST SESSION'}</span>
                        </div>
                        <button
                            onClick={onRefreshData}
                            style={{ background: 'none', border: 'none', color: 'var(--electric-blue)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            정밀 진단기 가동
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
};

export default ProfileSection;
