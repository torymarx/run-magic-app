import React from 'react';

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    unit?: string;
    trend?: string;
    trendType?: 'positive' | 'negative' | 'neutral';
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, unit, trend, trendType = 'neutral' }) => {
    return (
        <div className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
                <span className="neon-text-blue">{icon}</span>
                <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>{label}</span>
            </div>
            <h2 style={{ fontSize: '2rem' }}>
                {value} {unit && <span style={{ fontSize: '1rem', opacity: 0.6 }}>{unit}</span>}
            </h2>
            {trend && (
                <p className={trendType === 'positive' ? 'neon-text-green' : 'neon-text-blue'} style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
                    {trend}
                </p>
            )}
        </div>
    );
};

export default StatCard;
