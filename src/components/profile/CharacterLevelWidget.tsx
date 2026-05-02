import React from 'react';
import { User, Weight, Ruler, Zap, Heart, Sword } from 'lucide-react';

interface CharacterLevelWidgetProps {
    totalPoints: number;
    calculateLevelInfo: (points: number) => any;
    profile: any;
    isEditing?: boolean;
    onEditChange?: (field: string, value: any) => void;
}

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
                background: color,
                borderRadius: '3px',
                transition: 'width 1s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }} />
        </div>
    </div>
);

const SpecChip = ({ icon: Icon, value, label, field, isEditing, profile, onEditChange }: any) => {
    const isNumericField = field === 'weight' || field === 'height';

    return (
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
        >
            <Icon size={12} style={{ opacity: 0.4 }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.6rem', opacity: 0.3 }}>{label}</span>
                {isEditing && isNumericField ? (
                    <input
                        type="text"
                        inputMode="decimal"
                        value={field === 'weight' ? profile.weight : profile.height}
                        onChange={(e) => onEditChange?.(field, e.target.value)}
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
};

const CharacterLevelWidget: React.FC<CharacterLevelWidgetProps> = ({
    totalPoints,
    calculateLevelInfo,
    profile,
    isEditing,
    onEditChange
}) => {
    const levelInfo = calculateLevelInfo(totalPoints);
    const progress = (levelInfo.currentLevelPoints / levelInfo.pointsToNextLevel) * 100;

    const stats = {
        stamina: Math.min(100, 20 + (levelInfo.level * 15) + (totalPoints / 200)),
        speed: Math.min(100, 30 + (levelInfo.level * 10)),
        willpower: 85
    };

    return (
        <div
            className="profile-glass-card"
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem',
                padding: '2rem',
                background: 'rgba(20, 20, 20, 0.4)',
                borderRadius: '32px',
                border: '1px solid rgba(255,255,255,0.06)',
                width: '100%',
                maxWidth: '800px',
                position: 'relative',
                margin: '0 auto',
                backdropFilter: 'blur(30px)'
            }}
        >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    {isEditing ? (
                        <input
                            type="text"
                            value={profile.name}
                            onChange={(e) => onEditChange?.('name', e.target.value)}
                            style={{
                                background: 'none', border: 'none', borderBottom: '1px solid white',
                                color: 'white', fontSize: '1.8rem', fontWeight: '200', outline: 'none'
                            }}
                        />
                    ) : (
                        <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: '200', color: 'white' }}>{profile.name}</h2>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', opacity: 0.3 }}>
                        <span style={{ fontSize: '0.8rem' }}>{levelInfo.title}</span>
                        <div style={{ height: '3px', width: '3px', borderRadius: '50%', background: 'white' }} />
                        <span style={{ fontSize: '0.8rem' }}>LEVEL {levelInfo.level}</span>
                    </div>
                </div>

                <div style={{ 
                    width: '80px', height: '80px', borderRadius: '50%', 
                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <User size={40} strokeWidth={0.5} color="rgba(255,255,255,0.2)" />
                </div>
            </div>

            {/* Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                    <SpecChip icon={User} label="GENDER" value={profile.gender?.toUpperCase()} field="gender" isEditing={isEditing} profile={profile} onEditChange={onEditChange} />
                    <SpecChip icon={Weight} label="WEIGHT" value={`${profile.weight} KG`} field="weight" isEditing={isEditing} profile={profile} onEditChange={onEditChange} />
                    <SpecChip icon={Ruler} label="HEIGHT" value={`${profile.height} CM`} field="height" isEditing={isEditing} profile={profile} onEditChange={onEditChange} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <StatBar label="STAMINA" value={stats.stamina} icon={Heart} color="white" />
                    <StatBar label="SPEED" value={stats.speed} icon={Zap} color="white" />
                    <StatBar label="WILLPOWER" value={stats.willpower} icon={Sword} color="white" />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <div style={{ fontSize: '0.65rem', opacity: 0.2, letterSpacing: '1px', marginBottom: '8px' }}>AMBITION</div>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', fontWeight: '300' }}>
                            "{profile.goal || 'Run for the better life.'}"
                        </p>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.65rem', opacity: 0.2, letterSpacing: '1px', marginBottom: '8px' }}>LOCATION</div>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', fontWeight: '300' }}>
                            {profile.locationCity || 'Location not set.'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div style={{ marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '10px', opacity: 0.3 }}>
                    <span>PROGRESS</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <div style={{ height: '2px', background: 'rgba(255,255,255,0.05)', borderRadius: '1px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${progress}%`, background: 'white' }} />
                </div>
            </div>
        </div>
    );
};

export default CharacterLevelWidget;
