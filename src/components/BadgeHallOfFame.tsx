import React, { useState } from 'react';
import {
    Flame, Zap, Mountain, Star, Sun, Moon, Layers, Activity,
    Crown, Medal, Wind, Timer, Trophy, Lock, Info,
    Sprout, Shield, BookOpen, Compass, FlaskConical, Bird, Hourglass, FastForward, Map, MapPin,
    Beaker, Dices, Gem, Globe, Settings, Aperture, Flower, Dog, CloudLightning, Train, Box,
    Clock, Hammer, Castle, SunMedium, Waves, Footprints, Watch, BatteryCharging, Infinity,
    Gift, Sword, Wand2, Library, Rocket
} from 'lucide-react';
import { MEDAL_DATA } from '../data/medals';

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

    // v15.0: 아이콘 타입 매핑 테이블
    const ICON_MAP: { [key: string]: React.ReactNode } = {
        Shield: <Shield size={20} />,
        Sprout: <Sprout size={20} />,
        Zap: <Zap size={20} />,
        Sun: <Sun size={20} />,
        Moon: <Moon size={20} />,
        Flame: <Flame size={20} />,
        Activity: <Activity size={20} />,
        BookOpen: <BookOpen size={20} />,
        Compass: <Compass size={20} />,
        FlaskConical: <FlaskConical size={20} />,
        Bird: <Bird size={20} />,
        Timer: <Timer size={20} />,
        Wind: <Wind size={20} />,
        Star: <Star size={20} />,
        Hourglass: <Hourglass size={20} />,
        FastForward: <FastForward size={20} />,
        Map: <Map size={20} />,
        Crown: <Crown size={20} />,
        Layers: <Layers size={20} />,
        MapPin: <MapPin size={20} />,
        Mountain: <Mountain size={20} />,
        Beaker: <Beaker size={20} />,
        Dices: <Dices size={20} />,
        Gem: <Gem size={20} />,
        Globe: <Globe size={20} />,
        Settings: <Settings size={20} />,
        Aperture: <Aperture size={20} />,
        Flower: <Flower size={20} />,
        Dog: <Dog size={20} />,
        CloudLightning: <CloudLightning size={20} />,
        Train: <Train size={20} />,
        Box: <Box size={20} />,
        Clock: <Clock size={20} />,
        Hammer: <Hammer size={20} />,
        Tower: <Castle size={20} />,
        SunInside: <SunMedium size={20} />,
        Waves: <Waves size={20} />,
        Footprints: <Footprints size={20} />,
        Watch: <Watch size={20} />,
        BatteryCharging: <BatteryCharging size={20} />,
        Gift: <Gift size={20} />,
        Sword: <Sword size={20} />,
        Wand2: <Wand2 size={20} />,
        Library: <Library size={20} />,
        Rocket: <Rocket size={20} />,
        Infinity: <Infinity size={20} />
    };

    const allItems = MEDAL_DATA.map(m => ({
        id: m.id,
        name: m.name,
        icon: ICON_MAP[m.iconType] || <Medal size={20} />,
        description: m.criteria,
        detail: m.description,
        points: m.points,
        rarity: m.rarity,
        phase: m.phase,
        type: 'medal'
    }));

    // Rarity Rank for Sorting
    const RARITY_RANK = {
        LEGENDARY: 5,
        EPIC: 4,
        RARE: 3,
        UNCOMMON: 2,
        COMMON: 1
    };

    // v15.0: Phase 우선 정렬 로직
    const sortedItems = [...allItems].sort((a, b) => {
        if (a.phase !== b.phase) return a.phase - b.phase;
        const rankA = RARITY_RANK[a.rarity as keyof typeof RARITY_RANK];
        const rankB = RARITY_RANK[b.rarity as keyof typeof RARITY_RANK];
        if (rankA !== rankB) return rankB - rankA;
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

            const edgeThreshold = 80;
            const maxScrollSpeed = 12;

            if (relativeX < edgeThreshold) {
                const intensity = (edgeThreshold - relativeX) / edgeThreshold;
                container.scrollLeft -= maxScrollSpeed * intensity;
            } else if (relativeX > width - edgeThreshold) {
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
                        ? `1px solid ${isSelected ? color : `${color}66`}`
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
                fontSize: '1.2rem',
                fontFamily: 'Outfit, sans-serif',
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
                letterSpacing: '-0.02em'
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
                    maskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
                    cursor: 'grab'
                }}
            >
                <div style={{ minWidth: '10px' }} />

                {sortedItems.map((item, idx) => (
                    <InventorySlot
                        key={idx}
                        item={item}
                        isUnlocked={item.type === 'trophy' ? unlockedBadges.includes(item.id) : unlockedMedals.includes(item.id)}
                    />
                ))}

                <div style={{ minWidth: '10px' }} />
            </div>

            {/* Info Panel */}
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

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'center', justifyContent: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                <span style={{
                                    fontSize: '1rem',
                                    fontWeight: 'bold',
                                    color: hoveredItem.isUnlocked ? '#fff' : 'rgba(255,255,255,0.3)',
                                    textShadow: hoveredItem.isUnlocked ? `0 0 10px ${RARITY[hoveredItem.rarity as keyof typeof RARITY]}44` : 'none'
                                }}>
                                    {hoveredItem.phase && <span style={{ color: RARITY[hoveredItem.rarity as keyof typeof RARITY], marginRight: '6px', fontSize: '0.8rem' }}>Phase {hoveredItem.phase}</span>}
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
                                    {hoveredItem.rarity} | {hoveredItem.points}P
                                </span>
                            </div>
                            <span style={{ fontSize: '0.85rem', color: hoveredItem.isUnlocked ? 'rgba(255,255,255,0.6)' : 'rgba(0,209,255,0.5)', fontWeight: hoveredItem.isUnlocked ? 'normal' : 'bold' }}>
                                {hoveredItem.isUnlocked ? (hoveredItem.detail || hoveredItem.description) : `🛑 미션: ${hoveredItem.description}`}
                            </span>
                        </div>

                        {hoveredItem.isUnlocked && (
                            <div style={{ position: 'absolute', right: '1.5rem', textAlign: 'right', fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>
                                Unlocked<br />
                                <span style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 'bold' }}>{hoveredItem.date || '-'}</span>
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
                
                .custom-scrollbar::-webkit-scrollbar {
                    height: 4px;
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
