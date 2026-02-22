import React, { useState } from 'react';
import { Edit3, X, ShieldCheck, RefreshCw, ChevronRight } from 'lucide-react';
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

                {/* Lower Section: System Analysis Integration */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '0 1rem' }}>
                    {/* Character Evolution Timeline */}
                    <div style={{ width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
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
                                            minWidth: '180px',
                                            padding: '1.5rem',
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
                                            <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'var(--electric-blue)', color: 'black', fontSize: '0.65rem', padding: '3px 8px', borderRadius: '8px', fontWeight: '900' }}>CURRENT</div>
                                        )}

                                        <div style={{
                                            width: '120px',
                                            height: '150px',
                                            margin: '0 auto 1.2rem',
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

                                        <div style={{ fontSize: '1rem', fontWeight: '900', color: isAchieved ? 'white' : 'rgba(255,255,255,0.3)', marginBottom: '4px' }}>
                                            STAGE {char.level}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: isCurrent ? 'var(--electric-blue)' : 'white', opacity: isAchieved ? 1 : 0.3, fontWeight: 'bold' }}>
                                            {char.name}
                                        </div>
                                    </div>
                                );
                            })}
                            <div style={{ minWidth: '5px' }} />
                        </div>
                    </div>

                    {/* AI Analysis Section - Expanded to full width as Goal is now in Widget */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: '800', opacity: 0.6, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <ShieldCheck size={18} className="neon-text-purple" /> SYSTEM ANALYSIS & STRATEGY
                        </span>
                        <div style={{
                            padding: '2rem',
                            background: 'linear-gradient(135deg, rgba(189,0,255,0.05) 0%, rgba(0,0,0,0.4) 100%)',
                            borderRadius: '32px',
                            borderLeft: '5px solid var(--vibrant-purple)',
                            border: '1px solid rgba(189,0,255,0.1)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.8rem',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                        }}>
                            <p style={{ fontSize: '1.1rem', lineHeight: '1.7', margin: 0, opacity: 0.9, color: 'white', fontWeight: '500' }}>
                                {profile.weight && profile.height ?
                                    `현재 런너님은 [${levelInfo.name}] 단계의 정점에 서 있습니다. ${points.toLocaleString()}XP를 달성했으며, 다음 진전을 위해 ${levelInfo.xpToNext.toLocaleString()}XP가 더 필요합니다. 당신의 신체 능력치는 레벨과 기록에 따라 실시간으로 진화하며, 마법진이 그 모든 땀방울을 기록하고 있습니다.` :
                                    "런너의 신체 데이터를 입력하면 더욱 정밀한 코칭 알고리즘이 가동되어 성장을 지원합니다. 현재 기본 성능으로 시스템이 대기 중입니다."}
                            </p>
                            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                                <div style={{ fontSize: '0.75rem', color: 'var(--vibrant-purple)', fontWeight: 'bold', background: 'rgba(189,0,255,0.1)', padding: '4px 12px', borderRadius: '10px' }}>ANALYSIS ACTIVE</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--electric-blue)', fontWeight: 'bold', background: 'rgba(0, 209, 255, 0.1)', padding: '4px 12px', borderRadius: '10px' }}>STRATEGY SYNCED</div>
                            </div>
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
