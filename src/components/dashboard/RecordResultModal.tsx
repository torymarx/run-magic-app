
import React from 'react';
import { History, Calendar as CalIcon, Scale, Wind, Flame, ArrowUpRight, ArrowDownRight, X, Sun, Cloud, CloudRain, Snowflake, Smile, Meh, Frown } from 'lucide-react';

interface RecordResultModalProps {
    record: any;
    onClose: () => void;
}

const RecordResultModal: React.FC<RecordResultModalProps> = ({ record, onClose }) => {
    const getWeatherIcon = (type: string) => {
        switch (type) {
            case 'sun': return <Sun size={14} />;
            case 'cloud': return <Cloud size={14} />;
            case 'rain': return <CloudRain size={14} />;
            case 'snow': return <Snowflake size={14} />;
            default: return <Sun size={14} />;
        }
    };

    const getConditionIcon = (type: string) => {
        switch (type) {
            case 'great': return <Smile size={14} color="#00FF85" />;
            case 'good': return <Smile size={14} />;
            case 'soso': return <Meh size={14} />;
            case 'bad': return <Frown size={14} />;
            default: return <Smile size={14} />;
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            zIndex: 1100,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '1rem',
            backdropFilter: 'blur(10px)',
            animation: 'fadeIn 0.3s ease'
        }}>
            <div className="glass-card" style={{
                width: '100%',
                maxWidth: '800px',
                maxHeight: '90vh', // 저해상도 대응
                overflowY: 'auto', // 저해상도 대응
                overscrollBehavior: 'contain',
                border: '1px solid var(--electric-blue)',
                animation: 'slideUp 0.4s ease',
                background: 'rgba(5, 5, 10, 0.95)',
                padding: '2rem',
                position: 'relative'
            }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                        opacity: 0.5,
                        zIndex: 10
                    }}
                >
                    <X size={24} />
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem' }}>
                            <h3 className="neon-text-blue" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                                <History size={20} /> 정밀 분석 보고서 (v3.0)
                            </h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', fontSize: '0.8rem', opacity: 0.8 }}>
                                <span className="glass-card" style={{ padding: '2px 8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <CalIcon size={12} /> {record.date} {record.time}
                                </span>
                                <span className="glass-card" style={{ padding: '2px 8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    {getWeatherIcon(record.weather)} {record.temp}°C
                                </span>
                                <span className="glass-card" style={{ padding: '2px 8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Scale size={12} /> {record.weight}kg
                                </span>
                                <span className="glass-card" style={{ padding: '2px 8px', display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid var(--neon-green)' }}>
                                    {getConditionIcon(record.condition)} 컨디션
                                </span>
                                {record.dust && (
                                    <span className="glass-card" style={{
                                        padding: '2px 8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        color: record.dust === 'good' ? '#00FF85' : record.dust === 'soso' ? '#FFD700' : '#FF4B4B'
                                    }}>
                                        <Wind size={12} /> 미세먼지 {record.dust === 'good' ? '좋음' : record.dust === 'soso' ? '보통' : '나쁨'}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1.5rem' }}>
                            <div>
                                <p style={{ fontSize: '0.75rem', opacity: 0.6 }}>총 거리</p>
                                <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{record.distance} km</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.75rem', opacity: 0.6 }}>총 시간</p>
                                <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{record.totalTime}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.75rem', opacity: 0.6 }}>평균 페이스</p>
                                <p className="neon-text-blue" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{record.pace}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.75rem', opacity: 0.6 }}>소모 칼로리</p>
                                <p className="neon-text-green" style={{ fontSize: '1.2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                    <Flame size={18} /> {record.calories} kcal
                                </p>
                            </div>
                        </div>

                        <div style={{ marginTop: '1.2rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', fontSize: '0.9rem', lineHeight: 1.6 }}>
                            <p style={{ color: record.isImproved ? 'var(--neon-green)' : 'var(--electric-blue)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                                {record.isImproved ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                                <span>
                                    <strong>[코다리 부장의 한마디]: </strong>
                                    {record.temp >= 30
                                        ? `폭염(${record.temp}°C) 속에서 ${record.distance}km를 완주하신 런너님의 열정은 그 누구도 못 말립니다! 하지만 수분 섭취는 필수예요! 🐟💧`
                                        : record.temp !== undefined && record.temp < 0
                                            ? `영하의 날씨에도 러닝을 멈추지 않는 런너님! 체온 유지에 신경 써주세요. 기록보다 건강이 우선입니다! ❄️🫡`
                                            : record.condition === 'bad'
                                                ? "컨디션이 안 좋으셨음에도 기록을 단축하시다니... 런너님의 정신력에 감탄했습니다! 🐟"
                                                : `${record.weight}kg의 신체 데이터를 바탕으로 산출된 칼로리 소모량은 매우 정밀합니다. 효율적인 러닝이었어요! ✨`}
                                </span>
                            </p>
                            {record.memo && (
                                <div style={{ marginTop: '0.8rem', paddingTop: '0.8rem', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '0.85rem', opacity: 0.8, fontStyle: 'italic' }}>
                                    " {record.memo} "
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecordResultModal;
