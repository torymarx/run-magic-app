import React, { useState } from 'react';
import { Flame, Zap, Mountain, Trophy, Target, Star, Heart, Cloud, Sun, Moon, Layers, Activity, Calendar, Coffee, Ghost, Smile, Palette, Lock, Info, Award, Crown, Medal, Wind, Umbrella, Timer } from 'lucide-react';

interface BadgeHallOfFameProps {
    unlockedBadges: string[];
    unlockedMedals: string[];
}

const BadgeHallOfFame: React.FC<BadgeHallOfFameProps> = ({ unlockedBadges, unlockedMedals }) => {
    // Rarity Colors
    const RARITY = {
        COMMON: '#8C8C8C',
        UNCOMMON: '#00FF85', // Neon Green
        RARE: '#00D1FF',     // Electric Blue
        EPIC: '#BD00FF',     // Vivid Purple
        LEGENDARY: '#FFD700' // Gold
    };

    const allItems = [
        // Trophies - Achievements based on milestones
        { id: 'streak3', name: '열정의 불꽃', icon: <Flame size={18} />, description: '3일 연속 질주 성공', rarity: 'UNCOMMON', type: 'trophy', date: '2026.02.14' },
        { id: 'streak7', name: '시냅스 루틴', icon: <Heart size={18} />, description: '7일 연속 러닝 달성', rarity: 'RARE', type: 'trophy', date: '2026.02.10' },
        { id: 'streak14', name: '습관의 완성', icon: <Calendar size={18} />, description: '14일 연속 질주 성공', rarity: 'RARE', type: 'trophy', date: '-' },
        { id: 'streak30', name: '강철의 의지', icon: <Layers size={18} />, description: '30일 연속 질주 성공', rarity: 'EPIC', type: 'trophy', date: '-' },

        { id: 'everest', name: '퀀텀 하이커', icon: <Mountain size={18} />, description: '누적 8.8km 돌파', rarity: 'RARE', type: 'trophy', date: '2026.01.25' },
        { id: 'dist100', name: '실버 오디세이', icon: <Award size={18} />, description: '누적 100km 돌파', rarity: 'RARE', type: 'trophy', date: '-' },
        { id: 'dist500', name: '골든 트레일', icon: <Trophy size={18} />, description: '누적 500km 돌파', rarity: 'EPIC', type: 'trophy', date: '-' },
        { id: 'dist1000', name: '플래티넘 로드', icon: <Crown size={18} />, description: '누적 1,000km 돌파', rarity: 'LEGENDARY', type: 'trophy', date: '-' },
        { id: 'dist3000', name: '신화의 영역', icon: <Star size={18} />, description: '누적 3,000km 돌파', rarity: 'LEGENDARY', type: 'trophy', date: '-' },

        { id: 'improved', name: '리미트 브레이커', icon: <Zap size={18} />, description: '최고 기록 경신', rarity: 'RARE', type: 'trophy', date: '2026.02.15' },
        { id: 'cloud_runner', name: '클라우드 러너', icon: <Cloud size={18} />, description: '데이터 백업 완료', rarity: 'COMMON', type: 'trophy', date: '2026.02.16' },

        // Medals - Skills and specific challenges
        { id: 'morning_aura', name: '모닝 아우라', icon: <Sun size={20} />, description: '오전 8시 이전 5회', rarity: 'UNCOMMON', type: 'medal', date: '2026.02.11' },
        { id: 'dawn_eye', name: '새벽의 눈동자', icon: <Timer size={20} />, description: '오전 5시 이전 1회 성공', rarity: 'RARE', type: 'medal', date: '-' },
        { id: 'midnight_neon', name: '미드나잇 네온', icon: <Moon size={20} />, description: '밤 10시 이후 5회', rarity: 'RARE', type: 'medal', date: '-' },

        { id: 'sub5', name: '실버 불렛', icon: <Activity size={20} />, description: '페이스 4분대 진입', rarity: 'RARE', type: 'medal', date: '-' },
        { id: 'sub4', name: '골든 소닉', icon: <Zap size={20} />, description: '페이스 3분대 진입', rarity: 'EPIC', type: 'medal', date: '-' },

        { id: '10k', name: '10K 챔피언', icon: <Trophy size={20} />, description: '10km 완주 성공', rarity: 'UNCOMMON', type: 'medal', date: '2026.02.12' },
        { id: 'half_marathon', name: '하프 마스터', icon: <Medal size={20} />, description: '하프 코스(21.1km) 완주', rarity: 'EPIC', type: 'medal', date: '-' },
        { id: 'marathoner', name: '티타늄 엔듀런스', icon: <Target size={20} />, description: '풀 코스(42.195km) 완주', rarity: 'LEGENDARY', type: 'medal', date: '2026.02.01' },
        { id: 'marathon_3', name: '트리플 크라운', icon: <Crown size={20} />, description: '풀 코스 3회 완주', rarity: 'LEGENDARY', type: 'medal', date: '-' },
        { id: 'iron_will', name: '철인 런너', icon: <Trophy size={20} />, description: '풀 코스 10회 완주', rarity: 'LEGENDARY', type: 'medal', date: '-' },

        { id: 'steady_stream', name: '스테디 스트림', icon: <Wind size={20} />, description: '페이스 편차 10초↓', rarity: 'RARE', type: 'medal', date: '2026.02.08' },
        { id: 'triple_target', name: '정밀 저격수', icon: <Target size={20} />, description: '목표 페이스 3회 연속 일치', rarity: 'EPIC', type: 'medal', date: '-' },

        { id: 'rain_master', name: '수중전의 대가', icon: <Umbrella size={20} />, description: '우중 질주 기록 등록', rarity: 'UNCOMMON', type: 'medal', date: '-' },
        { id: 'total100', name: '백전노장', icon: <Activity size={20} />, description: '누적 100회 질주 달성', rarity: 'EPIC', type: 'medal', date: '-' },

        { id: 'calorie_architect', name: '칼로리 아키텍트', icon: <Coffee size={20} />, description: '단일 세션 500kcal 소모', rarity: 'UNCOMMON', type: 'medal', date: '2026.02.05' },
        { id: 'shadow_runner', name: '섀도우 러너', icon: <Ghost size={20} />, description: '복귀 러닝 성공', rarity: 'EPIC', type: 'medal', date: '2026.01.15' },
        { id: 'generous_heart', name: '제너러스 하트', icon: <Smile size={20} />, description: 'Wellness 코치 5회', rarity: 'UNCOMMON', type: 'medal', date: '2026.02.14' },
        { id: 'rainbow_collector', name: '레인보우 컬렉터', icon: <Palette size={20} />, description: '모든 코치와 러닝', rarity: 'LEGENDARY', type: 'medal', date: '-' },
    ];

    // Rarity Rank for Sorting
    const RARITY_RANK = {
        LEGENDARY: 5,
        EPIC: 4,
        RARE: 3,
        UNCOMMON: 2,
        COMMON: 1
    };

    // Sort items by Rarity (High -> Low), then by ID
    const sortedItems = [...allItems].sort((a, b) => {
        const rankA = RARITY_RANK[a.rarity as keyof typeof RARITY_RANK];
        const rankB = RARITY_RANK[b.rarity as keyof typeof RARITY_RANK];
        if (rankA !== rankB) return rankB - rankA; // Descending
        return a.id.localeCompare(b.id);
    });

    // State for auto-scrolling & Info Panel
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);
    const [hoveredItem, setHoveredItem] = useState<any>(null);

    // Robust Auto-Scroll Implementation
    const animationFrameId = React.useRef<number | null>(null);
    const mouseXRef = React.useRef<number | null>(null);
    const isHoveringContainer = React.useRef(false);

    React.useEffect(() => {
        const scrollLoop = () => {
            if (!isHoveringContainer.current || !scrollContainerRef.current || mouseXRef.current === null) {
                animationFrameId.current = requestAnimationFrame(scrollLoop);
                return;
            }

            const container = scrollContainerRef.current;
            const { left, width } = container.getBoundingClientRect();
            const relativeX = mouseXRef.current - left;

            // Edge Threshold: 80px (approx 1 medal size + padding) - Wide enough for easy detection
            const edgeThreshold = 80;
            const maxScrollSpeed = 12; // Speed for fluid movement

            if (relativeX < edgeThreshold) {
                // Scroll Left (closer to edge = faster)
                const intensity = (edgeThreshold - relativeX) / edgeThreshold;
                container.scrollLeft -= maxScrollSpeed * intensity;
            } else if (relativeX > width - edgeThreshold) {
                // Scroll Right
                const intensity = (relativeX - (width - edgeThreshold)) / edgeThreshold;
                container.scrollLeft += maxScrollSpeed * intensity;
            }

            animationFrameId.current = requestAnimationFrame(scrollLoop);
        };

        animationFrameId.current = requestAnimationFrame(scrollLoop);
        return () => {
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        };
    }, []);

    const InventorySlot = ({ item, isUnlocked }: any) => {
        const color = RARITY[item.rarity as keyof typeof RARITY];
        // Highlight if this item is currently displayed in Info Panel
        const isSelected = hoveredItem?.id === item.id;

        return (
            <div
                className="inventory-slot"
                onMouseEnter={() => setHoveredItem({ ...item, isUnlocked })}
                style={{
                    position: 'relative',
                    minWidth: '60px',
                    width: '60px',
                    height: '60px',
                    background: isUnlocked
                        ? `radial-gradient(circle at center, ${color}22 0%, rgba(20,20,25,0.8) 100%)`
                        : 'rgba(255,255,255,0.03)',
                    border: isUnlocked
                        ? `1px solid ${isSelected ? color : `${color}66`}` // Brighter border if selected
                        : '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: isUnlocked && isSelected ? `0 0 20px ${color}66` : (isUnlocked ? `0 0 10px ${color}22` : 'none'),
                    transform: isSelected ? 'scale(1.15) translateY(-5px)' : 'scale(1)',
                    zIndex: isSelected ? 10 : 1,
                    flexShrink: 0
                }}
            >
                <div style={{
                    color: isUnlocked ? color : 'rgba(255,255,255,0.1)',
                    filter: isUnlocked ? `drop-shadow(0 0 5px ${color})` : 'none',
                    opacity: isUnlocked ? 1 : 0.4,
                    transition: 'all 0.2s'
                }}>
                    {item.icon}
                </div>

                {/* Micro Rarity Indicator */}
                {isUnlocked && (
                    <div style={{
                        position: 'absolute',
                        bottom: '5px',
                        right: '5px',
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: color,
                        boxShadow: `0 0 5px ${color}`
                    }} />
                )}
            </div>
        );
    };

    return (
        <div className="glass-card" style={{
            padding: '1.5rem',
            marginBottom: '1.5rem',
            background: 'linear-gradient(180deg, rgba(20, 20, 30, 0.6) 0%, rgba(10, 10, 15, 0.9) 100%)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
        }}>
            {/* Header */}
            <h3 className="neon-text-blue" style={{
                margin: 0,
                fontSize: '1.1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
                letterSpacing: '0.5px'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px',
                    background: 'rgba(0, 209, 255, 0.1)',
                    borderRadius: '8px',
                    border: '1px solid rgba(0, 209, 255, 0.3)'
                }}>
                    <Trophy size={18} color="#00D1FF" />
                </div>
                컬렉션 인벤토리
                <span style={{
                    fontSize: '0.8rem',
                    background: 'rgba(255,255,255,0.05)',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    color: 'rgba(255,255,255,0.6)',
                    border: '1px solid rgba(255,255,255,0.1)'
                }}>
                    {unlockedBadges.length + unlockedMedals.length} / {allItems.length}
                </span>
            </h3>

            {/* Scrollable Container with Edge Detection */}
            <div
                ref={scrollContainerRef}
                className="custom-scrollbar"
                onMouseEnter={() => { isHoveringContainer.current = true; }}
                onMouseLeave={() => { isHoveringContainer.current = false; mouseXRef.current = null; }}
                onMouseMove={(e) => { mouseXRef.current = e.clientX; }}
                style={{
                    display: 'flex',
                    gap: '1rem',
                    overflowX: 'auto',
                    paddingBottom: '0.5rem',
                    paddingTop: '0.5rem',
                    maskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)', // Fade both sides
                    WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
                    cursor: 'grab' // Indicate draggable/scrollable
                }}
            >
                {/* Spacer at start for fade effect */}
                <div style={{ minWidth: '10px' }} />

                {sortedItems.map((item, idx) => (
                    <InventorySlot
                        key={idx}
                        item={item}
                        isUnlocked={item.type === 'trophy' ? unlockedBadges.includes(item.id) : unlockedMedals.includes(item.id)}
                    />
                ))}

                {/* Spacer at end for fade effect */}
                <div style={{ minWidth: '10px' }} />
            </div>

            {/* Info Panel (Fixed Bottom Section) - Solves tooltip clipping & disappearance */}
            <div style={{
                height: '70px',
                background: 'rgba(0,0,0,0.4)',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 2rem',
                opacity: hoveredItem ? 1 : 0.7,
                transition: 'all 0.3s',
                gap: '1.5rem',
                boxShadow: 'inset 0 0 30px rgba(0,0,0,0.6)',
                position: 'relative'
            }}>
                {hoveredItem ? (
                    <>
                        {/* Selected Item Icon (Large) */}
                        <div style={{
                            width: '46px',
                            height: '46px',
                            minWidth: '46px',
                            borderRadius: '50%',
                            background: hoveredItem.isUnlocked ? `${RARITY[hoveredItem.rarity as keyof typeof RARITY]}22` : 'rgba(255,255,255,0.02)',
                            border: `2px solid ${hoveredItem.isUnlocked ? RARITY[hoveredItem.rarity as keyof typeof RARITY] : 'rgba(255,255,255,0.1)'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: hoveredItem.isUnlocked ? RARITY[hoveredItem.rarity as keyof typeof RARITY] : 'rgba(255,255,255,0.2)',
                            boxShadow: hoveredItem.isUnlocked ? `0 0 15px ${RARITY[hoveredItem.rarity as keyof typeof RARITY]}44` : 'none',
                            animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                        }}>
                            {hoveredItem.icon}
                        </div>

                        {/* Info Text */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'center', justifyContent: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                <span style={{
                                    fontSize: '1rem',
                                    fontWeight: 'bold',
                                    color: hoveredItem.isUnlocked ? '#fff' : 'rgba(255,255,255,0.3)',
                                    textShadow: hoveredItem.isUnlocked ? `0 0 10px ${RARITY[hoveredItem.rarity as keyof typeof RARITY]}44` : 'none'
                                }}>
                                    {hoveredItem.name} {!hoveredItem.isUnlocked && <Lock size={12} style={{ verticalAlign: 'middle', marginLeft: '4px' }} />}
                                </span>
                                <span style={{
                                    fontSize: '0.65rem',
                                    padding: '2px 8px',
                                    borderRadius: '12px',
                                    background: hoveredItem.isUnlocked ? RARITY[hoveredItem.rarity as keyof typeof RARITY] + '33' : 'rgba(255,255,255,0.05)',
                                    color: hoveredItem.isUnlocked ? RARITY[hoveredItem.rarity as keyof typeof RARITY] : 'rgba(255,255,255,0.2)',
                                    border: `1px solid ${hoveredItem.isUnlocked ? RARITY[hoveredItem.rarity as keyof typeof RARITY] + '44' : 'rgba(255,255,255,0.1)'}`,
                                    fontWeight: 'bold'
                                }}>
                                    {hoveredItem.rarity}
                                </span>
                            </div>
                            <span style={{ fontSize: '0.85rem', color: hoveredItem.isUnlocked ? 'rgba(255,255,255,0.6)' : 'rgba(0, 209, 255, 0.5)', fontWeight: hoveredItem.isUnlocked ? 'normal' : 'bold' }}>
                                {hoveredItem.isUnlocked ? hoveredItem.description : `🛑 미션: ${hoveredItem.description}`}
                            </span>
                        </div>

                        {/* Date (Absolute to keep center balance) */}
                        {hoveredItem.isUnlocked && (
                            <div style={{ position: 'absolute', right: '1.5rem', textAlign: 'right', fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>
                                Unlocked<br />
                                <span style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 'bold' }}>{hoveredItem.date}</span>
                            </div>
                        )}
                    </>
                ) : (
                    <div style={{
                        width: '100%',
                        textAlign: 'center',
                        fontSize: '0.9rem',
                        color: 'rgba(255,255,255,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                    }}>
                        <Info size={16} />
                        <span>아이템에 마우스를 올려 상세 정보를 확인하세요</span>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes popIn {
                    from { transform: scale(0.5); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                
                /* Custom Thin Scrollbar */
                .custom-scrollbar::-webkit-scrollbar {
                    height: 4px; /* Thinner */
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent; 
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 2px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.3);
                }
            `}</style>
        </div>
    );
};

export default BadgeHallOfFame;
