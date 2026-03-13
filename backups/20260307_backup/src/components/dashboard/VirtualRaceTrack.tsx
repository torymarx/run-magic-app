/**
 * VirtualRaceTrack Component
 * v18.9: 경쟁자(어제의 나, 10일 평균) 캐릭터 좌우 반전 및 결승선(3km) 고정 배포
 */
import React, { useMemo } from 'react';
import { Trophy, Flag, Medal } from 'lucide-react';
import { parseTimeToSeconds, formatPace } from '../../utils/calculations';

interface RaceRunner {
    id: string;
    name: string;
    distance: number;
    pace: string;
    color: string;
    isUser?: boolean;
}

interface VirtualRaceTrackProps {
    currentRecord: any;
    allRecords?: any[];
}

const VirtualRaceTrack: React.FC<VirtualRaceTrackProps> = ({ currentRecord, allRecords = [] }) => {
    const raceData = useMemo(() => {
        if (!currentRecord) return null;

        const currentTime = parseTimeToSeconds(currentRecord.totalTime);

        const runners: RaceRunner[] = [
            {
                id: 'current',
                name: '오늘의 나',
                distance: currentRecord.distance,
                pace: currentRecord.pace,
                color: 'var(--neon-green)',
                isUser: true
            }
        ];

        // v18.0: 저장된 비교 데이터가 없으면 실시간으로 산출 (기존 기록 대응)
        let comparisons = currentRecord.raceComparisons;

        if (!comparisons && allRecords.length > 0) {
            const sortedByDate = [...allRecords].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            // 1. 어제의 기록 (현재 기록 날짜 - 1일 기준 검색)
            const d = new Date(currentRecord.date);
            const yDate = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1).toISOString().split('T')[0];
            const yesterdayRun = allRecords.find(r => r.date === yDate);

            // 2. 10일 평균 기록 (현재 기록 날짜 이전의 최신 10개 기록)
            const previousRuns = sortedByDate
                .filter(r => new Date(r.date) < new Date(currentRecord.date))
                .slice(0, 10);

            let avg10Run = null;
            if (previousRuns.length > 0) {
                const avgDist = previousRuns.reduce((acc, r) => acc + r.distance, 0) / previousRuns.length;
                const avgTotalSeconds = previousRuns.reduce((acc, r) => acc + parseTimeToSeconds(r.totalTime), 0) / previousRuns.length;
                avg10Run = {
                    distance: Number(avgDist.toFixed(2)),
                    totalTime: '-',
                    pace: formatPace(avgTotalSeconds / avgDist)
                };
            }

            comparisons = { yesterday: yesterdayRun, avg10: avg10Run };
        }

        if (!comparisons) comparisons = {};

        // 어제의 나
        if (comparisons.yesterday) {
            const yPace = parseTimeToSeconds(comparisons.yesterday.pace);
            const yDistAtTime = yPace > 0 ? currentTime / yPace : 0;
            runners.push({
                id: 'yesterday',
                name: '어제의 나',
                distance: Number(yDistAtTime.toFixed(2)),
                pace: comparisons.yesterday.pace,
                color: 'var(--electric-blue)'
            });
        }

        // 10일 평균
        if (comparisons.avg10) {
            const avgPace = parseTimeToSeconds(comparisons.avg10.pace);
            const avgDistAtTime = avgPace > 0 ? currentTime / avgPace : 0;
            runners.push({
                id: 'avg10',
                name: '10일 평균',
                distance: Number(avgDistAtTime.toFixed(2)),
                pace: comparisons.avg10.pace,
                color: '#BD00FF'
            });
        }

        // 랭킹 계산
        const sortedRunners = [...runners].sort((a, b) => b.distance - a.distance);

        return { runners, sortedRunners };
    }, [currentRecord, allRecords]);

    if (!raceData) return null;

    const { runners, sortedRunners } = raceData;

    return (
        <div className="glass-card" style={{
            marginTop: '2rem',
            padding: '1.5rem',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <h4 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1rem' }}>
                <Trophy size={18} className="neon-text-blue" /> 버추얼 레이스 결과
            </h4>

            {/* Race Track */}
            <div style={{ position: 'relative', height: '240px', margin: '2.5rem 0' }}>
                {/* Track Background Area (Lanes) */}
                <div style={{ position: 'absolute', left: 0, right: '80px', top: 0, bottom: 0 }}>
                    {[0, 1, 2].map(i => (
                        <div key={i} style={{
                            position: 'absolute',
                            top: `${i * 65 + 45}px`,
                            left: 0, right: 0,
                            height: '1px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            zIndex: 1,
                            boxShadow: '0 1px 2px rgba(0,0,0,0.5)'
                        }} />
                    ))}
                </div>

                {/* Finish Line - Perfectly Aligned at the end of the track area */}
                <div style={{
                    position: 'absolute',
                    top: '15px',
                    bottom: '15px',
                    right: '80px',
                    width: '3px',
                    background: 'linear-gradient(to bottom, transparent, var(--electric-blue), var(--electric-blue), transparent)',
                    zIndex: 2,
                    boxShadow: '0 0 15px var(--electric-blue), 0 0 30px rgba(0, 209, 255, 0.3)',
                    opacity: 0.8
                }}>
                    <div style={{ position: 'absolute', top: '-18px', left: '50%', transform: 'translateX(-50%)', color: 'var(--electric-blue)', filter: 'drop-shadow(0 0 8px rgba(0, 209, 255, 0.4))' }}>
                        <Flag size={22} strokeWidth={2.5} />
                    </div>
                    <span style={{
                        position: 'absolute',
                        bottom: '-30px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: '0.8rem',
                        fontWeight: '800',
                        color: 'var(--electric-blue)',
                        whiteSpace: 'nowrap',
                        letterSpacing: '1px',
                        textShadow: '0 0 10px rgba(0, 209, 255, 0.5)'
                    }}>FINISH ({currentRecord.distance.toFixed(2)}km)</span>
                </div>

                {/* Runners Container - 100% width here is exactly the Finish Line */}
                <div style={{ position: 'absolute', left: 0, right: '80px', top: 0, bottom: 0, zIndex: 10 }}>
                    {runners.map((runner, idx) => {
                        const rankIndex = sortedRunners.findIndex(r => r.id === runner.id);
                        const isWinner = rankIndex === 0;

                        // v18.6: 우승자 기준 트랙 스케일링 (1등이 무조건 100% 지점 = 결승선)
                        const winnerDist = sortedRunners[0].distance;
                        const rawPositionPercent = winnerDist > 0 ? (runner.distance / winnerDist) * 100 : 0;

                        // 격차 증폭: 1등(100%)과의 차이를 4배 강조하여 극적인 연출
                        const gapFromWinner = 100 - rawPositionPercent;
                        const amplifiedPositionPercent = 100 - (gapFromWinner * 4);
                        const finalPosition = Math.max(0, Math.min(amplifiedPositionPercent, 100));

                        return (
                            <div key={runner.id} style={{
                                position: 'absolute',
                                top: `${idx * 65 + 20}px`,
                                left: `${finalPosition}%`,
                                transition: 'left 2.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                zIndex: runner.isUser ? 30 : 20,
                                transform: 'translateX(-50%)',
                                animation: `finish-running 0.3s ease-in-out 2s infinite alternate`
                            }}>
                                {/* Rank Badge */}
                                <div style={{
                                    background: rankIndex === 0 ? 'linear-gradient(135deg, #FFD700, #FFA500)' : rankIndex === 1 ? '#C0C0C0' : '#CD7F32',
                                    color: 'black',
                                    borderRadius: '50%',
                                    width: '24px',
                                    height: '24px',
                                    fontSize: '0.8rem',
                                    fontWeight: '900',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '6px',
                                    boxShadow: isWinner ? '0 0 15px rgba(255, 215, 0, 0.6)' : '0 4px 8px rgba(0,0,0,0.5)',
                                    border: '2px solid rgba(255,255,255,0.8)'
                                }}>
                                    {rankIndex + 1}
                                </div>

                                {/* Character Avatar */}
                                <div style={{
                                    width: runner.isUser ? '46px' : '40px',
                                    height: runner.isUser ? '46px' : '40px',
                                    borderRadius: '50%',
                                    background: runner.color,
                                    border: `2px solid ${runner.isUser ? 'var(--neon-green)' : 'white'}`,
                                    boxShadow: `0 0 ${runner.isUser ? '30px' : '15px'} ${runner.color}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: runner.isUser ? '1.6rem' : '1.4rem',
                                    position: 'relative',
                                    // v18.6: 경쟁자(유저 제외) 방향 반전 처리
                                    transform: runner.isUser ? 'none' : 'scaleX(-1)',
                                    animation: isWinner ? 'pulse-winner 2s infinite' : 'none'
                                }}>
                                    {runner.isUser ? '🧙' : '🏃'}
                                    {isWinner && (
                                        <Trophy size={16} style={{
                                            position: 'absolute',
                                            top: '-10px',
                                            right: runner.isUser ? '-10px' : 'auto',
                                            left: runner.isUser ? 'auto' : '-10px',
                                            color: '#FFD700',
                                            filter: 'drop-shadow(0 0 5px gold)',
                                            transform: runner.isUser ? 'none' : 'scaleX(-1)' // 트로피 자체는 반전 안함
                                        }} />
                                    )}
                                </div>

                                {/* Name & Pace */}
                                <div style={{ textAlign: 'center', marginTop: '8px' }}>
                                    <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 'bold', color: runner.isUser ? 'var(--neon-green)' : 'white', whiteSpace: 'nowrap' }}>
                                        {runner.name} {runner.isUser && '✨'}
                                    </p>
                                    <p style={{ margin: 0, fontSize: '0.65rem', opacity: 0.8 }}>{runner.pace}</p>
                                    <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: '800', color: runner.color }}>
                                        {runner.distance >= winnerDist
                                            ? 'WINNER'
                                            : `-${(winnerDist - runner.distance).toFixed(2)}km`}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Olympic Podium (시상대) v18.5 */}
            <div style={{
                marginTop: '1.5rem',
                padding: '1.5rem 1rem',
                background: 'rgba(0,0,0,0.4)',
                borderRadius: '24px',
                border: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxShadow: 'inset 0 0 30px rgba(0,0,0,0.3)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '2rem' }}>
                    <Trophy size={22} className="neon-text-blue" />
                    <span style={{ fontWeight: '900', fontSize: '1.2rem', letterSpacing: '2px', color: 'var(--electric-blue)' }}>VICTORY CEREMONY</span>
                </div>

                {/* Podium Stage (v18.7 Upgrade: 3D Structure & Height Offsets) */}
                <div style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    width: '100%',
                    gap: '12px',
                    height: '280px',
                    marginBottom: '2rem',
                    paddingBottom: '5px',
                    perspective: '1000px'
                }}>
                    {/* 2nd Place (Left) - Height 90px */}
                    {sortedRunners[1] && (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '100px' }}>
                            <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                                <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 'bold' }}>{sortedRunners[1].name}</p>
                                <p style={{ margin: 0, fontSize: '0.6rem', opacity: 0.6 }}>{sortedRunners[1].pace}</p>
                            </div>
                            <div style={{
                                width: '42px', height: '42px', borderRadius: '50%', background: sortedRunners[1].color,
                                border: '2px solid #C0C0C0', boxShadow: '0 0 15px #C0C0C0',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem',
                                marginBottom: '12px', zIndex: 2
                            }}>
                                {sortedRunners[1].isUser ? '🧙' : '🏃'}
                            </div>
                            {/* 3D Podium Block */}
                            <div style={{ position: 'relative', width: '100%', height: '90px' }}>
                                {/* Top Face */}
                                <div style={{
                                    position: 'absolute', top: '-10px', left: 0, right: 0, height: '20px',
                                    background: '#A0A0A0', borderRadius: '8px 8px 0 0', transform: 'rotateX(45deg)',
                                    borderBottom: '1px solid rgba(0,0,0,0.2)', zIndex: 1
                                }} />
                                {/* Front Face */}
                                <div style={{
                                    width: '100%', height: '100%', background: 'linear-gradient(to bottom, #7F7F7F, #404040)',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                    border: '1px solid rgba(192, 192, 192, 0.4)', boxShadow: 'inset 0 2px 10px rgba(255,255,255,0.1), 0 10px 20px rgba(0,0,0,0.3)',
                                    borderRadius: '2px 2px 0 0'
                                }}>
                                    <span style={{ fontSize: '2.5rem', fontWeight: '900', color: '#C0C0C0', textShadow: '0 0 10px rgba(192, 192, 192, 0.5)' }}>2</span>
                                    <span style={{ fontSize: '0.7rem', color: '#C0C0C0', fontWeight: 'bold' }}>SILVER</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 1st Place (Center) - Height 140px */}
                    {sortedRunners[0] && (
                        <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '120px', zIndex: 10 }}>
                            <div style={{ marginBottom: '12px', textAlign: 'center' }}>
                                <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: '900', color: '#FFD700', textShadow: '0 0 15px rgba(255, 215, 0, 0.4)' }}>{sortedRunners[0].name}</p>
                                <p style={{ margin: 0, fontSize: '0.7rem', opacity: 0.8 }}>{sortedRunners[0].pace}</p>
                            </div>
                            <div style={{
                                width: '56px', height: '56px', borderRadius: '50%', background: sortedRunners[0].color,
                                border: '3px solid #FFD700', boxShadow: '0 0 30px #FFD700',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem',
                                marginBottom: '15px', position: 'relative', animation: 'champion-glow 2s infinite alternate', zIndex: 2
                            }}>
                                {sortedRunners[0].isUser ? '🧙' : '🏃'}
                                <Trophy size={22} style={{ position: 'absolute', top: '-16px', right: '-16px', color: '#FFD700', filter: 'drop-shadow(0 0 10px gold)' }} />
                            </div>
                            {/* 3D Podium Block */}
                            <div style={{ position: 'relative', width: '100%', height: '140px' }}>
                                {/* Top Face */}
                                <div style={{
                                    position: 'absolute', top: '-12px', left: 0, right: 0, height: '24px',
                                    background: '#DAA520', borderRadius: '10px 10px 0 0', transform: 'rotateX(50deg)',
                                    borderBottom: '1px solid rgba(0,0,0,0.3)', zIndex: 1
                                }} />
                                {/* Front Face */}
                                <div style={{
                                    width: '100%', height: '100%', background: 'linear-gradient(to bottom, #FFD700, #B8860B)',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                    border: '1px solid rgba(255, 215, 0, 0.7)', boxShadow: 'inset 0 2px 15px rgba(255,255,255,0.3), 0 15px 30px rgba(0,0,0,0.4)',
                                    borderRadius: '5px 5px 0 0'
                                }}>
                                    <span style={{ fontSize: '4.5rem', fontWeight: '900', color: 'black', textShadow: '0 1px 2px rgba(255,255,255,0.5)', lineHeight: 0.8 }}>1</span>
                                    <span style={{ fontSize: '0.85rem', color: 'black', fontWeight: 'bold', marginTop: '10px' }}>CHAMPION</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 3rd Place (Right) - Height 70px */}
                    {sortedRunners[2] && (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '100px' }}>
                            <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                                <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 'bold' }}>{sortedRunners[2].name}</p>
                                <p style={{ margin: 0, fontSize: '0.6rem', opacity: 0.6 }}>{sortedRunners[2].pace}</p>
                            </div>
                            <div style={{
                                width: '40px', height: '40px', borderRadius: '50%', background: sortedRunners[2].color,
                                border: '2px solid #CD7F32', boxShadow: '0 0 15px #CD7F32',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem',
                                marginBottom: '10px', zIndex: 2
                            }}>
                                {sortedRunners[2].isUser ? '🧙' : '🏃'}
                            </div>
                            {/* 3D Podium Block */}
                            <div style={{ position: 'relative', width: '100%', height: '70px' }}>
                                {/* Top Face */}
                                <div style={{
                                    position: 'absolute', top: '-8px', left: 0, right: 0, height: '16px',
                                    background: '#A0522D', borderRadius: '8px 8px 0 0', transform: 'rotateX(40deg)',
                                    borderBottom: '1px solid rgba(0,0,0,0.2)', zIndex: 1
                                }} />
                                {/* Front Face */}
                                <div style={{
                                    width: '100%', height: '100%', background: 'linear-gradient(to bottom, #CD7F32, #8B4513)',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                    border: '1px solid rgba(205, 127, 50, 0.4)', boxShadow: 'inset 0 2px 10px rgba(255,255,255,0.1), 0 8px 15px rgba(0,0,0,0.3)',
                                    borderRadius: '2px 2px 0 0'
                                }}>
                                    <span style={{ fontSize: '2rem', fontWeight: '900', color: '#CD7F32' }}>3</span>
                                    <span style={{ fontSize: '0.65rem', color: '#CD7F32', fontWeight: 'bold' }}>BRONZE</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Final Summary Message */}
                <div style={{
                    width: '100%',
                    padding: '1.2rem',
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.05)',
                    textAlign: 'center',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                }}>
                    <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.6 }}>
                        {sortedRunners[0].id === 'current' ? (
                            <span className="neon-text-green" style={{ fontWeight: 'bold' }}>
                                영광의 금메달! 오늘의 대표님이 진정한 챔피언입니다. 🏅<br />
                                <span style={{ fontSize: '0.8rem', opacity: 0.8, fontWeight: 'normal' }}>모든 경쟁자를 물리치고 가장 높은 시상대에 올랐습니다!</span>
                            </span>
                        ) : (
                            <span>
                                <strong style={{ color: sortedRunners[0].color }}>{sortedRunners[0].name}</strong> 선수가 이번 대회의 왕좌를 차지했습니다. <br />
                                <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>페이스를 조금 더 끌어올려 다음 시상식의 주인공이 되어보세요! 🔥</span>
                            </span>
                        )}
                    </p>
                    <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        {sortedRunners.map((r, i) => (
                            <div key={r.id} style={{
                                fontSize: '0.75rem',
                                background: r.id === 'current' ? 'rgba(0, 209, 255, 0.15)' : 'rgba(255,255,255,0.05)',
                                padding: '5px 12px',
                                borderRadius: '20px',
                                border: r.id === 'current' ? '1px solid var(--neon-green)' : '1px solid rgba(255,255,255,0.1)',
                                color: r.id === 'current' ? 'var(--neon-green)' : 'white'
                            }}>
                                <Medal size={10} style={{ marginRight: '4px', color: i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : '#CD7F32' }} />
                                {r.name}: {r.distance.toFixed(2)}km
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes pulse-winner {
                    0% { transform: scale(1); filter: brightness(1); }
                    50% { transform: scale(1.05); filter: brightness(1.3); }
                    100% { transform: scale(1); filter: brightness(1); }
                }
                @keyframes champion-glow {
                    0% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.4); transform: scale(1); }
                    100% { box-shadow: 0 0 45px rgba(255, 215, 0, 0.9); transform: scale(1.05); }
                }
                @keyframes finish-running {
                    0% { transform: translateX(-50%) translateY(0) rotate(-1deg); }
                    25% { transform: translateX(-48%) translateY(-2px) rotate(1deg); }
                    50% { transform: translateX(-52%) translateY(0) rotate(-1deg); }
                    75% { transform: translateX(-50%) translateY(-2px) rotate(1deg); }
                    100% { transform: translateX(-50%) translateY(0) rotate(-1deg); }
                }
            `}</style>
        </div>
    );
};

export default VirtualRaceTrack;
