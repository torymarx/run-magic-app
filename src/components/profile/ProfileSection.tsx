import React, { useState } from 'react';
import { Target, Edit3, X, ShieldCheck, RefreshCw, ChevronRight } from 'lucide-react';
import { UserProfile } from '../../hooks/useProfileManager';
import CharacterLevelWidget from './CharacterLevelWidget';
import { LEVEL_DATA, getCharacterImageUrl } from '../../data/progression';

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
            background: 'rgba(0,0,0,0.94)',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '1rem',
            backdropFilter: 'blur(15px)'
        }}>
            <section className="glass-card custom-scrollbar" style={{
                padding: '2.5rem',
                width: '100%',
                maxWidth: '900px',
                maxHeight: '92vh',
                overflowY: 'auto',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: '2.5rem',
                animation: 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                background: 'rgba(20, 25, 30, 0.8)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '40px'
            }}>
                {/* Master Profile Card Integration (v21.1) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', width: '100%' }}>
                    <CharacterLevelWidget
                        totalPoints={points}
                        calculateLevelInfo={calculateLevelInfo}
                        profile={isEditing ? editData : profile}
                        isEditing={isEditing}
                        onEditChange={(field, value) => {
                            let processedValue: any = value;
                            if (field === 'weight' || field === 'height') {
                                processedValue = parseFloat(value) || 0;
                            }
                            setEditData(prev => ({ ...prev, [field]: processedValue }));
                        }}
                    />

                    {/* Action Buttons Row */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', padding: '0 1rem' }}>
                        {!isEditing ? (
                            <button
                                onClick={() => { setIsEditing(true); setEditData(profile); }}
                                className="nav-chip"
                                style={{
                                    padding: '0.7rem 1.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.6rem',
                                    background: 'var(--electric-blue)',
                                    color: 'black',
                                    border: 'none',
                                    fontWeight: '900',
                                    cursor: 'pointer',
                                    borderRadius: '16px',
                                    fontSize: '0.9rem',
                                    boxShadow: '0 4px 15px rgba(0, 209, 255, 0.3)',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <Edit3 size={18} /> Edit Profile
                            </button>
                        ) : (
                            <div style={{ display: 'flex', gap: '0.8rem' }}>
                                <button
                                    onClick={handleSave}
                                    style={{
                                        padding: '0.7rem 2rem',
                                        background: 'var(--neon-green)',
                                        color: 'black',
                                        border: 'none',
                                        fontWeight: '900',
                                        borderRadius: '14px',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem',
                                        boxShadow: '0 4px 15px rgba(57, 255, 20, 0.3)'
                                    }}
                                >
                                    SAVE
                                </button>
                                <button
                                    onClick={() => { setIsEditing(false); setEditData(profile); }}
                                    style={{
                                        padding: '0.7rem 2rem',
                                        background: 'rgba(255,255,255,0.05)',
                                        color: 'white',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        fontWeight: '900',
                                        borderRadius: '14px',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    CANCEL
                                </button>
                            </div>
                        )}
                        {!isEditing && (
                            <button
                                onClick={onClose}
                                style={{
                                    background: 'rgba(255,255,255,0.05)',
                                    border: 'none',
                                    color: 'white',
                                    cursor: 'pointer',
                                    width: '46px',
                                    height: '46px',
                                    borderRadius: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <X size={24} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Character Evolution Timeline */}
                <div style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', padding: '0 1rem' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '900', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '-0.5px' }}>
                            <ChevronRight size={22} className="neon-text-blue" /> Evolution Stages
                        </h3>
                        <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>Level up to unlock new forms ✨</span>
                    </div>

                    <div className="custom-scrollbar" style={{
                        display: 'flex',
                        gap: '1.5rem',
                        overflowX: 'auto',
                        padding: '1rem',
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
                                        minWidth: '200px',
                                        padding: '1.8rem',
                                        borderRadius: '28px',
                                        textAlign: 'center',
                                        background: isCurrent ? 'rgba(0, 209, 255, 0.08)' : 'rgba(255,255,255,0.02)',
                                        border: isCurrent ? '2px solid var(--electric-blue)' : '1px solid rgba(255,255,255,0.05)',
                                        boxShadow: isCurrent ? '0 10px 40px rgba(0, 209, 255, 0.15)' : 'none',
                                        opacity: isAchieved ? 1 : 0.4,
                                        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                        position: 'relative'
                                    }}
                                >
                                    {isCurrent && (
                                        <div style={{ position: 'absolute', top: '15px', right: '15px', background: 'var(--electric-blue)', color: 'black', fontSize: '0.7rem', padding: '4px 10px', borderRadius: '10px', fontWeight: '900' }}>CURRENT</div>
                                    )}

                                    <div style={{
                                        width: '140px',
                                        height: '170px',
                                        margin: '0 auto 1.5rem',
                                        display: 'flex',
                                        alignItems: 'flex-end',
                                        justifyContent: 'center',
                                        position: 'relative',
                                        background: isAchieved ? 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)' : 'none',
                                        filter: isAchieved ? 'none' : 'grayscale(100%) brightness(0.4)',
                                    }}>
                                        <img
                                            src={getCharacterImageUrl(char.level, profile.gender)}
                                            alt={char.name}
                                            style={{
                                                width: 'auto',
                                                height: '100%',
                                                objectFit: 'contain',
                                                filter: isCurrent ? 'drop-shadow(0 0 15px var(--electric-blue))' : 'none'
                                            }}
                                        />
                                    </div>

                                    <div style={{ fontSize: '1.1rem', fontWeight: '900', color: isAchieved ? 'white' : 'rgba(255,255,255,0.3)', marginBottom: '4px', letterSpacing: '-0.5px' }}>
                                        STAGE {char.level}
                                    </div>
                                    <div style={{ fontSize: '0.9rem', color: isCurrent ? 'var(--electric-blue)' : 'white', opacity: isAchieved ? 1 : 0.3, fontWeight: 'bold' }}>
                                        {char.name}
                                    </div>
                                </div>
                            );
                        })}
                        <div style={{ minWidth: '5px' }} />
                    </div>
                </div>

                {/* Lower Section: Bio & AI Status */}
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1.2fr', gap: '2rem', padding: '0 1rem' }}>
                    {/* Goal / Bio Section */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: '800', opacity: 0.6, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Target size={18} className="neon-text-blue" /> RUNNING AMBITION
                        </span>
                        {isEditing ? (
                            <textarea
                                value={editData.goal}
                                onChange={(e) => setEditData({ ...editData, goal: e.target.value })}
                                className="neon-input"
                                style={{
                                    width: '100%',
                                    height: '120px',
                                    resize: 'none',
                                    padding: '1.2rem',
                                    fontSize: '1rem',
                                    borderRadius: '20px',
                                    background: 'rgba(0,0,0,0.3)'
                                }}
                                placeholder="당신의 질주 목표를 공유하세요"
                            />
                        ) : (
                            <div style={{
                                padding: '1.5rem',
                                background: 'rgba(255,255,255,0.03)',
                                borderRadius: '24px',
                                border: '1px solid rgba(255,255,255,0.05)',
                                minHeight: '120px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center'
                            }}>
                                <p style={{ fontSize: '1.1rem', fontStyle: 'italic', margin: 0, color: 'rgba(255,255,255,0.9)', lineHeight: 1.6 }}>
                                    "{profile.goal || '작은 걸음이 모여 위대한 여정이 됩니다.'}"
                                </p>
                            </div>
                        )}
                    </div>

                    {/* AI Analysis Section */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: '800', opacity: 0.6, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <ShieldCheck size={18} className="neon-text-purple" /> SYSTEM ANALYSIS
                        </span>
                        <div style={{
                            padding: '1.5rem',
                            background: 'rgba(189,0,255,0.05)',
                            borderRadius: '24px',
                            borderLeft: '5px solid var(--vibrant-purple)',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center'
                        }}>
                            <p style={{ fontSize: '1rem', lineHeight: '1.6', margin: 0, opacity: 0.9, color: 'white' }}>
                                {profile.weight && profile.height ?
                                    `현재 런너님은 [${levelInfo.name}] 단계의 정점에 서 있습니다. ${points.toLocaleString()}XP를 달성했으며, 다음 진전까지 ${levelInfo.xpToNext.toLocaleString()}XP가 더 필요합니다. 마법진이 당신의 진화를 기록 중입니다.` :
                                    "런너의 신체 데이터를 입력하면 더욱 정밀한 코칭 알고리즘이 가동되어 성장을 지원합니다."}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Cloud Sync Diagnostic Footer */}
                {onRefreshData && (
                    <div style={{
                        marginTop: '1rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '1.2rem 1.8rem',
                        background: 'rgba(0, 0, 0, 0.4)',
                        borderRadius: '24px',
                        border: '1px solid rgba(0, 209, 255, 0.15)',
                        margin: '0 1rem'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <RefreshCw size={16} className="neon-text-blue" />
                            <span style={{ fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '0.5px', opacity: 0.6 }}>CLOUD DATA SYNC : {syncStatus?.time || 'LAST STABLE SESSION'}</span>
                        </div>
                        <button
                            onClick={onRefreshData}
                            className="neon-button-blue"
                            style={{
                                background: 'transparent',
                                border: '1px solid var(--electric-blue)',
                                color: 'var(--electric-blue)',
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                fontWeight: '900',
                                padding: '6px 16px',
                                borderRadius: '10px'
                            }}
                        >
                            RUN DIAGNOSTIC
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
};

export default ProfileSection;
