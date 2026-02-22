import React from 'react';
import { User, Weight, Ruler, Shield, Target, Zap, Heart, Sword } from 'lucide-react';

interface CharacterLevelWidgetProps {
    totalPoints: number;
    calculateLevelInfo: (points: number) => any;
    profile: any;
    isEditing?: boolean;
    onEditChange?: (field: string, value: any) => void;
}

const CharacterLevelWidget: React.FC<CharacterLevelWidgetProps> = ({
    totalPoints,
    calculateLevelInfo,
    profile,
    isEditing,
    onEditChange
}) => {
    const levelInfo = calculateLevelInfo(totalPoints);
    const theme = levelInfo.theme;
    const progress = (levelInfo.currentLevelPoints / levelInfo.pointsToNextLevel) * 100;

    // v21.2: 능력치 계산 로직 (임시 시각화용)
    const stats = {
        stamina: Math.min(100, 20 + (levelInfo.level * 15) + (totalPoints / 200)),
        speed: Math.min(100, 30 + (levelInfo.level * 10)),
        willpower: 85 // 나중에 연속 일수 등으로 연동 가능
    };

    const characterUrl = `/characters/char_${profile.characterId}_lv${levelInfo.level}.png`;

    // Internal Components for cleaner structure
    const StatBar = ({ label, value, icon: Icon, color }: any) => (
        <div style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 'bold', color: 'rgba(255,255,255,0.6)' }}>
                    <Icon size={12} color={color} />
                    <span style={{ letterSpacing: '1px' }}>{label}</span>
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: '900', color: color }}>{Math.round(value)}%</span>
            </div>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{
                    height: '100%',
                    width: `${value}%`,
                    background: `linear-gradient(90deg, ${color}66, ${color})`,
                    boxShadow: `0 0 10px ${color}44`,
                    borderRadius: '3px',
                    transition: 'width 1s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }} />
            </div>
        </div>
    );

    const SpecChip = ({ icon: Icon, value, label, field }: any) => (
        <div
            onClick={() => isEditing && field === 'gender' && onEditChange?.('gender', profile.gender === 'male' ? 'female' : 'male')}
            style={{
                background: 'rgba(255,255,255,0.03)',
                padding: '6px 12px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: isEditing && field === 'gender' ? 'pointer' : 'default',
                transition: 'all 0.2s'
            }}
            className={isEditing && field === 'gender' ? 'hover-glow' : ''}
        >
            <Icon size={12} style={{ opacity: 0.5 }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.6rem', opacity: 0.4, lineHeight: 1 }}>{label}</span>
                {isEditing && (field === 'weight' || field === 'height') ? (
                    <input
                        type="number"
                        step="0.1"
                        value={field === 'weight' ? profile.weight : profile.height}
                        onChange={(e) => onEditChange?.(field, parseFloat(e.target.value) || 0)}
                        className="minimal-input"
                        style={{
                            background: 'none', border: 'none', color: 'white', fontSize: '0.85rem', fontWeight: 'bold', width: '50px', outline: 'none', padding: 0
                        }}
                    />
                ) : (
                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'white' }}>{value}</span>
                )}
            </div>
        </div>
    );

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            padding: '2.2rem',
            background: 'linear-gradient(165deg, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0.6) 100%)',
            borderRadius: '36px',
            border: `1px solid ${theme.color}44`,
            boxShadow: `0 30px 60px rgba(0,0,0,0.6), inset 0 0 40px ${theme.color}11`,
            width: '100%',
            maxWidth: '680px',
            position: 'relative',
            overflow: 'hidden',
            margin: '0 auto',
            backdropFilter: 'blur(20px)'
        }}>
            {/* Background Decorative Layer */}
            <div style={{
                position: 'absolute', top: '-10%', right: '-10%', width: '300px', height: '300px',
                background: `radial-gradient(circle, ${theme.color}11 0%, transparent 70%)`,
                filter: 'blur(50px)', pointerEvents: 'none'
            }} />

            {/* Header: Name & Identity */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 2 }}>
                <div>
                    {isEditing ? (
                        <input
                            type="text"
                            value={profile.name}
                            onChange={(e) => onEditChange?.('name', e.target.value)}
                            className="neon-input"
                            style={{
                                background: 'none', border: 'none', borderBottom: `2px solid ${theme.color}`,
                                color: 'white', fontSize: '2.4rem', fontWeight: '900', outline: 'none', width: '280px'
                            }}
                        />
                    ) : (
                        <h2 style={{
                            margin: 0, fontSize: '2.8rem', fontWeight: '900', letterSpacing: '-1.5px',
                            background: `linear-gradient(135deg, #fff 0%, ${theme.color} 100%)`,
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                            textShadow: `0 10px 30px ${theme.color}44`, lineHeight: 1
                        }}>
                            {profile.name}
                        </h2>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                        <span style={{
                            padding: '4px 12px', background: `${theme.color}22`, color: theme.color,
                            borderRadius: '20px', fontSize: '0.75rem', fontWeight: '900', letterSpacing: '1px',
                            border: `1px solid ${theme.color}44`
                        }}>
                            {levelInfo.title || 'ELITE RUNNER'}
                        </span>
                        <div style={{ height: '4px', width: '4px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />
                        <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold' }}>Lv.{levelInfo.level} {levelInfo.name}</span>
                    </div>
                </div>

                {/* Level Badge Shield */}
                <div style={{ textAlign: 'right', position: 'relative' }}>
                    <div style={{
                        width: '60px', height: '60px', borderRadius: '18px',
                        background: `linear-gradient(135deg, ${theme.color}, ${theme.color}aa)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: `0 10px 20px ${theme.color}44`, border: '1px solid rgba(255,255,255,0.3)',
                        position: 'relative', zIndex: 1
                    }}>
                        <Shield size={32} color="white" />
                        <span style={{ position: 'absolute', fontSize: '1.2rem', fontWeight: '900', color: 'white' }}>{levelInfo.level}</span>
                    </div>
                </div>
            </div>

            {/* Main Content: Character (Left) & Status Dashboard (Right) */}
            <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center', zIndex: 2, minHeight: '320px' }}>

                {/* Character Area */}
                <div style={{ position: 'relative', width: '240px', height: '320px', flexShrink: 0 }}>
                    <div className="aura-effect" style={{
                        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        width: '280px', height: '280px', borderRadius: '50%',
                        background: `radial-gradient(circle, ${theme.color}44 0%, transparent 70%)`,
                        animation: 'pulse 3s infinite', opacity: 0.6, zIndex: 0
                    }} />
                    <img
                        src={characterUrl}
                        alt={levelInfo.name}
                        style={{
                            width: '100%', height: '110%', objectFit: 'contain',
                            filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.8))',
                            position: 'relative', zIndex: 1, marginTop: '-20px'
                        }}
                    />
                </div>

                {/* Status Dashboard Area (AL-CHA-GE!) */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    {/* Physical Specs (Horizontal Chips) */}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <SpecChip icon={User} label="GENDER" value={profile.gender?.toUpperCase()} field="gender" />
                        <SpecChip icon={Weight} label="WEIGHT" value={`${profile.weight}kg`} field="weight" />
                        <SpecChip icon={Ruler} label="HEIGHT" value={`${profile.height}cm`} field="height" />
                    </div>

                    {/* Attributes Section */}
                    <div style={{
                        background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '24px',
                        border: '1px solid rgba(255,255,255,0.03)', boxShadow: 'inset 0 4px 20px rgba(0,0,0,0.4)'
                    }}>
                        <h4 style={{ margin: '0 0 15px 0', fontSize: '0.9rem', color: theme.color, fontWeight: '900', letterSpacing: '2px' }}>CORE ATTRIBUTES</h4>
                        <StatBar label="STAMINA" value={stats.stamina} icon={Heart} color="#FF4B4B" />
                        <StatBar label="SPEED" value={stats.speed} icon={Zap} color="#FFD700" />
                        <StatBar label="WILLPOWER" value={stats.willpower} icon={Sword} color="#00D1FF" />
                    </div>

                    {/* Runner's Ambition (Goal) */}
                    <div style={{ padding: '0 10px' }}>
                        <div style={{ fontSize: '0.65rem', opacity: 0.4, letterSpacing: '1px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Target size={10} color={theme.color} /> RUNNER'S AMBITION
                        </div>
                        {isEditing ? (
                            <textarea
                                value={profile.goal}
                                onChange={(e) => onEditChange?.('goal', e.target.value)}
                                style={{
                                    width: '100%', background: 'rgba(255,255,255,0.05)', border: 'none',
                                    borderRadius: '12px', color: 'white', padding: '10px', fontSize: '0.9rem',
                                    outline: 'none', borderBottom: `1px solid ${theme.color}44`, height: '60px', resize: 'none'
                                }}
                                placeholder="당신의 질주 목표를 입력하세요..."
                            />
                        ) : (
                            <p style={{
                                margin: 0, fontSize: '1rem', color: 'rgba(255,255,255,0.9)',
                                fontStyle: 'italic', fontWeight: '500', lineHeight: 1.4,
                                textShadow: '0 2px 10px rgba(0,0,0,0.5)'
                            }}>
                                "{profile.goal || 'No goal set... Start running now!'}"
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* EXP Gauge Footer */}
            <div style={{ marginTop: '0.5rem', zIndex: 2 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '8px', fontWeight: 'bold' }}>
                    <span style={{ color: 'rgba(255,255,255,0.4)' }}>EXP PROGRESS</span>
                    <span style={{ color: theme.color }}>{Math.round(progress)}%</span>
                </div>
                <div style={{ height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '5px', overflow: 'hidden', padding: '2px' }}>
                    <div style={{
                        height: '100%',
                        width: `${progress}%`,
                        background: `linear-gradient(90deg, ${theme.color}88, ${theme.color}, #fff)`,
                        boxShadow: `0 0 20px ${theme.color}66`,
                        borderRadius: '3px',
                        transition: 'width 1.2s cubic-bezier(0.22, 1, 0.36, 1)'
                    }} />
                </div>
                <div style={{ marginTop: '6px', fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>
                    {levelInfo.pointsToNextLevel - levelInfo.currentLevelPoints} PTS TO LEVEL UP
                </div>
            </div>
        </div>
    );
};

export default CharacterLevelWidget;
