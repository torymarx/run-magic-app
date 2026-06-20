import React from 'react';
import {
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area
} from 'recharts';
import { TrendingUp } from 'lucide-react';

interface Record {
    id: number;
    date: string;
    distance: number;
    pace: string;
    weight: number;
    calories: number;
}

interface MonthlyDashboardProps {
    records: Record[];
}

const MonthlyDashboard: React.FC<MonthlyDashboardProps> = ({ records }) => {
    // 최근 7개 기록 데이터 가공
    const chartData = [...records].reverse().slice(-7).map(r => ({
        date: r.date.split('-').slice(1).join('/'),
        거리: r.distance,
        몸무게: r.weight,
        칼로리: r.calories
    }));

    // 만약 데이터가 없으면 기본값
    const data = chartData.length > 0 ? chartData : [
        { date: '데이터 없음', 거리: 0, 몸무게: 0, 칼로리: 0 }
    ];

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="glass-card" style={{ padding: '0.8rem', border: '1px solid var(--electric-blue)', fontSize: '0.8rem' }}>
                    <p style={{ marginBottom: '0.4rem', fontWeight: 'bold' }}>{label}</p>
                    {payload.map((p: any, i: number) => (
                        <p key={i} style={{ color: p.color }}>
                            {p.name}: {p.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="glass-card" style={{ padding: '1.5rem', gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3 className="neon-text-blue" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <TrendingUp size={20} /> 월간 퍼포먼스 인사이트
                </h3>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', opacity: 0.6 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--electric-blue)' }} /> 거리(km)
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--vibrant-purple)' }} /> 몸무게(kg)
                    </span>
                </div>
            </div>

            <div style={{ width: '100%', height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorDistance" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--electric-blue)" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="var(--electric-blue)" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--vibrant-purple)" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="var(--vibrant-purple)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis
                            dataKey="date"
                            stroke="rgba(255,255,255,0.3)"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="rgba(255,255,255,0.3)"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="거리"
                            stroke="var(--electric-blue)"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorDistance)"
                        />
                        <Area
                            type="monotone"
                            dataKey="몸무게"
                            stroke="var(--vibrant-purple)"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorWeight)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '0.75rem', opacity: 0.5, marginBottom: '0.3rem' }}>평균 거리</p>
                    <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }} className="neon-text-blue">
                        {(records.reduce((acc, r) => acc + r.distance, 0) / (records.length || 1)).toFixed(1)} km
                    </p>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '0.75rem', opacity: 0.5, marginBottom: '0.3rem' }}>누적 칼로리</p>
                    <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }} className="neon-text-green">
                        {records.reduce((acc, r) => acc + r.calories, 0).toLocaleString()} kcal
                    </p>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '0.75rem', opacity: 0.5, marginBottom: '0.3rem' }}>총 세션</p>
                    <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{records.length}회</p>
                </div>
            </div>
        </div>
    );
};

export default MonthlyDashboard;
