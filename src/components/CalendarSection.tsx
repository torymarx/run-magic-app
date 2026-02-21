import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Trash2, Plus, History as HistIcon } from 'lucide-react';
import { parseTimeToSeconds, formatSecondsToTime } from '../utils/calculations';

interface Record {
    id: number;
    date: string;
    time: string;
    distance: number;
    pace: string;
    calories: number;
    weather: string;
    condition: string;
    temp?: number;
    weight?: number;
    dust?: string;
    memo?: string;
    isImproved?: boolean;
    paceDiff?: string;
}

interface CalendarSectionProps {
    records: Record[];
    onDelete?: (id: number) => void;
    onEdit?: (record: Record) => void;
    onViewDetails?: (record: Record) => void;
    onAddNew?: (date: Date) => void;
    viewingDate: Date;
    onDateChange: (date: Date) => void;
}

const CalendarSection: React.FC<CalendarSectionProps> = ({ records, onDelete, onEdit, onViewDetails, onAddNew, viewingDate, onDateChange }) => {

    // 특정 날짜에 기록이 있는지 확인하는 함수 (배열 반환)
    const getRecordsForDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        return Array.isArray(records) ? records.filter(r => r.date === dateStr) : [];
    };

    // 달력 타일에 점 및 시간박스 표시
    const tileContent = ({ date, view }: { date: Date, view: string }) => {
        if (view === 'month') {
            const dayRecords = getRecordsForDate(date);
            if (dayRecords.length > 0) {
                const totalSeconds = dayRecords.reduce((sum, r) => sum + parseTimeToSeconds(r.time), 0);
                const hasZeroTime = dayRecords.some(r => parseTimeToSeconds(r.time) === 0);
                const color = hasZeroTime ? '#FFAA00' : (dayRecords.length >= 2 ? 'var(--electric-blue)' : 'var(--neon-green)');

                return (
                    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                        <div style={{
                            height: '4px',
                            width: '4px',
                            background: color,
                            borderRadius: '50%',
                            margin: '1px auto 2px',
                            boxShadow: `0 0 6px ${color}`
                        }} />
                        <div style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: `1px solid ${color}44`,
                            borderRadius: '4px',
                            padding: '1px 3px',
                            fontSize: '9px',
                            color: color,
                            fontWeight: 'bold',
                            marginTop: '1px',
                            backdropFilter: 'blur(4px)',
                            minWidth: '32px',
                            textAlign: 'center'
                        }}>
                            {formatSecondsToTime(totalSeconds)}
                        </div>
                    </div>
                );
            }
        }
        return null;
    };

    const selectedRecords = getRecordsForDate(viewingDate);

    return (
        <div className="glass-card" style={{ padding: '1.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <style>{`
                .react-calendar {
                    background: transparent !important;
                    border: none !important;
                    width: 100% !important;
                    color: white !important;
                    font-family: inherit !important;
                }
                .react-calendar__tile {
                    color: white !important;
                    height: 50px !important;
                    display: flex !important;
                    flex-direction: column !important;
                    align-items: center !important;
                    justify-content: center !important;
                    transition: all 0.2s !important;
                }
                .react-calendar__tile--active {
                    background: linear-gradient(135deg, #00D1FF, #BD00FF) !important;
                    color: white !important;
                    border-radius: 12px !important;
                    box-shadow: 0 0 15px rgba(0, 209, 255, 0.4);
                }
                .react-calendar__tile--active:enabled:hover,
                .react-calendar__tile--active:enabled:focus {
                    background: linear-gradient(135deg, #00D1FF, #BD00FF) !important;
                }
                .react-calendar__tile--now {
                    background: rgba(255, 255, 255, 0.05) !important;
                    border-radius: 12px !important;
                }
                .react-calendar__navigation button {
                    color: white !important;
                    min-width: 44px;
                    background: none !important;
                    background-image: none !important;
                    font-size: 16px;
                    margin-top: 8px;
                }
                .react-calendar__navigation button:enabled:hover,
                .react-calendar__navigation button:enabled:focus {
                    background-color: rgba(255, 255, 255, 0.05) !important;
                }
                .react-calendar__month-view__weekdays__weekday abbr {
                    text-decoration: none !important;
                    color: rgba(255, 255, 255, 0.4) !important;
                    font-size: 0.7rem;
                }
                .react-calendar__tile--no-record {
                    color: #FFAA00 !important; /* Deep Orange for no records */
                    opacity: 0.7;
                }
                .react-calendar__tile--has-record {
                    color: white !important;
                    font-weight: bold;
                }
            `}</style>
            <h3 className="neon-text-blue" style={{ marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.6rem', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <CalendarIcon size={20} /> 트레이닝 캘린더
                </div>
                <button
                    onClick={() => onAddNew?.(viewingDate)}
                    disabled={viewingDate > new Date()}
                    style={{
                        background: viewingDate > new Date() ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: viewingDate > new Date() ? 'rgba(255,255,255,0.2)' : 'white',
                        padding: '4px 8px',
                        cursor: viewingDate > new Date() ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.75rem'
                    }}
                >
                    <Plus size={14} /> 추가
                </button>
            </h3>

            <div className="calendar-container" style={{ flex: 1 }}>
                <Calendar
                    onChange={(val) => onDateChange(val as Date)}
                    value={viewingDate}
                    tileContent={tileContent}
                    tileClassName={({ date, view }) => {
                        if (view === 'month' && Array.isArray(records)) {
                            const dayRecords = getRecordsForDate(date);
                            const hasRecord = dayRecords && dayRecords.length > 0;
                            const hasZeroTime = hasRecord && dayRecords.some(r => parseTimeToSeconds(r.time) === 0);

                            if (hasZeroTime) return 'react-calendar__tile--no-record';
                            return hasRecord ? 'react-calendar__tile--has-record' : 'react-calendar__tile--no-record';
                        }
                        return null;
                    }}
                    next2Label={null}
                    prev2Label={null}
                    prevLabel={<span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronLeft size={20} /></span>}
                    nextLabel={<span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronRight size={20} /></span>}
                    calendarType="gregory"
                    formatDay={(_, d) => d.getDate().toString()}
                    maxDate={new Date()}
                />
            </div>

            <div style={{ marginTop: '1.5rem', flex: 1, overflowY: 'auto', maxHeight: '250px', paddingRight: '0.5rem' }}>
                <div style={{ fontSize: '0.9rem', marginBottom: '0.8rem', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{viewingDate.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })} 기록</span>
                    <span style={{ opacity: 0.6, fontSize: '0.8rem' }}>{selectedRecords.length}개 세션</span>
                </div>

                {selectedRecords.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        {selectedRecords.map((r, idx) => (
                            <div
                                key={r.id}
                                onClick={() => onEdit?.(r)}
                                style={{
                                    background: 'rgba(255,255,255,0.03)',
                                    padding: '1rem',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    position: 'relative',
                                    animation: 'fadeIn 0.3s ease'
                                }}
                                className="glass-card session-card"
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                                    <span style={{ color: 'var(--electric-blue)', fontWeight: 'bold' }}>#{idx + 1} 세션 ({r.time})</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onViewDetails?.(r); }}
                                            style={{ border: 'none', color: 'var(--electric-blue)', cursor: 'pointer', opacity: 0.8, padding: '4px 8px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(0, 209, 255, 0.1)', borderRadius: '6px' }}
                                        >
                                            <HistIcon size={12} /> 레이스 요약
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onDelete?.(r.id); }} // Prevent card click when deleting
                                            style={{ background: 'none', border: 'none', color: '#ff4b4b', cursor: 'pointer', opacity: 0.4, padding: '2px' }}
                                            title="삭제"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', fontSize: '0.8rem', opacity: 0.8 }}>
                                    <div>📏 {r.distance}km</div>
                                    <div>⚡ {r.pace}</div>
                                    <div>🔥 {r.calories}kcal</div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{
                        textAlign: 'center',
                        padding: '2rem 1.5rem',
                        opacity: 0.8,
                        fontSize: '0.85rem',
                        border: '1px dashed rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '1rem'
                    }}>
                        <div style={{ opacity: 0.4 }}>기록이 없습니다.</div>
                        <button
                            onClick={() => onAddNew?.(viewingDate)}
                            disabled={viewingDate > new Date()}
                            style={{
                                background: viewingDate > new Date() ? 'rgba(255,255,255,0.1)' : 'linear-gradient(90deg, #00D1FF, #BD00FF)',
                                border: 'none',
                                color: viewingDate > new Date() ? 'rgba(255,255,255,0.3)' : 'white',
                                padding: '0.6rem 1.2rem',
                                borderRadius: '10px',
                                cursor: viewingDate > new Date() ? 'not-allowed' : 'pointer',
                                fontWeight: 'bold',
                                fontSize: '0.8rem',
                                boxShadow: viewingDate > new Date() ? 'none' : '0 4px 10px rgba(0, 209, 255, 0.2)'
                            }}
                        >
                            {viewingDate > new Date() ? "미래는 질주할 수 없습니다" : "오늘의 질주 기록하기"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CalendarSection;
