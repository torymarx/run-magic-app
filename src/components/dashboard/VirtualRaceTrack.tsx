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
            <div style={{ position: 'relative', height: '200px', margin: '2rem 0', paddingRight: '60px' }}>
                {/* Track Lanes */}
                {[0, 1, 2].map(i => (
                    <div key={i} style={{
                        position: 'absolute',
                        top: `${i * 60 + 40}px`,
                        left: 0, right: '60px',
                        height: '1px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        zIndex: 1
                    }} />
                ))}

                {/* Finish Line */}
                <div style={{
                    position: 'absolute',
                    top: '20px',
                    bottom: '20px',
                    right: '60px',
                    width: '4px',
                    background: 'linear-gradient(to bottom, transparent, var(--electric-blue), transparent)',
                    zIndex: 2,
                    boxShadow: '0 0 15px var(--electric-blue)'
                }}>
                    <div style={{ position: 'absolute', top: '-15px', left: '-10px', color: 'var(--electric-blue)' }}>
                        <Flag size={20} />
                    </div>
                    <span style={{
                        position: 'absolute',
                        bottom: '-25px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: '0.7rem',
                        whiteSpace: 'nowrap',
                        opacity: 0.6
                    }}>FINISH ({sortedRunners[0].distance}km)</span>
                </div>

                {/* Runners */}
                {runners.map((runner, idx) => {
                    const rankIndex = sortedRunners.findIndex(r => r.id === runner.id);
                    const isWinner = rankIndex === 0;

                    // v18.4: 우승자 기준 트랙 스케일링 (1등이 무조건 100% 지점)
                    const winnerDist = sortedRunners[0].distance;
                    const rawPositionPercent = winnerDist > 0 ? (runner.distance / winnerDist) * 100 : 0;

                    // 격차 증폭: 1등(100%)과의 차이를 3.5배 강조
                    const gapFromWinner = 100 - rawPositionPercent;
                    const amplifiedPositionPercent = 100 - (gapFromWinner * 3.5);
                    const finalPosition = Math.max(0, Math.min(amplifiedPositionPercent, 100));

                    return (
                        <div key={runner.id} style={{
                            position: 'absolute',
                            top: `${idx * 60 + 15}px`,
                            left: `${finalPosition}%`,
                            transition: 'left 2.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            zIndex: runner.isUser ? 20 : 10,
                            transform: 'translateX(-50%)',
                            // v18.4 도착 후 3초간 제자리 질주 애니메이션 (2.5초 이동 후 시작)
                            animation: `finish-running 0.3s ease-in-out 2s infinite alternate`
                        }}>
                            {/* Rank Badge */}
                            <div style={{
                                background: rankIndex === 0 ? 'linear-gradient(135deg, #FFD700, #FFA500)' : rankIndex === 1 ? '#C0C0C0' : '#CD7F32',
                                color: 'black',
                                borderRadius: '50%',
                                width: '22px',
                                height: '22px',
                                fontSize: '0.75rem',
                                fontWeight: '900',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '4px',
                                boxShadow: isWinner ? '0 0 15px rgba(255, 215, 0, 0.6)' : '0 4px 8px rgba(0,0,0,0.5)',
                                border: '2px solid rgba(255,255,255,0.8)'
                            }}>
                                {rankIndex + 1}
                            </div>

                            {/* Character Avatar */}
                            <div style={{
                                width: runner.isUser ? '42px' : '36px',
                                height: runner.isUser ? '42px' : '36px',
                                borderRadius: '50%',
                                background: runner.color,
                                border: `2px solid ${runner.isUser ? 'var(--neon-green)' : 'white'}`,
                                boxShadow: `0 0 ${runner.isUser ? '25px' : '15px'} ${runner.color}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: runner.isUser ? '1.5rem' : '1.3rem',
                                position: 'relative',
                                animation: isWinner ? 'pulse-winner 2s infinite' : 'none'
                            }}>
                                {runner.isUser ? '🧙' : '🏃'}
                                {isWinner && (
                                    <Trophy size={14} style={{ position: 'absolute', top: '-8px', right: '-8px', color: '#FFD700', filter: 'drop-shadow(0 0 5px gold)' }} />
                                )}
                            </div>

                            {/* Name & Pace */}
                            <div style={{ textAlign: 'center', marginTop: '6px' }}>
                                <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 'bold', whiteSpace: 'nowrap', color: runner.isUser ? 'var(--neon-green)' : 'white' }}>
                                    {runner.name} {runner.isUser && '✨'}
                                </p>
                                <p style={{ margin: 0, fontSize: '0.65rem', opacity: 0.8 }}>{runner.pace}</p>
                                <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: 'bold', color: runner.color }}>
                                    {runner.distance >= currentRecord.distance
                                        ? `+${(runner.distance - currentRecord.distance).toFixed(2)}km`
                                        : `-${(currentRecord.distance - runner.distance).toFixed(2)}km`}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Race Summary Text & Ranking Board */}
            <div style={{
                marginTop: '1.5rem',
                padding: '1.2rem',
                background: 'rgba(0,0,0,0.4)',
                borderRadius: '16px',
                fontSize: '0.9rem',
                border: '1px solid rgba(255,255,255,0.05)',
                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.8rem' }}>
                    <Medal size={20} className="neon-text-blue" />
                    <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>레이스 최종 순위</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {sortedRunners.map((r, i) => {
                        const isPlayer = r.id === 'current';
                        const distDiff = r.distance - currentRecord.distance;
                        return (
                            <div key={r.id} style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                background: isPlayer ? 'rgba(0, 209, 255, 0.1)' : 'transparent',
                                padding: '6px 12px',
                                borderRadius: '8px',
                                border: isPlayer ? '1px solid rgba(0, 209, 255, 0.3)' : '1px solid transparent'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span style={{
                                        width: '24px',
                                        fontWeight: '900',
                                        color: i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : '#CD7F32',
                                        fontSize: '1.1rem'
                                    }}>{i + 1}위</span>
                                    <span style={{ fontWeight: isPlayer ? 'bold' : 'normal', color: isPlayer ? 'var(--neon-green)' : 'white' }}>
                                        {r.name} {isPlayer && '(나)'}
                                    </span>
                                </div>
                                <div style={{ fontSize: '0.85rem', opacity: 0.8, textAlign: 'right' }}>
                                    <span style={{ marginRight: '10px' }}>{r.pace}</span>
                                    <span style={{ color: r.color, fontWeight: 'bold' }}>
                                        {distDiff === 0 ? '기준' : (distDiff > 0 ? `+${distDiff.toFixed(2)}km` : `${distDiff.toFixed(2)}km`)}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <p style={{ marginTop: '1.2rem', padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', borderLeft: '4px solid var(--electric-blue)', lineHeight: 1.5 }}>
                    {sortedRunners[0].id === 'current' ? (
                        <span className="neon-text-green" style={{ fontWeight: 'bold' }}>
                            오늘의 챔피언! 압도적인 페이스로 어제의 기록들을 모두 따돌렸습니다. 🏆 축하드려요!
                        </span>
                    ) : (
                        <span>
                            아쉽게도 <strong style={{ color: sortedRunners[0].color }}>{sortedRunners[0].name}</strong>에게 선두를 내주었습니다.
                            페이스 조절을 통해 다음에는 1위를 탈환해 보세요! 🔥
                        </span>
                    )}
                </p>
            </div>

            <style>{`
                @keyframes pulse-winner {
                    0% { transform: scale(1); filter: brightness(1); }
                    50% { transform: scale(1.05); filter: brightness(1.2); }
                    100% { transform: scale(1); filter: brightness(1); }
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
