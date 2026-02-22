import React from 'react';
import { LucideIcon, User, Weight, Ruler, Award, Shield } from 'lucide-react';
import { getCharacterImageUrl } from '../../data/progression';

interface CharacterLevelWidgetProps {
    totalPoints: number;
    calculateLevelInfo: (points: number) => any;
    profile: any;
    isEditing?: boolean;
    onEditChange?: (field: string, value: string) => void;
}

const CharacterLevelWidget: React.FC<CharacterLevelWidgetProps> = ({
    totalPoints, calculateLevelInfo, profile, isEditing = false, onEditChange
}) => {
    const levelInfo = calculateLevelInfo(totalPoints);

    // 레벨별 테마 색상 및 효과 매핑
    const themes = [
        { color: '#8C8C8C', effect: 'none', bg: 'rgba(255,255,255,0.05)' }, // Lv1
        { color: '#00D1FF', effect: 'pulse', bg: 'rgba(0, 209, 255, 0.1)' }, // Lv2
        { color: '#00FF85', effect: 'sparkle', bg: 'rgba(0, 255, 133, 0.1)' }, // Lv3
        { color: '#BD00FF', effect: 'flare', bg: 'rgba(189, 0, 255, 0.1)' }, // Lv4
        { color: '#FFD700', effect: 'aurora', bg: 'linear-gradient(45deg, rgba(255, 215, 0, 0.2), rgba(0, 209, 255, 0.2))' } // Lv5
    ];

    const theme = themes[levelInfo.level - 1] || themes[0];
    const characterUrl = getCharacterImageUrl(levelInfo.level, profile.gender);

    const InfoItem = ({ icon: Icon, label, value, field }: { icon: LucideIcon, label: string, value: string, field?: string }) => (
        <div style={{
            background: 'rgba(255,255,255,0.03)',
            padding: '12px 16px',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            transition: 'all 0.3s ease'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', opacity: 0.5, letterSpacing: '0.5px' }}>
                <Icon size={12} /> {label}
            </div>
            {isEditing && field ? (
                field === 'gender' ? (
                    <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                        <button
                            onClick={() => onEditChange?.('gender', 'male')}
                            style={{
                                flex: 1, padding: '4px', borderRadius: '8px', fontSize: '0.65rem', cursor: 'pointer',
                                background: value.toLowerCase() === 'male' ? `${theme.color}44` : 'rgba(255,255,255,0.05)',
                                border: `1px solid ${value.toLowerCase() === 'male' ? theme.color : 'transparent'}`,
                                color: 'white'
                            }}
                        >MALE</button>
                        <button
                            onClick={() => onEditChange?.('gender', 'female')}
                            style={{
                                flex: 1, padding: '4px', borderRadius: '8px', fontSize: '0.65rem', cursor: 'pointer',
                                background: value.toLowerCase() === 'female' ? `${theme.color}44` : 'rgba(255,255,255,0.05)',
                                border: `1px solid ${value.toLowerCase() === 'female' ? theme.color : 'transparent'}`,
                                color: 'white'
                            }}
                        >FEMALE</button>
                    </div>
                ) : (
                    <input
                        type="text"
                        value={value.replace(/kg|cm/g, '')}
                        onChange={(e) => onEditChange?.(field, e.target.value)}
                        style={{
                            background: 'none',
                            border: 'none',
                            borderBottom: `1px solid ${theme.color}88`,
                            color: 'white',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            width: '100%',
                            outline: 'none',
                            padding: '2px 0'
                        }}
                    />
                )
            ) : (
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: theme.color }}>{value}</div>
            )}
        </div>
    );

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            padding: '2rem',
            background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.4) 100%)',
            borderRadius: '32px',
            border: `1px solid ${theme.color}33`,
            boxShadow: `0 20px 50px rgba(0,0,0,0.5), 0 0 30px ${theme.color}11`,
            width: '100%',
            maxWidth: '650px',
            position: 'relative',
            overflow: 'hidden',
            margin: '0 auto'
        }}>
            {/* Header: Name & Level Label */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 1 }}>
                <div>
                    {isEditing ? (
                        <input
                            type="text"
                            value={profile.name}
                            onChange={(e) => onEditChange?.('name', e.target.value)}
                            className="neon-input"
                            style={{
                                background: 'none',
                                border: 'none',
                                borderBottom: `2px solid ${theme.color}`,
                                color: 'white',
                                fontSize: '2.2rem',
                                fontWeight: '900',
                                outline: 'none',
                                width: '250px'
                            }}
                        />
                    ) : (
                        <h2 style={{
                            margin: 0,
                            fontSize: '2.8rem',
                            fontWeight: '900',
                            letterSpacing: '-1.5px',
                            background: `linear-gradient(135deg, #fff 0%, ${theme.color} 100%)`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            textShadow: `0 10px 30px ${theme.color}33`,
                            lineHeight: 1
                        }}>
                            {profile.name}
                        </h2>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: `${theme.color}22`,
                            color: theme.color,
                            padding: '2px 10px',
                            borderRadius: '8px',
                            fontSize: '0.8rem',
                            fontWeight: 'bold',
                            border: `1px solid ${theme.color}44`
                        }}>
                            <Shield size={12} /> {levelInfo.name}
                        </div>
                        <span style={{ fontSize: '0.85rem', opacity: 0.6, fontWeight: '500' }}>{levelInfo.description.split('.')[0]}</span>
                    </div>
                </div>
                <div style={{
                    background: `linear-gradient(135deg, ${theme.color}, #fff)`,
                    color: '#000',
                    padding: '8px 20px',
                    borderRadius: '20px',
                    fontSize: '1.4rem',
                    fontWeight: '900',
                    boxShadow: `0 4px 20px ${theme.color}66`,
                    transform: 'rotate(2deg)'
                }}>
                    LV.{levelInfo.level}
                </div>
            </div>

            {/* Main Content: Character (Left) & Info Grid (Right) */}
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', zIndex: 1, minHeight: '300px' }}>
                {/* Character Area with Spacing */}
                <div style={{
                    position: 'relative',
                    width: '260px',
                    height: '320px',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    background: `radial-gradient(circle, ${theme.color}15 0%, transparent 70%)`,
                    borderRadius: '32px',
                    padding: '30px',
                    flexShrink: 0
                }}>
                    {/* Background Aura Layer */}
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '220px',
                        height: '220px',
                        background: `radial-gradient(circle, ${theme.color}22 0%, transparent 70%)`,
                        filter: 'blur(30px)',
                        zIndex: 0,
                        animation: 'aura-breathe 4s infinite ease-in-out'
                    }} />

                    <img
                        src={characterUrl}
                        alt={levelInfo.name}
                        style={{
                            width: 'auto',
                            height: '115%',
                            maxWidth: '160%',
                            objectFit: 'contain',
                            filter: `drop-shadow(0 0 30px ${theme.color}44)`,
                            zIndex: 1,
                            transform: 'translateY(-15px)',
                            transition: 'all 0.5s ease'
                        }}
                    />
                </div>

                {/* Info Grid Area (2x2) */}
                <div style={{
                    flex: 1,
                    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'
                }}>
                    <InfoItem icon={User} label="GENDER" value={profile.gender.toUpperCase()} field="gender" />
                    <InfoItem icon={Weight} label="WEIGHT" value={`${profile.weight}kg`} field="weight" />
                    <InfoItem icon={Ruler} label="HEIGHT" value={`${profile.height}cm`} field="height" />
                    <InfoItem icon={Award} label="ACHIEVEMENT" value={levelInfo.level >= 4 ? 'VETERAN' : 'BEGINNER'} />
                </div>
            </div>

            {/* Footer: Wide EXP Gauge */}
            <div style={{ width: '100%', zIndex: 1 }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.8rem',
                    marginBottom: '10px',
                    fontWeight: '800',
                    color: theme.color,
                    letterSpacing: '1px',
                    textTransform: 'uppercase'
                }}>
                    <span>Exp Points: {totalPoints.toLocaleString()}</span>
                    <span style={{ opacity: 0.8 }}>
                        {levelInfo.isBlockedByMarathon ? 'MARATHON CLEAR REQUIRED' : (levelInfo.nextLevelName === 'MAX' ? 'MAX LEVEL REACHED' : `${levelInfo.xpToNext.toLocaleString()} XP to Next`)}
                    </span>
                </div>
                <div style={{
                    height: '16px',
                    background: 'rgba(0,0,0,0.6)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.05)',
                    padding: '2px'
                }}>
                    <div style={{
                        width: `${levelInfo.progress}%`,
                        height: '100%',
                        background: `linear-gradient(90deg, ${theme.color}, #fff, ${theme.color})`,
                        backgroundSize: '200% 100%',
                        borderRadius: '6px',
                        boxShadow: `0 0 25px ${theme.color}aa`,
                        transition: 'width 2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        animation: 'gauge-shine 3s infinite linear'
                    }} />
                </div>
            </div>

            <style>{`
                @keyframes aura-breathe {
                    0%, 100% { opacity: 0.4; transform: translate(-50%, -50%) scale(1); }
                    50% { opacity: 0.7; transform: translate(-50%, -50%) scale(1.25); }
                }
                @keyframes gauge-shine {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>
        </div>
    );
};

export default CharacterLevelWidget;
