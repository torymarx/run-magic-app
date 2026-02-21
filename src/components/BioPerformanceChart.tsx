import React, { useState, useMemo, useEffect, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Scale, Zap, Activity, ArrowUpRight, ArrowDownRight, Ruler, ChevronLeft, ChevronRight, Trophy, Clock, Minus, Plus } from 'lucide-react';
import { parseTimeToSeconds, formatPace, formatSecondsToTime } from '../utils/calculations';

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

        return filtered.map((r, index) => {
            const prev = index > 0 ? filtered[index - 1] : null;

            const currentWeight = parseFloat(r.weight?.toString() || "0");
            const prevWeight = prev ? parseFloat(prev.weight?.toString() || "0") : currentWeight;

            const currentPaceSec = parseTimeToSeconds(r.pace);
            const prevPaceSec = prev ? parseTimeToSeconds(prev.pace) : currentPaceSec;

            return {
                date: r.date.split('-').slice(1).join('/'),
                fullDate: r.date,
                weight: currentWeight,
                weightChange: currentWeight - prevWeight, // Daily Diff
                paceSeconds: currentPaceSec,
                paceDisplay: r.pace,
                paceChange: currentPaceSec - prevPaceSec, // Daily Diff
                distance: parseFloat(r.distance?.toString() || "0"),
                totalTimeSeconds: parseTimeToSeconds(r.totalTime),
                calories: r.calories
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
        if (!Array.isArray(records) || records.length === 0) return { totalDist: 0, avgPace: "00:00", avgWeight: 0, totalSessions: 0 };

        // 1. Total Cumulative Distance (From 2026-01-01 to Anchor Date)
        const anchorDateStr = anchorDate.toISOString().split('T')[0];
        const totalDist = records
            .filter(r => r.date >= '2026-01-01' && r.date <= anchorDateStr)
            .reduce((acc, curr) => acc + (parseFloat(curr.distance?.toString() || "0")), 0);

        // 2. Averages & Counts (Based on CURRENT VIEW - chartData)
        if (chartData.length === 0) {
            return {
                totalDist: totalDist.toFixed(1),
                avgPace: "00:00",
                avgWeight: 0,
                totalSessions: 0
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
            totalSessions, // Local Count
        };
    }, [chartData, records, anchorDate]);

    const domains = useMemo(() => {
        if (chartData.length === 0) return { weight: ['auto', 'auto'], pace: ['auto', 'auto'] };
        const weights = chartData.map(d => d.weight);
        const paces = chartData.map(d => d.paceSeconds);
        return {
            weight: [Math.min(...weights) - 0.3, Math.max(...weights) + 0.3],
            pace: [Math.max(...paces) + 5, Math.min(...paces) - 5]
        };
    }, [chartData]);


    // --- Draggable Goal Line Logic ---
    const [goalSeconds, setGoalSeconds] = useState(() => {
        const saved = localStorage.getItem('run-magic-goal-time');
        return saved ? parseInt(saved, 10) : 1200; // Default 20 min
    });

    useEffect(() => {
        localStorage.setItem('run-magic-goal-time', goalSeconds.toString());
    }, [goalSeconds]);

    // Calculate Max Time for Chart Domain
    const maxTimeInChart = useMemo(() => {
        if (chartData.length === 0) return 3600;
        const max = Math.max(...chartData.map(d => d.totalTimeSeconds));
        return Math.max(max * 1.2, goalSeconds * 1.2, 1800);
    }, [chartData, goalSeconds]);

    const chartContainerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        e.preventDefault();
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging || !chartContainerRef.current) return;

            const { top, height } = chartContainerRef.current.getBoundingClientRect();
            // const relativeY = top + height - e.clientY; // Unused

            // Fix: handle relativeY correctly when scrolling or resizing
            // Actually, clientY is viewport relative. BoundingRect is also viewport relative.
            // But we need to check if 'top' changes.
            // Using standard logic:
            const yInContainer = e.clientY - top;
            const yFromBottom = height - yInContainer;

            let ratio = yFromBottom / height;
            if (ratio < 0) ratio = 0;
            if (ratio > 1) ratio = 1;

            const newGoal = Math.round(ratio * maxTimeInChart);
            const snappedGoal = Math.round(newGoal / 10) * 10;
            setGoalSeconds(Math.max(600, snappedGoal));
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, maxTimeInChart]);

    const goalPositionPercent = (goalSeconds / maxTimeInChart) * 100;

    const getGoalStatus = (diff: number) => {
        if (diff <= -10) return { color: '#FFAA00', label: '압도적 달성! 🔥' };
        if (diff <= 0) return { color: '#FFD700', label: '목표 달성 🏆' };
        if (diff <= 10) return { color: '#76EE00', label: '아까워요 😅' };
        if (diff <= 20) return { color: '#00FF85', label: '일반적 런닝 🏃' };
        if (diff <= 40) return { color: '#00D1FF', label: '좀 천천히 🍃' };
        return { color: '#7B61FF', label: '걸었군요 🚶' };
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
    const CustomTooltip = ({ active, payload, label, boxType }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;

            // Common Container
            const Container = ({ children }: any) => (
                <div style={{ background: 'rgba(10, 10, 12, 0.95)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <p style={{ color: 'white', fontWeight: 'bold', marginBottom: '5px', fontSize: '0.85rem' }}>{label}</p>
                    {children}
                </div>
            );

            // 1. Time Tooltip (Goal Comparison)
            if (boxType === 'time') {
                const diffSeconds = data.totalTimeSeconds - goalSeconds;
                const status = getGoalStatus(diffSeconds);
                const absDiff = Math.abs(diffSeconds);
                return (
                    <Container>
                        <p style={{ color: '#00FF85', fontSize: '1rem', fontWeight: 'bold' }}>⏱ {formatSecondsToTime(data.totalTimeSeconds)}</p>
                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '6px', paddingTop: '6px' }}>
                            <p style={{ fontSize: '0.8rem', color: status.color, fontWeight: 'bold' }}>{status.label}</p>
                            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
                                (목표 {diffSeconds <= 0 ? '-' : '+'}{absDiff}초)
                            </p>
                        </div>
                    </Container>
                );
            }

            // 2. Weight Tooltip (Daily Change)
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
        }
        return null;
    };

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
                <SummaryCard icon={Trophy} label="총 세션" value={stats.totalSessions} unit="회" color="#FFD700" />
            </div>

            {/* Interactive Running Time Chart */}
            <div style={{ marginBottom: '3rem', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <p style={{ fontSize: '0.9rem', color: '#00FF85', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Clock size={16} /> 런닝 타임 목표 달성
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ fontSize: '0.8rem', color: '#FFD700', opacity: 0.8 }}>
                            목표: {formatSecondsToTime(goalSeconds)}
                        </span>
                        <div style={{ display: 'flex', gap: '4px' }}>
                            <button
                                onClick={() => setGoalSeconds(prev => Math.max(600, prev - 1))}
                                style={{
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,215,0,0.3)',
                                    borderRadius: '4px',
                                    color: '#FFD700',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '2px',
                                    transition: 'all 0.2s'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,215,0,0.1)'}
                                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                title="1초 감소"
                            >
                                <Minus size={12} />
                            </button>
                            <button
                                onClick={() => setGoalSeconds(prev => prev + 1)}
                                style={{
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,215,0,0.3)',
                                    borderRadius: '4px',
                                    color: '#FFD700',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '2px',
                                    transition: 'all 0.2s'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,215,0,0.1)'}
                                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                title="1초 증가"
                            >
                                <Plus size={12} />
                            </button>
                        </div>
                        <span style={{ fontSize: '0.7rem', opacity: 0.4, marginLeft: '4px' }}>
                            (드래그 또는 버튼으로 조정)
                        </span>
                    </div>
                </div>

                <div ref={chartContainerRef} style={{ height: 200, width: '100%', position: 'relative', cursor: isDragging ? 'grabbing' : 'default' }}>
                    <ResponsiveContainer>
                        <BarChart data={chartData} syncId="runMagicSync">
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                            <XAxis dataKey="date" hide />
                            <YAxis hide domain={[0, maxTimeInChart]} />
                            <Tooltip content={<CustomTooltip boxType="time" />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                            <Bar dataKey="totalTimeSeconds" radius={[4, 4, 0, 0]} animationDuration={300}>
                                {chartData.map((entry, index) => {
                                    const diff = entry.totalTimeSeconds - goalSeconds;
                                    const status = getGoalStatus(diff);
                                    return (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={status.color}
                                            fillOpacity={0.8}
                                            stroke={status.color}
                                            strokeWidth={1}
                                        />
                                    );
                                })}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>

                    {/* Draggable Goal Line Overlay */}
                    <div
                        onMouseDown={handleMouseDown}
                        style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            bottom: `${Math.min(goalPositionPercent, 100)}%`,
                            height: '2px',
                            background: isDragging ? '#FFD700' : 'rgba(255, 215, 0, 0.5)',
                            borderTop: '1px dashed #FFD700',
                            zIndex: 10,
                            cursor: 'ns-resize',
                            display: 'flex',
                            alignItems: 'center',
                            transition: isDragging ? 'none' : 'bottom 0.3s ease'
                        }}
                    >
                        <div style={{
                            position: 'absolute', right: '0', background: '#FFD700', color: 'black',
                            fontSize: '0.75rem', fontWeight: 'bold', padding: '2px 8px', borderRadius: '10px 0 0 10px',
                            transform: 'translateY(-50%)', pointerEvents: 'none'
                        }}>
                            GOAL {formatSecondsToTime(goalSeconds)}
                        </div>
                        <div style={{ position: 'absolute', width: '100%', height: '20px', top: '-10px', cursor: 'ns-resize' }}></div>
                    </div>
                </div>
            </div>

            {/* Other Charts (Pace/Weight) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                <div style={{ height: 160 }}>
                    <p style={{ fontSize: '0.8rem', color: '#BD00FF', marginBottom: '0.5rem' }}><Scale size={14} /> 체중 (kg)</p>
                    <ResponsiveContainer>
                        <AreaChart data={chartData} syncId="runMagicSync">
                            <defs>
                                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#BD00FF" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#BD00FF" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                            <YAxis domain={domains.weight} hide />
                            <Tooltip content={<CustomTooltip boxType="weight" />} />
                            <Area type="monotone" dataKey="weight" stroke="#BD00FF" fill="url(#colorWeight)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div style={{ height: 160 }}>
                    <p style={{ fontSize: '0.8rem', color: '#00D1FF', marginBottom: '0.5rem' }}><Zap size={14} /> 페이스 (초/km)</p>
                    <ResponsiveContainer>
                        <AreaChart data={chartData} syncId="runMagicSync">
                            <defs>
                                <linearGradient id="colorPace" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#00D1FF" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#00D1FF" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                            <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" axisLine={false} tickLine={false} style={{ fontSize: '0.7rem' }} />
                            <YAxis reversed domain={domains.pace} hide />
                            <Tooltip content={<CustomTooltip boxType="pace" />} />
                            <Area type="monotone" dataKey="paceSeconds" stroke="#00D1FF" fill="url(#colorPace)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.03)', display: 'flex', justifyContent: 'center', gap: '2rem', fontSize: '0.75rem', opacity: 0.5 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00FF85' }}></div> 런닝시간</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#BD00FF' }}></div> 체중</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00D1FF' }}></div> 페이스</div>
            </div>
        </div>
    );
};

export default BioPerformanceChart;
