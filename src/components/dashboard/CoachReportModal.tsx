import React from 'react';
import { Award, Activity, Info, TrendingUp, ShieldCheck, X, Lightbulb } from 'lucide-react';
import { getRandomRunningTip } from '../../utils/coachUtils';

interface CoachReportModalProps {
    coach: any;
    coachMessage: string;
    recommendation: {
        title: string;
        detail: string;
        insight: string;
        mental: string;
        vdotInfo?: {
            value: number;
            paces: {
                easy: string;
                marathon: string;
                threshold: string;
                interval: string;
                repetition: string;
            };
            currentIntensity: string;
        };
        initialDiagnosis?: {
            bmi: number;
            bmiCategory: string;
            advice: {
                issue: string;
                improvement: string;
                nextTask: string;
                insight: string;
                mental: string;
            };
        };
    };
    periodStats: any;
    runnerProfile?: string;
    onClose: () => void;
}

const CoachReportModal: React.FC<CoachReportModalProps> = ({
    coach, coachMessage, recommendation, periodStats, runnerProfile, onClose
}) => {
    const runningTip = React.useMemo(() => getRandomRunningTip(), []);

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

                        {/* Initial Diagnosis Illustration (NEW) */}
                        {recommendation.initialDiagnosis && (
                            <div style={{
                                background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.05) 0%, rgba(255, 75, 75, 0.05) 100%)',
                                borderRadius: '24px',
                                border: '1px solid rgba(255,255,255,0.08)',
                                padding: '1.5rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                        <div style={{ padding: '6px', background: 'rgba(255, 215, 0, 0.2)', borderRadius: '8px' }}>
                                            <TrendingUp size={18} color="#FFD700" />
                                        </div>
                                        <span style={{ fontSize: '1rem', fontWeight: '900', color: '#fff' }}>초기 신체 밸런스 점검: BMI {recommendation.initialDiagnosis.bmi.toFixed(1)}</span>
                                    </div>
                                    <span style={{ 
                                        fontSize: '0.75rem', 
                                        padding: '4px 12px', 
                                        borderRadius: '12px', 
                                        background: recommendation.initialDiagnosis.bmiCategory === 'NORMAL' ? 'rgba(57, 255, 20, 0.2)' : 'rgba(255, 75, 75, 0.2)', 
                                        color: recommendation.initialDiagnosis.bmiCategory === 'NORMAL' ? '#39ff14' : '#FF4B4B',
                                        fontWeight: 'bold'
                                    }}>
                                        분류: {recommendation.initialDiagnosis.bmiCategory}
                                    </span>
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.5', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '14px' }}>
                                    오늘 바로 운동장에 나가기보다, 런싱크 AI가 제안하는 **'첫 번째 질주 전략'**을 먼저 읽어보세요. 
                                    무게 중심과 관절 부하를 고려한 안전한 시작이 가장 빠른 단축의 길입니다.
                                </div>
                            </div>
                        )}

                        {/* VDOT Intelligence Card (NEW) */}
                        {recommendation.vdotInfo && (
                            <div style={{
                                background: 'linear-gradient(135deg, rgba(0, 209, 255, 0.05) 0%, rgba(57, 255, 20, 0.05) 100%)',
                                borderRadius: '24px',
                                border: '1px solid rgba(255,255,255,0.08)',
                                padding: '1.5rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                        <div style={{ padding: '6px', background: 'rgba(0, 209, 255, 0.2)', borderRadius: '8px' }}>
                                            <Award size={18} color="#00D1FF" />
                                        </div>
                                        <span style={{ fontSize: '1rem', fontWeight: '900', color: '#fff', letterSpacing: '0.5px' }}>런싱크 VDOT 레이싱 지수: {recommendation.vdotInfo.value.toFixed(1)}</span>
                                    </div>
                                    <span style={{ 
                                        fontSize: '0.75rem', 
                                        padding: '4px 12px', 
                                        borderRadius: '12px', 
                                        background: 'rgba(57, 255, 20, 0.2)', 
                                        color: '#39ff14',
                                        fontWeight: 'bold',
                                        border: '1px solid rgba(57, 255, 20, 0.3)'
                                    }}>
                                        분석 강도: {recommendation.vdotInfo.currentIntensity}
                                    </span>
                                </div>

                                <div style={{ 
                                    display: 'grid', 
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', 
                                    gap: '0.8rem' 
                                }}>
                                    {[
                                        { label: '조깅 (Easy)', pace: recommendation.vdotInfo.paces.easy, color: '#39ff14' },
                                        { label: '마라톤 (M)', pace: recommendation.vdotInfo.paces.marathon, color: '#00D1FF' },
                                        { label: '역치 (T)', pace: recommendation.vdotInfo.paces.threshold, color: '#FFD700' },
                                        { label: '인터벌 (I)', pace: recommendation.vdotInfo.paces.interval, color: '#FF4B4B' },
                                        { label: '레피티션 (R)', pace: recommendation.vdotInfo.paces.repetition, color: '#BD00FF' }
                                    ].map((p, idx) => (
                                        <div key={idx} style={{ 
                                            background: 'rgba(0,0,0,0.3)', 
                                            padding: '0.8rem', 
                                            borderRadius: '14px', 
                                            border: '1px solid rgba(255,255,255,0.03)',
                                            textAlign: 'center'
                                        }}>
                                            <div style={{ fontSize: '0.65rem', opacity: 0.5, marginBottom: '4px' }}>{p.label}</div>
                                            <div style={{ fontSize: '1.05rem', fontWeight: '900', color: p.color }}>{p.pace}</div>
                                        </div>
                                    ))}
                                </div>
                                <p style={{ fontSize: '0.75rem', opacity: 0.5, margin: 0, textAlign: 'center' }}>
                                    * 잭 대니얼스의 VDOT 공식에 기반한 과학적 추천 페이스입니다. 훈련 목적에 맞춰 활용하세요.
                                </p>
                            </div>
                        )}
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
                            </div>

                            {/* Running Tip Section */}
                            <div style={{
                                padding: '1.5rem',
                                background: 'linear-gradient(135deg, rgba(0, 209, 255, 0.05) 0%, rgba(0, 209, 255, 0.02) 100%)',
                                border: '1px solid rgba(0, 209, 255, 0.1)',
                                borderRadius: '20px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.8rem'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                    <Lightbulb size={20} style={{ color: '#00D1FF' }} />
                                    <p style={{ fontWeight: 'bold', fontSize: '1rem', color: '#00D1FF' }}>오늘의 러닝 팁: {runningTip.title}</p>
                                </div>
                                <p style={{ fontSize: '0.85rem', opacity: 0.7, lineHeight: 1.5 }}>
                                    {runningTip.content}
                                </p>
                            </div>

                            <div style={{ marginTop: 'auto', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '12px', fontSize: '0.8rem', opacity: 0.6 }}>
                                * 이 리포트는 런너님의 전체 {periodStats?.count || 0}개 세션과 최근 일주일 데이터를 정밀 분석하여 작성되었습니다.
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
