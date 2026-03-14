import React, { useState, useMemo, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine, ResponsiveContainer, Label } from 'recharts';
import { Flame, History, ArrowUpRight, ArrowDownRight, Minus, Activity, ChevronLeft, ChevronRight, Zap, Scale, Trophy, Ruler } from 'lucide-react';
import { parseTimeToSeconds, formatPace, getLocalDateString } from '../utils/calculations';

interface BioPerformanceChartProps {
    records: any[];
    viewingDate: Date;
    onDateChange: (date: Date) => void;
}

const BioPerformanceChart: React.FC<BioPerformanceChartProps> = ({ records, viewingDate, onDateChange }) => {
    // v8.8: 초기 로딩 시 데이터가 있는 달로 자동 이동
    const [isUserNavigated, setIsUserNavigated] = useState(false); // 수동 이동 여부 추적

    useEffect(() => {
        // 이미 사용자가 수동으로 이동했다면 자동 이동 방지
        if (isUserNavigated) return;

        if (records && records.length > 0) {
            const year = viewingDate.getFullYear();
            const month = viewingDate.getMonth();
            const hasData = records.some(r => {
                const d = new Date(r.date);
                return d.getFullYear() === year && d.getMonth() === month;
            });

            if (!hasData) {
                const lastRecordDate = new Date(records[0].date);
                if (!isNaN(lastRecordDate.getTime())) {
                    onDateChange(lastRecordDate);
                }
            }
        }
    }, [records, isUserNavigated, viewingDate, onDateChange]);

    const currentYearStr = viewingDate.getFullYear().toString();
    const currentMonthStr = (viewingDate.getMonth() + 1).toString().padStart(2, '0');

    const chartData = useMemo(() => {
        if (!Array.isArray(records)) return [];
        const filtered = records
            .filter(r => {
                const [year, month] = r.date.split('-');
                const paceSec = parseTimeToSeconds(r.pace);
                return year === currentYearStr && month === currentMonthStr && r.distance > 0 && paceSec > 0;
            })
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        return filtered.map((r, idx) => {
            const paceSeconds = parseTimeToSeconds(r.pace);
            const weight = parseFloat(r.weight?.toString() || "0");
            const hr = r.heart_rate ? parseInt(r.heart_rate.toString(), 10) : null;
            const cad = r.cadence ? parseInt(r.cadence.toString(), 10) : null;
            const totalTimeSeconds = parseTimeToSeconds(r.totalTime);

            // 전일 대비 변화량 계산
            let weightChange = 0;
            let paceChange = 0;
            if (idx > 0) {
                const prevWeight = parseFloat(filtered[idx - 1].weight?.toString() || "0");
                const prevPace = parseTimeToSeconds(filtered[idx - 1].pace);
                weightChange = weight - prevWeight;
                paceChange = paceSeconds - prevPace;
            }

            return {
                date: r.date.split('-').slice(1).join('/'),
                fullDate: r.date,
                weight: weight,
                weightChange: weightChange,
                paceSeconds: paceSeconds,
                paceChange: paceChange,
                paceDisplay: r.pace,
                distance: parseFloat(r.distance?.toString() || "0"),
                totalTimeSeconds: totalTimeSeconds,
                hr: hr,
                cad: cad
            };
        });
    }, [records, viewingDate]);

    // --- Anchor Date Logic (The "Standard" Date) ---
    const anchorDate = useMemo(() => {
        const now = new Date();
        const isCurrentMonth =
            now.getFullYear() === viewingDate.getFullYear() &&
            now.getMonth() === viewingDate.getMonth();

        if (isCurrentMonth) {
            return now;
        } else {
            // Last day of the viewed month
            return new Date(viewingDate.getFullYear(), viewingDate.getMonth() + 1, 0);
        }
    }, [viewingDate]);

    // --- Weekly Comparison Logic (Based on Anchor Date) ---
    const weeklyComparison = useMemo(() => {
        if (!Array.isArray(records) || records.length === 0) return { distDiff: 0, paceDiff: 0, weightDiff: 0, timeDiff: 0, thisWeekDist: 0 };

        // FIX: Use anchorDate instead of new Date() to compare relative to the viewed month
        const baseDate = new Date(anchorDate);
        const startOfThisWeek = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() - baseDate.getDay());
        const endOfThisWeek = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() + (6 - baseDate.getDay()));

        const startOfLastWeek = new Date(startOfThisWeek);
        startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);
        const endOfLastWeek = new Date(endOfThisWeek);
        endOfLastWeek.setDate(endOfLastWeek.getDate() - 7);

        const getRecordsInRange = (start: Date, end: Date) => {
            return records.filter(r => {
                const d = new Date(r.date);
                return d >= start && d <= end && r.distance > 0;
            });
        };

        const thisWeekRecords = getRecordsInRange(startOfThisWeek, endOfThisWeek);
        const lastWeekRecords = getRecordsInRange(startOfLastWeek, endOfLastWeek);

        const calcStats = (data: any[]) => {
            if (data.length === 0) return { dist: 0, pace: 0, weight: 0, time: 0 };
            const totalDist = data.reduce((a, b) => a + b.distance, 0);
            const totalTime = data.reduce((a, b) => a + parseTimeToSeconds(b.totalTime), 0);
            const avgWeight = data.reduce((a, b) => a + parseFloat(b.weight || 0), 0) / data.length;
            const weightedPaceSum = data.reduce((a, b) => a + (parseTimeToSeconds(b.pace) * b.distance), 0);
            const avgPace = totalDist > 0 ? weightedPaceSum / totalDist : 0;
            return { dist: totalDist, pace: avgPace, weight: avgWeight, time: totalTime };
        };

        const thisWeek = calcStats(thisWeekRecords);
        const lastWeek = calcStats(lastWeekRecords);

        return {
            distDiff: thisWeek.dist - lastWeek.dist,
            thisWeekDist: thisWeek.dist,
            paceDiff: thisWeek.pace - lastWeek.pace,
            weightDiff: thisWeek.weight - lastWeek.weight,
        };
    }, [records, anchorDate]);

    const stats = useMemo(() => {
        if (!Array.isArray(records) || records.length === 0) return { totalDist: 0, avgPace: "00:00", avgWeight: 0, totalSessions: 0, globalTotalSessions: 0 };

        // 1. Total Cumulative Distance (From 2026-01-01 to Anchor Date)
        const anchorDateStr = getLocalDateString(anchorDate);

        const validRecords = records.filter(r => r.date >= '2026-01-01' && r.date <= anchorDateStr);
        const totalDist = validRecords.reduce((acc, curr) => acc + (parseFloat(curr.distance?.toString() || "0")), 0);
        const globalTotalSessions = validRecords.length;

        // 2. Averages & Counts (Based on CURRENT VIEW - chartData)
        if (chartData.length === 0) {
            return {
                totalDist: totalDist.toFixed(1),
                avgPace: "00:00",
                avgWeight: 0,
                totalSessions: 0,
                globalTotalSessions
            };
        }

        // Use totalTimeSeconds directly for accuracy
        const totalTimeSec = chartData.reduce((acc, curr) => acc + curr.totalTimeSeconds, 0);
        const chartTotalDist = chartData.reduce((acc, curr) => acc + curr.distance, 0); // Local dist for weighting

        // Calculate average pace (seconds per km)
        const avgPaceSec = chartTotalDist > 0 ? totalTimeSec / chartTotalDist : 0;

        const avgWeight = chartData.reduce((acc, curr) => acc + curr.weight, 0) / chartData.length;
        const totalSessions = chartData.length;

        return {
            totalDist: totalDist.toFixed(1), // Global Cumulative to anchorDate
            avgPace: formatPace(avgPaceSec), // Local Avg
            avgWeight: avgWeight.toFixed(1), // Local Avg
            totalSessions, // Local (Monthly) Count
            globalTotalSessions // Global Count (from 2026-01-01)
        };
    }, [chartData, records, anchorDate]);

    const domains = useMemo(() => {
        if (chartData.length === 0) return { weight: ['auto', 'auto'], pace: ['auto', 'auto'], hr: ['auto', 'auto'], cad: ['auto', 'auto'] };
        const weights = chartData.map(d => d.weight);
        const paces = chartData.map(d => d.paceSeconds);
        const hrs = chartData.map(d => d.hr || 0).filter(v => v > 0);
        const cads = chartData.map(d => d.cad || 0).filter(v => v > 0);

        return {
            weight: [Math.min(...weights) - 0.5, Math.max(...weights) + 0.5],
            pace: [Math.max(...paces) + 5, Math.min(...paces) - 5],
            hr: hrs.length ? [Math.max(60, Math.min(...hrs) - 10), Math.max(...hrs) + 10] : [100, 180],
            cad: cads.length ? [Math.max(120, Math.min(...cads) - 10), Math.max(...cads) + 10] : [140, 200]
        };
    }, [chartData]);

    const weightReferenceLines = useMemo(() => {
        const [w0, w1] = domains.weight;
        if (typeof w0 !== 'number' || typeof w1 !== 'number') return [];
        const min = Math.floor(w0 * 2) / 2;
        const max = Math.ceil(w1 * 2) / 2;
        const lines = [];
        for (let w = min; w <= max; w += 0.5) {
            lines.push(w);
        }
        return lines;
    }, [domains.weight]);


    // --- Draggable Goal Line Logic REMOVED ---
    // 성과 기반 동적 색상 산출 함수 (낮을수록 밝음)
    const getDynamicPaceColor = (paceSec: number) => {
        if (paceSec <= 390) return '#00FFFF'; // 06:30 이하 - 가장 밝은 대청색
        if (paceSec <= 400) return '#00D1FF'; // 06:40 이하
        if (paceSec <= 410) return '#00A3FF'; // 06:50 이하
        return '#0075FF'; // 그 이상 - 차분한 블루
    };

    const getDynamicWeightColor = (weight: number) => {
        if (weight <= 76) return '#FF00FF'; // 가장 밝음
        if (weight <= 78) return '#D100FF';
        if (weight <= 80) return '#BD00FF';
        if (weight <= 82) return '#9D00D1';
        return '#7A00A3'; // 82kg 이상 - 차분함
    };


    const SummaryCard = ({ icon: Icon, label, value, unit, color, diff, subText }: any) => {
        let isPositiveGood = true;
        if (label.includes('페이스') || label.includes('체중')) isPositiveGood = false;
        const numDiff = parseFloat(diff);
        const hasDiff = !isNaN(numDiff) && numDiff !== 0;
        let diffColor = hasDiff ? ((numDiff > 0) === isPositiveGood ? '#00FF85' : '#FF4B4B') : '#888';
        if (!isPositiveGood && hasDiff) {
            diffColor = (numDiff > 0) ? '#FF4B4B' : '#00FF85';
        }

        return (
            <div style={{
                background: 'rgba(255,255,255,0.03)',
                padding: '1rem',
                borderRadius: '16px',
                border: `1px solid ${color}22`,
                flex: 1, minWidth: '140px', position: 'relative', overflow: 'hidden'
            }}>
                <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.05 }}><Icon size={60} color={color} /></div>
                <div style={{ fontSize: '0.75rem', opacity: 0.5, marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Icon size={12} color={color} /> {label}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.2rem' }}>
                    <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'white' }}>{value}</span>
                    <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>{unit}</span>
                </div>
                {subText ? (
                    <div style={{ fontSize: '0.7rem', marginTop: '0.4rem', color: color, display: 'flex', alignItems: 'center', gap: '2px' }}>
                        <ArrowUpRight size={10} />
                        <span>{subText}</span>
                    </div>
                ) : (
                    diff !== undefined && (
                        <div style={{ fontSize: '0.7rem', marginTop: '0.4rem', color: hasDiff ? diffColor : 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                            {hasDiff ? (numDiff > 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />) : <Minus size={10} />}
                            {hasDiff ? (
                                (() => {
                                    const absVal = Math.abs(numDiff);
                                    let formattedDiff = absVal.toFixed(1);
                                    let text = numDiff > 0 ? '늘었어요' : '줄었어요';

                                    if (unit === '/km') { // Pace
                                        formattedDiff = formatPace(absVal); // Returns M'SS"
                                    } else if (unit === 'kg') { // Weight
                                        formattedDiff = `${absVal.toFixed(1)}kg`;
                                    }

                                    return <span>{formattedDiff} {text}</span>;
                                })()
                            ) : (
                                <span>변동 없음</span>
                            )}
                        </div>
                    )
                )}
            </div>
        );
    };

    // Updated Tooltip to handle specific types
    const CustomTooltip = ({ active, payload, boxType }: any) => {
        if (!active || !payload || !payload.length) return null;

        const data = payload[0].payload;

        // Common Container
        const Container = ({ children }: any) => (
            <div style={{ background: 'rgba(10, 10, 12, 0.95)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <p style={{ color: 'white', fontWeight: 'bold', marginBottom: '5px', fontSize: '0.85rem' }}>{data.fullDate}</p>
                {children}
            </div>
        );

        if (boxType === 'hr') {
            return (
                <Container>
                    <p style={{ color: '#FF4B4B', fontSize: '1rem', fontWeight: 'bold' }}>❤️ {data.hr} bpm</p>
                </Container>
            );
        }

        if (boxType === 'cad') {
            return (
                <Container>
                    <p style={{ color: '#FFD700', fontSize: '1rem', fontWeight: 'bold' }}>👟 {data.cad} spm</p>
                </Container>
            );
        }

        if (boxType === 'weight') {
            const diff = data.weightChange;
            const isLoss = diff < 0; // Loss is usually intended
            return (
                <Container>
                    <p style={{ color: '#BD00FF', fontSize: '1rem', fontWeight: 'bold' }}>⚖️ {data.weight}kg</p>
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '6px', paddingTop: '6px' }}>
                        {diff !== 0 ? (
                            <p style={{ fontSize: '0.8rem', color: isLoss ? '#00FF85' : '#FF4B4B' }}>
                                {isLoss ? '감량' : '증가'} {Math.abs(diff).toFixed(1)}kg (전일 대비)
                            </p>
                        ) : (
                            <p style={{ fontSize: '0.8rem', color: '#888' }}>체중 변화 없음</p>
                        )}
                    </div>
                </Container>
            );
        }

        // 3. Pace Tooltip (Daily Change)
        if (boxType === 'pace') {
            const diff = data.paceChange;
            const isFaster = diff < 0; // Less seconds/km is Faster
            return (
                <Container>
                    <p style={{ color: '#00D1FF', fontSize: '1rem', fontWeight: 'bold' }}>⚡ {data.paceDisplay}/km</p>
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '6px', paddingTop: '6px' }}>
                        {diff !== 0 ? (
                            <p style={{ fontSize: '0.8rem', color: isFaster ? '#FFD700' : '#FF4B4B' }}>
                                {isFaster ? '단축' : '지연'} {Math.abs(diff)}초 (전일 대비)
                            </p>
                        ) : (
                            <p style={{ fontSize: '0.8rem', color: '#888' }}>페이스 변화 없음</p>
                        )}
                    </div>
                </Container>
            );
        }

        return null;
    };

    // --- Today vs Average Logic ---
    const performanceAnalysis = useMemo(() => {
        if (chartData.length === 0) return null;

        // "Today" defined as the most recent record in the current chart data
        const today = chartData[chartData.length - 1];

        const totalDist = chartData.reduce((acc, curr) => acc + curr.distance, 0);
        const totalTime = chartData.reduce((acc, curr) => acc + curr.totalTimeSeconds, 0);
        const avgDist = totalDist / chartData.length;
        const avgPaceSec = totalDist > 0 ? totalTime / totalDist : 0;
        const avgWeight = chartData.reduce((acc, curr) => acc + curr.weight, 0) / chartData.length;

        const paceDiffPercent = avgPaceSec > 0 ? ((today.paceSeconds - avgPaceSec) / avgPaceSec) * 100 : 0;
        const distDiffPercent = avgDist > 0 ? ((today.distance - avgDist) / avgDist) * 100 : 0;
        const weightDiffPercent = avgWeight > 0 ? ((today.weight - avgWeight) / avgWeight) * 100 : 0;

        return {
            today,
            todayPaceStr: today.paceDisplay,
            todayDistStr: today.distance.toFixed(1),
            todayWeightStr: today.weight.toFixed(1),
            avgDist,
            avgPaceSec,
            avgWeight,
            paceDiffPercent,
            distDiffPercent,
            weightDiffPercent
        };
    }, [chartData]);

    return (
        <div className="glass-card performance-studio-container" style={{ padding: '2.5rem', position: 'relative', overflow: 'hidden' }}>
            {/* Header & Nav */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3 className="neon-text-blue" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', margin: 0, fontSize: '1.3rem' }}>
                    <Activity size={24} /> 퍼포먼스 인사이트 스튜디오
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.02)', padding: '4px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)', alignItems: 'center' }}>
                    <button onClick={() => { onDateChange(new Date(viewingDate.getFullYear(), viewingDate.getMonth() - 1)); setIsUserNavigated(true); }} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><ChevronLeft size={20} /></button>
                    <span style={{ fontSize: '0.95rem', fontWeight: 'bold', minWidth: '80px', textAlign: 'center' }}>{viewingDate.getFullYear()}.{currentMonthStr}</span>
                    <button onClick={() => { onDateChange(new Date(viewingDate.getFullYear(), viewingDate.getMonth() + 1)); setIsUserNavigated(true); }} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><ChevronRight size={20} /></button>
                </div>
            </div>

            {/* Performance Comparison Summary */}
            {performanceAnalysis && (
                <div style={{
                    marginBottom: '2.5rem',
                    padding: '1.5rem',
                    background: 'linear-gradient(135deg, rgba(0, 209, 255, 0.05) 0%, rgba(189, 0, 255, 0.05) 100%)',
                    borderRadius: '24px',
                    border: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Zap size={18} className="neon-text-blue" />
                        <span style={{ fontSize: '0.95rem', fontWeight: '900', letterSpacing: '0.5px' }}>TODAY'S ANALYSIS vs MONTHLY AVG</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                        {/* Pace Efficiency */}
                        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '8px', border: '1px solid rgba(0, 209, 255, 0.1)' }}>
                            <span style={{ fontSize: '0.75rem', opacity: 0.5, fontWeight: 'bold' }}>페이스 효율 (오늘)</span>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <span style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--neon-blue)', letterSpacing: '-0.5px' }}>
                                    {performanceAnalysis.todayPaceStr}<small style={{ fontSize: '0.8rem', opacity: 0.6, marginLeft: '2px' }}>/km</small>
                                </span>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: performanceAnalysis.paceDiffPercent <= 0 ? '#00FF85' : '#FF4B4B' }}>
                                        {performanceAnalysis.paceDiffPercent <= 0 ? '▲ ' : '▼ '}{Math.abs(performanceAnalysis.paceDiffPercent).toFixed(1)}%
                                    </span>
                                    <span style={{ fontSize: '0.65rem', opacity: 0.4 }}>평균 대비</span>
                                </div>
                            </div>
                        </div>

                        {/* Intensity */}
                        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '8px', border: '1px solid rgba(57, 255, 20, 0.1)' }}>
                            <span style={{ fontSize: '0.75rem', opacity: 0.5, fontWeight: 'bold' }}>주행 강도 (오늘)</span>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <span style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--neon-green)', letterSpacing: '-0.5px' }}>
                                    {performanceAnalysis.todayDistStr}<small style={{ fontSize: '0.8rem', opacity: 0.6, marginLeft: '2px' }}>km</small>
                                </span>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: performanceAnalysis.distDiffPercent >= 0 ? '#00FF85' : '#FF4B4B' }}>
                                        {performanceAnalysis.distDiffPercent >= 0 ? '▲ ' : '▼ '}{Math.abs(performanceAnalysis.distDiffPercent).toFixed(1)}%
                                    </span>
                                    <span style={{ fontSize: '0.65rem', opacity: 0.4 }}>평균 대비</span>
                                </div>
                            </div>
                        </div>

                        {/* Bio Rhythm */}
                        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '8px', border: '1px solid rgba(189, 0, 255, 0.1)' }}>
                            <span style={{ fontSize: '0.75rem', opacity: 0.5, fontWeight: 'bold' }}>바이오 리듬 (오늘 체중)</span>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <span style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--vibrant-purple)', letterSpacing: '-0.5px' }}>
                                    {performanceAnalysis.todayWeightStr}<small style={{ fontSize: '0.8rem', opacity: 0.6, marginLeft: '2px' }}>kg</small>
                                </span>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: performanceAnalysis.weightDiffPercent <= 0 ? '#00FF85' : '#888' }}>
                                        {performanceAnalysis.weightDiffPercent <= 0 ? '▼ ' : '▲ '}{Math.abs(performanceAnalysis.weightDiffPercent).toFixed(1)}%
                                    </span>
                                    <span style={{ fontSize: '0.65rem', opacity: 0.4 }}>평균 대비</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Metrics */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
                <SummaryCard
                    icon={Ruler}
                    label="누적 거리"
                    value={stats.totalDist}
                    unit="km"
                    color="#00FF85"
                    subText={`이번 주 (+${weeklyComparison.thisWeekDist.toFixed(1)}km)`}
                />
                <SummaryCard icon={Zap} label="평균 페이스" value={stats.avgPace} unit="/km" color="#00D1FF" diff={weeklyComparison.paceDiff} />
                <SummaryCard icon={Scale} label="평균 체중" value={stats.avgWeight} unit="kg" color="#BD00FF" diff={weeklyComparison.weightDiff} />
                <SummaryCard
                    icon={Trophy}
                    label="총 러닝 횟수"
                    value={stats.totalSessions}
                    unit="회"
                    color="#FFD700"
                    subText={`해당 월 / 2026년 총 ${stats.globalTotalSessions || 0}회`}
                />
            </div>

            {/* Four Performance Charts */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                <div style={{ height: 160 }}>
                    <p style={{ fontSize: '0.8rem', color: performanceAnalysis ? getDynamicWeightColor(performanceAnalysis.today.weight) : '#BD00FF', marginBottom: '0.5rem' }}>
                        <Scale size={14} /> 체중 (kg)
                    </p>
                    <ResponsiveContainer>
                        <AreaChart data={chartData} syncId="runMagicSync">
                            <defs>
                                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={performanceAnalysis ? getDynamicWeightColor(performanceAnalysis.today.weight) : '#BD00FF'} stopOpacity={0.4} />
                                    <stop offset="95%" stopColor={performanceAnalysis ? getDynamicWeightColor(performanceAnalysis.today.weight) : '#BD00FF'} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                            <YAxis domain={domains.weight} hide />
                            <Tooltip content={<CustomTooltip boxType="weight" />} />
                            {weightReferenceLines.map(w => {
                                const isInteger = w % 1 === 0;
                                return (
                                    <ReferenceLine
                                        key={`weight-ref-${w}`}
                                        y={w}
                                        stroke={isInteger ? "#BD00FF" : "rgba(189, 0, 255, 0.4)"}
                                        strokeDasharray={isInteger ? "3 3" : "2 4"}
                                        opacity={isInteger ? 0.3 : 0.1}
                                    >
                                        <Label
                                            value={`${w.toFixed(1)}kg`}
                                            position="insideRight"
                                            fill={isInteger ? "#BD00FF" : "rgba(189, 0, 255, 0.5)"}
                                            fontSize={isInteger ? 10 : 8}
                                        />
                                    </ReferenceLine>
                                );
                            })}
                            <Area
                                type="monotone"
                                dataKey="weight"
                                stroke={performanceAnalysis ? getDynamicWeightColor(performanceAnalysis.today.weight) : '#BD00FF'}
                                fill="url(#colorWeight)"
                                strokeWidth={2}
                                animationDuration={1000}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div style={{ height: 160 }}>
                    <p style={{ fontSize: '0.8rem', color: performanceAnalysis ? getDynamicPaceColor(performanceAnalysis.today.paceSeconds) : '#00D1FF', marginBottom: '0.5rem' }}>
                        <Zap size={14} /> 페이스 (초/km)
                    </p>
                    <ResponsiveContainer>
                        <AreaChart data={chartData} syncId="runMagicSync">
                            <defs>
                                <linearGradient id="colorPace" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={performanceAnalysis ? getDynamicPaceColor(performanceAnalysis.today.paceSeconds) : '#00D1FF'} stopOpacity={0.4} />
                                    <stop offset="95%" stopColor={performanceAnalysis ? getDynamicPaceColor(performanceAnalysis.today.paceSeconds) : '#00D1FF'} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                            <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" axisLine={false} tickLine={false} style={{ fontSize: '0.7rem' }} />
                            <YAxis reversed domain={domains.pace} hide />
                            <Tooltip content={<CustomTooltip boxType="pace" />} />
                            <ReferenceLine y={390} stroke="#00FFFF" strokeDasharray="3 3" opacity={0.5}><Label value="06:30" position="insideRight" fill="#00FFFF" fontSize={10} /></ReferenceLine>
                            <ReferenceLine y={400} stroke="#00D1FF" strokeDasharray="3 3" opacity={0.4}><Label value="06:40" position="insideRight" fill="#00D1FF" fontSize={10} /></ReferenceLine>
                            <ReferenceLine y={410} stroke="#00A3FF" strokeDasharray="3 3" opacity={0.3}><Label value="06:50" position="insideRight" fill="#00A3FF" fontSize={10} /></ReferenceLine>
                            <ReferenceLine y={420} stroke="#0075FF" strokeDasharray="3 3" opacity={0.2}><Label value="07:00" position="insideRight" fill="#0075FF" fontSize={10} /></ReferenceLine>
                            <Area
                                type="monotone"
                                dataKey="paceSeconds"
                                stroke={performanceAnalysis ? getDynamicPaceColor(performanceAnalysis.today.paceSeconds) : '#00D1FF'}
                                fill="url(#colorPace)"
                                strokeWidth={2}
                                animationDuration={1000}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Heart Rate Chart */}
                <div style={{ height: 160 }}>
                    <p style={{ fontSize: '0.8rem', color: '#FF4B4B', marginBottom: '0.5rem' }}>
                        <Flame size={14} /> 평균 심박수 (bpm)
                    </p>
                    <ResponsiveContainer>
                        <AreaChart data={chartData} syncId="runMagicSync">
                            <defs>
                                <linearGradient id="colorHr" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#FF4B4B" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#FF4B4B" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                            <XAxis dataKey="date" hide />
                            <YAxis domain={domains.hr} hide />
                            <Tooltip content={<CustomTooltip boxType="hr" />} />
                            <ReferenceLine y={140} stroke="#FF4B4B" strokeDasharray="3 3" opacity={0.2}><Label value="Z2" position="insideRight" fill="#FF4B4B" fontSize={10} /></ReferenceLine>
                            <ReferenceLine y={160} stroke="#FF0000" strokeDasharray="3 3" opacity={0.4}><Label value="Z4" position="insideRight" fill="#FF0000" fontSize={10} /></ReferenceLine>
                            <Area
                                type="monotone"
                                dataKey="hr"
                                stroke="#FF4B4B"
                                fill="url(#colorHr)"
                                strokeWidth={2}
                                animationDuration={1000}
                                connectNulls={true}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Cadence Chart */}
                <div style={{ height: 160 }}>
                    <p style={{ fontSize: '0.8rem', color: '#FFD700', marginBottom: '0.5rem' }}>
                        <History size={14} /> 케이던스 (spm)
                    </p>
                    <ResponsiveContainer>
                        <AreaChart data={chartData} syncId="runMagicSync">
                            <defs>
                                <linearGradient id="colorCad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#FFD700" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#FFD700" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                            <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" axisLine={false} tickLine={false} style={{ fontSize: '0.7rem' }} />
                            <YAxis domain={domains.cad} hide />
                            <Tooltip content={<CustomTooltip boxType="cad" />} />
                            <ReferenceLine y={170} stroke="#FFD700" strokeDasharray="3 3" opacity={0.3}><Label value="170" position="insideRight" fill="#FFD700" fontSize={10} /></ReferenceLine>
                            <ReferenceLine y={180} stroke="#FF9900" strokeDasharray="3 3" opacity={0.5}><Label value="180" position="insideRight" fill="#FF9900" fontSize={10} /></ReferenceLine>
                            <Area
                                type="monotone"
                                dataKey="cad"
                                stroke="#FFD700"
                                fill="url(#colorCad)"
                                strokeWidth={2}
                                animationDuration={1000}
                                connectNulls={true}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.03)', display: 'flex', justifyContent: 'center', gap: '2rem', fontSize: '0.75rem', opacity: 0.5 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FF4B4B' }}></div> 심박수</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FFD700' }}></div> 케이던스</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#BD00FF' }}></div> 체중</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00D1FF' }}></div> 페이스</div>
            </div>
        </div>
    );
};

export default BioPerformanceChart;
