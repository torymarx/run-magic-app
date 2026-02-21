
import React from 'react';
import { User } from 'lucide-react';

interface CharacterLevelWidgetProps {
    totalPoints: number;
    calculateLevelInfo: (points: number) => any;
}

const CharacterLevelWidget: React.FC<CharacterLevelWidgetProps> = ({ totalPoints, calculateLevelInfo }) => {
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

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            padding: '1.5rem',
            background: 'rgba(255,255,255,0.02)',
            borderRadius: '20px',
            border: `1px solid ${theme.color}33`,
            boxShadow: `0 0 20px ${theme.color}11`,
            width: '200px'
        }}>
            {/* Character Avatar Box */}
            <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: theme.bg,
                border: `2px solid ${theme.color}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: `0 0 20px ${theme.color}22`
            }}>
                {/* Visual Effects Layer */}
                {levelInfo.level >= 2 && (
                    <div className={`effect-${theme.effect}`} style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        pointerEvents: 'none',
                        zIndex: 2
                    }} />
                )}

                {levelInfo.imageUrl ? (
                    <img
                        src={levelInfo.imageUrl}
                        alt={levelInfo.name}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            opacity: 0.9,
                            // Lv.3의 경우 복합 이미지이므로 중앙 마법사 부분 위주로 보여주기 위해 정렬 조정 (간이)
                            objectPosition: levelInfo.level === 3 ? 'center' : 'center'
                        }}
                    />
                ) : (
                    <User size={60} color={theme.color} style={{ opacity: 0.8 }} />
                )}

                {/* Level Badge */}
                <div style={{
                    position: 'absolute',
                    bottom: '5px',
                    right: '5px',
                    background: theme.color,
                    color: '#000',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.5)'
                }}>
                    Lv.{levelInfo.level}
                </div>
            </div>

            {/* Level Info Text */}
            <div style={{ textAlign: 'center' }}>
                <h4 style={{ margin: 0, fontSize: '1.2rem', color: theme.color, fontWeight: 'bold' }}>{levelInfo.name}</h4>
                <p style={{ margin: '4px 0 0', fontSize: '0.8rem', opacity: 0.6 }}>{levelInfo.description.split('.')[0]}</p>
            </div>

            {/* Experience Gauge */}
            <div style={{ width: '100%', position: 'relative' }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.7rem',
                    marginBottom: '4px',
                    opacity: 0.8
                }}>
                    <span>EXP {totalPoints}P</span>
                    <span>{levelInfo.nextLevelName === 'MAX' ? 'MAX' : `${levelInfo.xpToNext}P 남음`}</span>
                </div>
                <div style={{
                    height: '8px',
                    background: 'rgba(0,0,0,0.5)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <div style={{
                        width: `${levelInfo.progress}%`,
                        height: '100%',
                        background: `linear-gradient(90deg, ${theme.color}, #fff)`,
                        boxShadow: `0 0 10px ${theme.color}`,
                        transition: 'width 1s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }} />
                </div>
            </div>

            <style>{`
                .effect-pulse {
                    animation: pulse-glow 2s infinite;
                    border: 2px solid #00D1FF;
                    border-radius: 50%;
                }
                .effect-sparkle {
                    background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%);
                    animation: sparkle-move 3s infinite alternate;
                }
                .effect-aurora {
                    background: linear-gradient(135deg, #FFD700 0%, #00D1FF 50%, #BD00FF 100%);
                    opacity: 0.3;
                    filter: blur(10px);
                    animation: aurora-sweep 5s infinite linear;
                }
                
                @keyframes pulse-glow {
                    0% { transform: scale(1); opacity: 0.5; }
                    50% { transform: scale(1.1); opacity: 0.1; }
                    100% { transform: scale(1); opacity: 0.5; }
                }
                @keyframes sparkle-move {
                    from { transform: translateY(0) scale(1); }
                    to { transform: translateY(-10px) scale(1.2); }
                }
                @keyframes aurora-sweep {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default CharacterLevelWidget;
