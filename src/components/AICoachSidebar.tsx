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

                {/* Running Tip Section */}
                <div style={{
                    marginTop: '2rem',
                    padding: '1.2rem',
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: '16px',
                    border: '1px dashed rgba(255, 255, 255, 0.1)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '-10px',
                        right: '-10px',
                        fontSize: '3rem',
                        opacity: 0.05,
                        transform: 'rotate(15deg)'
                    }}>💡</div>
                    <p style={{
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        color: selectedCoach.color,
                        marginBottom: '0.6rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                    }}>
                        <span>💡</span> 오늘의 런닝 팁
                    </p>
                    <p style={{
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        marginBottom: '0.4rem',
                        color: 'white'
                    }}>
                        {selectedCoach.id === 'apex' ? "케이던스의 비밀" :
                         selectedCoach.id === 'insight' ? "지면 반발력 활용" :
                         selectedCoach.id === 'atlas' ? "심박수 Zone 2의 마법" :
                         selectedCoach.id === 'swift' ? "팔 스윙의 리듬" :
                         selectedCoach.id === 'zen' ? "횡격막 호흡법" :
                         selectedCoach.id === 'marathon' ? "미드풋 착지의 경제성" :
                         "올바른 수분 보충"}
                    </p>
                    <p style={{
                        fontSize: '0.75rem',
                        opacity: 0.7,
                        lineHeight: 1.5
                    }}>
                        {selectedCoach.id === 'apex' ? "케이던스를 180spm 이상으로 유지하면 충격 전이가 분산되어 부상을 방지하고 속도를 유지하는 데 유리합니다." :
                         selectedCoach.id === 'insight' ? "지면을 세게 미는 것이 아니라, 지면이 밀어내는 반발력을 이용하여 가볍게 튕겨 오르듯 달리세요." :
                         selectedCoach.id === 'atlas' ? "최대 심박의 60-70% 수준인 Zone 2 훈련은 미토콘드리아의 밀도를 높여 장거리 효율성을 극대화합니다." :
                         selectedCoach.id === 'swift' ? "팔을 뒤로 치는 동작에 집중하세요. 팔의 리듬이 골반의 회전을 유도하여 자연스러운 추진력을 만듭니다." :
                         selectedCoach.id === 'zen' ? "복식 호흡을 통해 폐의 하단까지 공기를 채우세요. 이는 심박수를 안정시키고 체내 산소 공급을 원활하게 합니다." :
                         selectedCoach.id === 'marathon' ? "발의 앞부분이나 뒷부분이 아닌 중간으로 착지하세요. 이는 에너지를 탄성으로 전환하는 가장 경제적인 방법입니다." :
                         "갈증을 느끼기 15분 전부터 조금씩 자주 물을 마시는 것이 체온 조절과 근육 경련 방지에 효과적입니다."}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AICoachSidebar;
