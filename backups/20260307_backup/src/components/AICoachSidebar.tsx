import React from 'react';
import { Award } from 'lucide-react';

interface AICoachSidebarProps {
    coachMessage: string;
    recommendation: {
        title: string;
        detail: string;
    };
    onStart: () => void;
    isRecording: boolean;
    selectedCoach: any;
    onCoachSelect: (coach: any) => void;
    coaches: any[];
}

const AICoachSidebar: React.FC<AICoachSidebarProps> = ({
    coachMessage, recommendation, onStart, isRecording,
    selectedCoach, onCoachSelect, coaches
}) => {
    return (
        <div className="glass-card" style={{
            border: isRecording ? `1px solid ${selectedCoach.color}` : `1px solid ${selectedCoach.color}44`,
            boxShadow: isRecording ? `0 0 20px ${selectedCoach.color}22` : 'none',
            transition: 'all 0.5s ease-in-out'
        }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem', fontFamily: 'Outfit, sans-serif' }} className="neon-text-blue">
                <span style={{ fontSize: '1.3rem' }}>{selectedCoach.emoji}</span>
                <span style={{ color: selectedCoach.color, fontSize: '1.1rem' }}>{selectedCoach.name} 코칭 스튜디오</span>
            </h3>

            {/* Coach Selection */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                {coaches.map(coach => (
                    <button
                        key={coach.id}
                        onClick={() => onCoachSelect(coach)}
                        style={{
                            flexShrink: 0,
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            border: selectedCoach.id === coach.id ? `2px solid ${coach.color}` : '1px solid rgba(255,255,255,0.1)',
                            background: selectedCoach.id === coach.id ? `${coach.color}22` : 'rgba(255,255,255,0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            transition: 'all 0.2s'
                        }}
                        title={coach.name}
                    >
                        {coach.emoji}
                    </button>
                ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    padding: '1rem',
                    borderRadius: '12px',
                    borderLeft: `4px solid ${selectedCoach.color}`
                }}>
                    <p style={{ fontSize: '0.7rem', opacity: 0.5, marginBottom: '0.4rem', color: selectedCoach.color }}>
                        {selectedCoach.role} {selectedCoach.name}
                    </p>
                    <p style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>
                        "{coachMessage}"
                    </p>
                </div>
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>분석 기준</p>
                        <span style={{
                            fontSize: '0.65rem',
                            padding: '2px 8px',
                            borderRadius: '20px',
                            background: `${selectedCoach.color}33`,
                            color: selectedCoach.color,
                            border: `1px solid ${selectedCoach.color}55`
                        }}>
                            {selectedCoach.tendency.toUpperCase()}
                        </span>
                    </div>
                    <p style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
                        <span style={{ color: selectedCoach.color, fontWeight: 'bold' }}>
                            {selectedCoach.id === 'apex' ? '한 달 최고 기록' :
                                selectedCoach.id === 'insight' ? '어제의 기록' :
                                    selectedCoach.id === 'atlas' ? '한 달 평균' :
                                        selectedCoach.id === 'swift' ? '일주일 평균' :
                                            selectedCoach.id === 'zen' ? '회복 페이스 기준' :
                                                selectedCoach.id === 'marathon' ? '목표 완성도 기준' :
                                                    '컨디션 지수'}
                        </span>
                    </p>
                    <div className="glass-card" style={{
                        padding: '1rem',
                        background: `${selectedCoach.color}11`,
                        border: `1px solid ${selectedCoach.color}33`
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <Award size={16} style={{ color: selectedCoach.color }} />
                            <p style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{recommendation.title}</p>
                        </div>
                        <p style={{ fontSize: '0.8rem', opacity: 0.8, lineHeight: 1.4 }}>{recommendation.detail}</p>
                    </div>
                </div>
                <button
                    onClick={onStart}
                    style={{
                        background: isRecording ? 'var(--core-dark)' : `linear-gradient(90deg, ${selectedCoach.color}, #BD00FF)`,
                        border: isRecording ? `1px solid ${selectedCoach.color}` : 'none',
                        padding: '1.3rem',
                        borderRadius: '18px',
                        color: 'white',
                        fontWeight: 'bold',
                        fontFamily: 'Outfit, sans-serif',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        marginTop: '1rem',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: isRecording ? 'none' : `0 10px 30px ${selectedCoach.color}44`,
                        transform: 'scale(1)',
                    }}
                    onMouseOver={(e) => !isRecording && (e.currentTarget.style.transform = 'scale(1.02)')}
                    onMouseOut={(e) => !isRecording && (e.currentTarget.style.transform = 'scale(1)')}
                >
                    {isRecording ? "러닝 종료하기" : `${selectedCoach.name} 코치의 상세 보고서`}
                </button>
            </div>
        </div>
    );
};

export default AICoachSidebar;
