
import { getCharacterImageUrl } from '../../data/progression';

interface CharacterLevelWidgetProps {
    totalPoints: number;
    calculateLevelInfo: (points: number) => any;
    gender?: string;
}

const CharacterLevelWidget: React.FC<CharacterLevelWidgetProps> = ({
    totalPoints, calculateLevelInfo, gender = 'male'
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
    const characterUrl = getCharacterImageUrl(levelInfo.level, gender);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.2rem',
            padding: '2rem 1.5rem',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.2) 100%)',
            borderRadius: '24px',
            border: `1px solid ${theme.color}44`,
            boxShadow: `0 10px 40px rgba(0,0,0,0.3), 0 0 20px ${theme.color}11`,
            width: '240px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Aura Layer */}
            <div style={{
                position: 'absolute',
                top: '10%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '180px',
                height: '180px',
                background: `radial-gradient(circle, ${theme.color}33 0%, transparent 70%)`,
                filter: 'blur(30px)',
                zIndex: 0,
                animation: 'aura-breathe 4s infinite ease-in-out'
            }} />

            {/* Character Display Area (No Circle) */}
            <div style={{
                width: '180px',
                height: '240px',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                position: 'relative',
                zIndex: 1,
                marginBottom: '0.5rem'
            }}>
                {/* Visual Effects Layer */}
                {levelInfo.level >= 2 && (
                    <div className={`effect-${theme.effect}`} style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        pointerEvents: 'none',
                        zIndex: 2,
                        filter: 'brightness(1.5)'
                    }} />
                )}

                <img
                    src={characterUrl}
                    alt={levelInfo.name}
                    style={{
                        width: 'auto',
                        height: '100%',
                        maxWidth: '140%',
                        objectFit: 'contain',
                        opacity: 1,
                        filter: `drop-shadow(0 0 15px ${theme.color}44)`,
                        transition: 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        transform: 'scale(1.1) translateY(-10px)'
                    }}
                    className="character-img-hover"
                    onError={(e) => {
                        (e.target as HTMLImageElement).style.opacity = '0';
                    }}
                />

                {/* Level Badge - Floating */}
                <div style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '-10px',
                    background: `linear-gradient(135deg, ${theme.color}, #fff)`,
                    color: '#000',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '0.9rem',
                    fontWeight: '900',
                    boxShadow: `0 4px 15px ${theme.color}66`,
                    zIndex: 10,
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                }}>
                    {levelInfo.level === 5 ? 'GRAND MASTER' : `LV.${levelInfo.level}`}
                </div>
            </div>

            {/* Level Info Text */}
            <div style={{ textAlign: 'center', zIndex: 1 }}>
                <h4 style={{
                    margin: 0,
                    fontSize: '1.4rem',
                    color: theme.color,
                    fontWeight: 'bold',
                    textShadow: `0 0 10px ${theme.color}66`,
                    letterSpacing: '-0.5px'
                }}>
                    {levelInfo.name}
                </h4>
                <p style={{
                    margin: '6px 0 0',
                    fontSize: '0.85rem',
                    opacity: 0.7,
                    lineHeight: '1.4',
                    color: '#fff'
                }}>
                    {levelInfo.description.split('.')[0]}
                </p>
            </div>

            {/* Experience Gauge */}
            <div style={{ width: '100%', position: 'relative', zIndex: 1, marginTop: '0.5rem' }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.75rem',
                    marginBottom: '6px',
                    fontWeight: 'bold',
                    color: theme.color
                }}>
                    <span style={{ opacity: 0.9 }}>XP {totalPoints.toLocaleString()}P</span>
                    <span style={{ opacity: 0.7 }}>
                        {levelInfo.isBlockedByMarathon ? '마라톤 완주 필요' : (levelInfo.nextLevelName === 'MAX' ? 'MAX' : `${levelInfo.xpToNext.toLocaleString()}P Left`)}
                    </span>
                </div>
                <div style={{
                    height: '10px',
                    background: 'rgba(0,0,0,0.6)',
                    borderRadius: '5px',
                    overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.05)',
                    padding: '1px'
                }}>
                    <div style={{
                        width: `${levelInfo.progress}%`,
                        height: '100%',
                        background: `linear-gradient(90deg, ${theme.color}, #fff)`,
                        borderRadius: '4px',
                        boxShadow: `0 0 15px ${theme.color}aa`,
                        transition: 'width 1.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }} />
                </div>
            </div>

            <style>{`
                .character-img-hover:hover {
                    transform: scale(1.2) translateY(-20px) !important;
                }
                @keyframes aura-breathe {
                    0%, 100% { opacity: 0.5; transform: translateX(-50%) scale(1); }
                    50% { opacity: 0.8; transform: translateX(-50%) scale(1.2); }
                }
                .effect-pulse {
                    animation: pulse-glow 2s infinite;
                    border: 2px solid #00D1FF;
                    border-radius: 12px;
                }
                .effect-sparkle {
                    background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
                    animation: sparkle-move 3s infinite alternate;
                }
                .effect-aurora {
                    background: linear-gradient(135deg, #FFD700 0%, #00D1FF 50%, #BD00FF 100%);
                    opacity: 0.2;
                    filter: blur(15px);
                    animation: aurora-sweep 8s infinite linear;
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
