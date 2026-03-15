import React from 'react';
import { Award, Activity, Info, TrendingUp, ShieldCheck, X } from 'lucide-react';

interface CoachReportModalProps {
    coach: any;
    coachMessage: string;
    recommendation: {
        title: string;
        detail: string;
        insight: string;
        mental: string;
    };
    periodStats: any;
    runnerProfile?: string;
    onClose: () => void;
}

const CoachReportModal: React.FC<CoachReportModalProps> = ({
    coach, coachMessage, recommendation, periodStats, runnerProfile, onClose
}) => {
    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(5, 5, 8, 0.95)',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '1.5rem',
            backdropFilter: 'blur(20px)',
            animation: 'fadeIn 0.4s ease-out'
        }}>
            <div className="glass-card" style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '95vw',
                maxWidth: '1000px',
                height: 'auto', // 고정 높이 대신 내용에 맞게
                maxHeight: '90vh', // 저해상도 대응
                display: 'flex',
                flexDirection: 'column',
                animation: 'fadeIn 0.4s ease',
                zIndex: 1000,
                padding: 0,
                overflow: 'hidden'
            }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1.5rem',
                        right: '1.5rem',
                        background: 'none',
                        border: 'none',
                        color: 'rgba(255,255,255,0.3)',
                        cursor: 'pointer'
                    }}
                >
                    <X size={24} />
                </button>

                {/* Coach Header Section */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem 2.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '24px',
                        background: `${coach.color}22`,
                        border: `2px solid ${coach.color}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '3rem'
                    }}>
                        {coach.emoji}
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.8rem', color: coach.color, marginBottom: '0.4rem' }}>{coach.name} 코칭 리포트</h2>
                        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.85rem', opacity: 0.6 }}>{coach.role}</span>
                            <span style={{
                                fontSize: '0.7rem',
                                padding: '2px 10px',
                                borderRadius: '20px',
                                border: `1px solid ${coach.color}66`,
                                color: coach.color,
                                fontWeight: 'bold',
                                textTransform: 'uppercase'
                            }}>
                                {coach.tendency}
                            </span>
                            {runnerProfile && runnerProfile !== 'UNKNOWN' && (
                                <span style={{
                                    fontSize: '0.7rem',
                                    padding: '2px 10px',
                                    borderRadius: '20px',
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    color: '#fff',
                                    fontWeight: 'bold'
                                }}>
                                    진단: {
                                        runnerProfile === 'AEROBIC_SIEVE' ? '유산소 누수형' :
                                        runnerProfile === 'MECHANICAL_BRAKE' ? '기계적 브레이크형' :
                                        runnerProfile === 'FATIGUE_SIGNATURE' ? '후반 붕괴형' :
                                        runnerProfile === 'EFFICIENT' ? '효율적 엔진형' : runnerProfile
                                    }
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content Area - Scrollable */}
                <div style={{ flex: 1, overflowY: 'auto', overscrollBehavior: 'contain', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Intelligence Analysis Section */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <div style={{ padding: '8px', background: 'rgba(0, 209, 255, 0.1)', borderRadius: '10px' }}>
                                <Activity size={20} color="#00D1FF" />
                            </div>
                            <h3 style={{ fontSize: '1.1rem', color: '#fff' }}>지능형 전략 분석</h3>
                        </div>

                        {periodStats && (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: '1rem',
                                marginBottom: '0.5rem'
                            }}>
                                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                                    <p style={{ fontSize: '0.75rem', opacity: 0.5, marginBottom: '0.6rem' }}>누적 주행 거리</p>
                                    <p style={{ fontSize: '1.4rem', fontWeight: 'bold', color: coach.color }}>{periodStats.totalDist.toFixed(1)}<span style={{ fontSize: '0.8rem', marginLeft: '2px' }}>km</span></p>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                                    <p style={{ fontSize: '0.75rem', opacity: 0.5, marginBottom: '0.6rem' }}>총 질주 시간</p>
                                    <p style={{ fontSize: '1.4rem', fontWeight: 'bold', color: coach.color }}>{periodStats.totalHours}<span style={{ fontSize: '0.8rem', marginLeft: '2px' }}>h</span></p>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                                    <p style={{ fontSize: '0.75rem', opacity: 0.5, marginBottom: '0.6rem' }}>평균 페이스</p>
                                    <p style={{ fontSize: '1.4rem', fontWeight: 'bold', color: coach.color }}>{periodStats.avgPaceStr}</p>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                                    <p style={{ fontSize: '0.75rem', opacity: 0.5, marginBottom: '0.6rem' }}>최근 심박 / 케이던스</p>
                                    <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: coach.color }}>
                                        {periodStats.lastHeartRate || '-'}<span style={{ fontSize: '0.7rem', opacity: 0.5 }}>bpm</span> / {periodStats.lastCadence || '-'}<span style={{ fontSize: '0.7rem', opacity: 0.5 }}>spm</span>
                                    </p>
                                </div>
                            </div>
                        )}

                        <div style={{
                            background: 'rgba(255,255,255,0.03)',
                            padding: '1.8rem',
                            borderRadius: '20px',
                            borderLeft: `6px solid ${coach.color}`,
                            lineHeight: 1.7,
                            boxShadow: `inset 0 0 20px ${coach.color}11`
                        }}>
                            <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.95)', fontWeight: 500 }}>
                                "{coachMessage}"
                            </p>
                        </div>
                    </div>

                    {/* Prescription & Deep Analysis Section */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                <div style={{ padding: '8px', background: 'rgba(57, 255, 20, 0.1)', borderRadius: '10px' }}>
                                    <TrendingUp size={20} color="#39ff14" />
                                </div>
                                <h3 style={{ fontSize: '1.1rem', color: '#fff' }}>전략적 처방 가이드</h3>
                            </div>
                            <div style={{
                                padding: '1.8rem',
                                background: `${coach.color}11`,
                                border: `1px solid ${coach.color}33`,
                                borderRadius: '20px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem',
                                height: '100%'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                    <Award size={22} style={{ color: coach.color }} />
                                    <p style={{ fontWeight: 'bold', fontSize: '1.1rem', color: coach.color }}>{recommendation.title}</p>
                                </div>
                                <p style={{ fontSize: '0.95rem', opacity: 0.85, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                                    {recommendation.detail}
                                </p>
                                <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '0.85rem' }}>
                                    <p style={{ color: coach.color, fontWeight: 'bold', marginBottom: '4px' }}>🔬 생체 역학 인사이트</p>
                                    <p style={{ opacity: 0.7 }}>{recommendation.insight}</p>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                <div style={{ padding: '8px', background: 'rgba(255, 215, 0, 0.1)', borderRadius: '10px' }}>
                                    <ShieldCheck size={20} color="#FFD700" />
                                </div>
                                <h3 style={{ fontSize: '1.1rem', color: '#fff' }}>마인드셋 & 멘탈 케어</h3>
                            </div>
                            <div style={{
                                padding: '1.8rem',
                                background: 'rgba(255,255,255,0.02)',
                                border: '1px solid rgba(255,255,255,0.05)',
                                borderRadius: '20px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem',
                                height: '100%'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                    <Info size={22} style={{ color: '#FFD700' }} />
                                    <p style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#FFD700' }}>{coach.name}의 한마디</p>
                                </div>
                                <p style={{ fontSize: '0.95rem', opacity: 0.85, lineHeight: 1.6 }}>
                                    {recommendation.mental}
                                </p>
                                <div style={{ marginTop: 'auto', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '12px', fontSize: '0.8rem', opacity: 0.6 }}>
                                    * 이 리포트는 런너님의 전체 {periodStats?.count || 0}개 세션과 최근 일주일 데이터를 정밀 분석하여 작성되었습니다.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer / Action Area - Simplified */}
                <div style={{ padding: '1.5rem 2.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.85rem', opacity: 0.5, margin: 0 }}>
                        전용 코칭 데이터는 런너님의 실제 질주 기록과 신체 스펙을 기반으로 매 세션마다 정밀하게 갱신됩니다.
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default CoachReportModal;
