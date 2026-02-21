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
                    }}>FINISH ({currentRecord.distance}km)</span>
                </div>

                {/* Runners */}
                {runners.map((runner, idx) => {
                    const positionPercent = (runner.distance / currentRecord.distance) * 100;
                    const rankIndex = sortedRunners.findIndex(r => r.id === runner.id);

                    return (
                        <div key={runner.id} style={{
                            position: 'absolute',
                            top: `${idx * 60 + 15}px`,
                            left: `${Math.min(positionPercent, 105)}%`,
                            transition: 'left 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            zIndex: 10,
                            transform: 'translateX(-50%)'
                        }}>
                            {/* Rank Badge */}
                            <div style={{
                                background: rankIndex === 0 ? 'gold' : rankIndex === 1 ? '#C0C0C0' : '#CD7F32',
                                color: 'black',
                                borderRadius: '50%',
                                width: '18px',
                                height: '18px',
                                fontSize: '0.65rem',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '4px',
                                boxShadow: '0 0 10px rgba(0,0,0,0.5)'
                            }}>
                                {rankIndex + 1}
                            </div>

                            {/* Character Avatar (Simple Circle for now, can be improved) */}
                            <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: runner.color,
                                border: '2px solid white',
                                boxShadow: `0 0 15px ${runner.color}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.2rem'
                            }}>
                                {runner.isUser ? '🧙' : '🏃'}
                            </div>

                            {/* Name & Pace */}
                            <div style={{ textAlign: 'center', marginTop: '4px' }}>
                                <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 'bold', whiteSpace: 'nowrap' }}>{runner.name}</p>
                                <p style={{ margin: 0, fontSize: '0.6rem', opacity: 0.6 }}>{runner.pace}</p>
                                <p style={{ margin: 0, fontSize: '0.65rem', color: runner.color }}>
                                    {runner.distance >= currentRecord.distance
                                        ? `+${(runner.distance - currentRecord.distance).toFixed(2)}km`
                                        : `-${(currentRecord.distance - runner.distance).toFixed(2)}km`}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Race Summary Text */}
            <div style={{
                marginTop: '1.5rem',
                padding: '1rem',
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '12px',
                fontSize: '0.9rem',
                borderLeft: '4px solid var(--electric-blue)'
            }}>
                <p style={{ margin: 0, lineHeight: 1.6 }}>
                    {sortedRunners[0].id === 'current' ? (
                        <span className="neon-text-green">축하합니다! 어제의 나를 제치고 오늘 최고의 레이스를 펼쳤습니다. 🏆</span>
                    ) : (
                        <span>아쉽게도 {sortedRunners[0].name}에게 1위를 내주었습니다. 다음 레이스에선 더 힘을 내보세요! 🔥</span>
                    )}
                </p>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', opacity: 0.8, fontSize: '0.8rem' }}>
                    {sortedRunners.map((r, i) => (
                        <span key={r.id} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Medal size={12} color={i === 0 ? 'gold' : i === 1 ? '#C0C0C0' : '#CD7F32'} /> {r.name}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default VirtualRaceTrack;
