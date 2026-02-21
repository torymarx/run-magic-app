import React, { useState, useRef, useEffect, useMemo } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import {
    Plus, Trash2, Save, X, Clock, Sun, Cloud,
    CloudRain, Snowflake, Smile, Meh, Frown, Thermometer, Scale, Wind
} from 'lucide-react';

interface ManualRecordFormProps {
    onSave: (record: any) => void;
    onCancel: () => void;
    onDelete?: (id: number) => void;
    lastRecord?: any;
    allRecords?: any[];
    initialDate?: string | null;
    isCloudConnected?: boolean;
}

const ManualRecordForm: React.FC<ManualRecordFormProps> = ({ onSave, onCancel, onDelete, lastRecord, allRecords = [], initialDate, isCloudConnected = false }) => {
    const [distance, setDistance] = useState<number>(lastRecord?.distance || 3);
    const [splits, setSplits] = useState<string[]>(lastRecord?.splits || ['06:33', '06:52', '06:44']);
    // v8.9: UTC가 아닌 로컬 타임(KST) 기준 날짜 생성 (오전 러닝 날짜 오류 수정)
    const getLocalDate = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    const [date, setDate] = useState<string>(initialDate || getLocalDate());
    const [time, setTime] = useState<string>(lastRecord?.time || "06:00");
    const [weather, setWeather] = useState<string>(lastRecord?.weather || 'sun');
    const [condition, setCondition] = useState<string>(lastRecord?.condition || 'good');
    const [temp, setTemp] = useState<number>(lastRecord?.temp || 18);
    const [weight, setWeight] = useState<number>(lastRecord?.weight ? parseFloat(lastRecord.weight.toString()) : 70.0);
    const [dust, setDust] = useState<string>(lastRecord?.dust || 'good');
    const [memo, setMemo] = useState<string>('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false); // v13.1: 중복 클릭 방지

    // v8.2: 더티 체킹을 위한 원본 데이터 저장
    const [originalData, setOriginalData] = useState<any>(null);

    const getCurrentFormData = () => ({
        distance, splits, date, time, weather, condition, temp, weight, dust, memo
    });

    const isDirty = useMemo(() => {
        if (!originalData) return false;
        const current = getCurrentFormData();
        return JSON.stringify(current) !== JSON.stringify(originalData);
    }, [distance, splits, date, time, weather, condition, temp, weight, dust, memo, originalData]);

    const splitRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        splitRefs.current = splitRefs.current.slice(0, splits.length);
    }, [splits]);

    // 초기 마운트 시 originalData 설정
    useEffect(() => {
        if (!originalData) {
            setOriginalData(getCurrentFormData());
        }
    }, []);

    // 외부에서 편집 기록이 전달될 때 (App.tsx -> lastRecord) 상태 동기화
    useEffect(() => {
        if (lastRecord && lastRecord.id) {
            handleSelectForEdit(lastRecord);
        }
    }, [lastRecord]);

    // 메인 달력에서 날짜를 선택해서 들어왔을 때 처리
    useEffect(() => {
        if (initialDate && !editingId) {
            const newDate = new Date(initialDate);
            handleDateChange(newDate);
        }
    }, [initialDate]);


    const handleAddSplit = () => {
        setSplits([...splits, '06:00']);
        setDistance(splits.length + 1);
    };

    const handleRemoveSplit = (index: number) => {
        const newSplits = splits.filter((_, i) => i !== index);
        setSplits(newSplits);
        setDistance(newSplits.length);
    };

    const handleSplitChange = (index: number, value: string) => {
        let formattedValue = value.replace(/[^0-9:]/g, '');

        // 4자리 숫자(0650) 입력 시 자동 콜론(06:50) 삽입 및 다음 포커스
        if (formattedValue.length === 4 && !formattedValue.includes(':')) {
            formattedValue = `${formattedValue.slice(0, 2)}:${formattedValue.slice(2)}`;

            // 다음 인풋으로 자동 포커스 이동
            setTimeout(() => {
                if (splitRefs.current[index + 1]) {
                    splitRefs.current[index + 1]?.focus();
                }
            }, 10);
        }

        const newSplits = [...splits];
        newSplits[index] = formattedValue;
        setSplits(newSplits);
    };

    const handleResetToNew = (selectedDate: Date) => {
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDate.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        setEditingId(null);
        setDistance(lastRecord?.distance || 3);
        setSplits(lastRecord?.splits || ['06:33', '06:52', '06:44']);
        setDate(dateStr);
        setTime(lastRecord?.time || "06:00");
        setWeather(lastRecord?.weather || 'sun');
        setCondition(lastRecord?.condition || 'good');
        setTemp(lastRecord?.temp || 18);
        setWeight(lastRecord?.weight ? parseFloat(lastRecord.weight.toString()) : 70.0);
        setDust(lastRecord?.dust || 'good');
        setMemo('');

        // 원본 데이터를 현재 값으로 설정하여 Dirty 해제
        const data = {
            distance: lastRecord?.distance || 3,
            splits: lastRecord?.splits || ['06:33', '06:52', '06:44'],
            date: dateStr,
            time: lastRecord?.time || "06:00",
            weather: lastRecord?.weather || 'sun',
            condition: lastRecord?.condition || 'good',
            temp: lastRecord?.temp || 18,
            weight: lastRecord?.weight ? parseFloat(lastRecord.weight.toString()) : 70.0,
            dust: lastRecord?.dust || 'good',
            memo: ''
        };
        setOriginalData(data);
    };

    const handleDateChange = async (newDate: Date) => {
        // v8.9: 미래 날짜 선택 방지
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        if (newDate > today) return;

        if (isDirty) {
            if (window.confirm("수정 중인 내용이 있습니다. 저장하고 이동할까요?\n(취소 시 변경사항은 사라집니다.)")) {
                handleSubmit(new Event('submit') as any);
            }
        }

        const year = newDate.getFullYear();
        const month = String(newDate.getMonth() + 1).padStart(2, '0');
        const day = String(newDate.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        setSelectedDate(newDate);

        const recordsOnDate = allRecords.filter(r => r.date === dateStr);
        if (recordsOnDate.length > 0) {
            handleSelectForEdit(recordsOnDate[0]); // 첫 번째 기록 로드 (수정 모드)
        } else {
            handleResetToNew(newDate); // 신규 입력 모드
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSaving) return;

        setIsSaving(true);
        try {
            await onSave({
                id: editingId, // 수정 시 id 포함, 신규 시 null
                distance,
                splits,
                date,
                time,
                weather,
                condition,
                temp,
                weight: parseFloat(weight.toString()), // 080.6 방지 및 숫자 보장
                dust,
                memo
            });

            // 저장이 완료되면 수정 모드 초기화 (부모에서 닫히지 않을 경우를 대비)
            setEditingId(null);

            // v8.2: 원본 데이터를 현재 상태로 동기화하여 Dirty 해제
            setOriginalData(getCurrentFormData());

            // v8.1: 저장 완료 피드백 표시
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 2000);
        } catch (error) {
            console.error("저장 중 오류 발생:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleSelectForEdit = (r: any) => {
        setEditingId(r.id);
        setDistance(r.distance);
        setSplits(r.splits || []);
        setDate(r.date);
        setTime(r.time);
        setWeather(r.weather);
        setCondition(r.condition);
        setTemp(r.temp);
        setWeight(parseFloat(r.weight.toString()));
        setDust(r.dust);
        setMemo(r.memo || '');
        setSelectedDate(new Date(r.date));

        // v8.2: 로드된 시점의 원본 데이터 저장 (ID 포함하지 않음 - 비교 대상인 input 필드들만)
        setOriginalData({
            distance: r.distance,
            splits: r.splits || [],
            date: r.date,
            time: r.time,
            weather: r.weather,
            condition: r.condition,
            temp: r.temp,
            weight: parseFloat(r.weight.toString()),
            dust: r.dust,
            memo: r.memo || ''
        });
    };

    const handleReset = () => {
        setEditingId(null);
        // 기본값으로 복구하거나 그냥 모드만 해제 (현재는 모드만 해제하여 수동 수정을 유지)
    };

    const weatherIcons = [
        { id: 'sun', icon: <Sun size={18} />, label: '맑음' },
        { id: 'cloud', icon: <Cloud size={18} />, label: '흐림' },
        { id: 'rain', icon: <CloudRain size={18} />, label: '비' },
        { id: 'snow', icon: <Snowflake size={18} />, label: '눈' },
    ];

    const conditionIcons = [
        { id: 'great', icon: <Smile size={20} color="#00FF85" />, label: '최상' },
        { id: 'good', icon: <Smile size={20} />, label: '좋음' },
        { id: 'soso', icon: <Meh size={20} />, label: '보통' },
        { id: 'bad', icon: <Frown size={20} />, label: '힘듦' },
    ];

    const dustOptions = [
        { id: 'good', label: '좋음', color: '#00FF85' },
        { id: 'soso', label: '보통', color: '#FFD700' },
        { id: 'bad', label: '나쁨', color: '#FF4B4B' },
    ];

    const [selectedDate, setSelectedDate] = useState<Date>(new Date(date));

    // 특정 날짜의 기록 가져오기 (달력 표시용)
    const getRecordsForDate = (d: Date) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        return allRecords.filter(r => r.date === dateStr);
    };

    const tileContent = ({ date, view }: { date: Date, view: string }) => {
        if (view === 'month') {
            const dayRecords = getRecordsForDate(date);
            if (dayRecords.length > 0) {
                const color = dayRecords.length >= 2 ? 'var(--electric-blue)' : 'var(--neon-green)';
                return (
                    <div style={{
                        height: '4px',
                        width: '4px',
                        background: color,
                        borderRadius: '50%',
                        margin: '1px auto 0',
                        boxShadow: `0 0 4px ${color}`
                    }} />
                );
            }
        }
        return null;
    };

    // 커스텀 스텝퍼 컴포넌트
    const Stepper = ({ label, value, onChange, step, unit, icon }: any) => (
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.8rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', opacity: 0.6, marginBottom: '0.6rem' }}>
                {icon} {label}
            </label>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                <button
                    type="button"
                    onClick={() => onChange(Number((value - step).toFixed(1)))}
                    style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', color: 'white', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    -
                </button>
                <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--electric-blue)' }}>{value}</span>
                    <span style={{ fontSize: '0.7rem', opacity: 0.5, marginLeft: '2px' }}>{unit}</span>
                </div>
                <button
                    type="button"
                    onClick={() => onChange(Number((value + step).toFixed(1)))}
                    style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', color: 'white', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    +
                </button>
            </div>
        </div>
    );

    const formatTimeWithAMPM = (timeStr: string) => {
        if (!timeStr) return "";
        const [hours, minutes] = timeStr.split(':').map(Number);
        const ampm = hours >= 12 ? '오후' : '오전';
        const displayHours = hours % 12 || 12;
        return `${ampm} ${displayHours}시 ${minutes}분`;
    };

    return (
        <div className="glass-card" style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '95vw',
            maxWidth: '1000px',
            maxHeight: '90vh', // 85vh에서 90vh로 유연성 확대
            height: 'auto', // 고정 높이 대신 내용에 맞게 조정
            display: 'flex',
            flexDirection: 'column',
            animation: 'fadeIn 0.4s ease',
            zIndex: 1000,
            padding: 0,
            overflow: 'hidden'
        }}>
            <style>{`
                .react-calendar {
                    background: transparent !important;
                    border: none !important;
                    width: 100% !important;
                    color: white !important;
                }
                .react-calendar__tile {
                    color: white !important;
                    height: 50px !important;
                    display: flex !important;
                    flex-direction: column !important;
                    align-items: center !important;
                    justify-content: center !important;
                    transition: all 0.2s !important;
                    position: relative;
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
                    background: none;
                    font-size: 16px;
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
            `}</style>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <h3 className="neon-text-blue" style={{ margin: 0, fontSize: '1.1rem' }}>
                        {editingId ? '📝 기록 수정 모드' : '🏁 정밀 러닝 기록 & 히스토리 (v7.4)'}
                    </h3>
                    {editingId && (
                        <button
                            onClick={handleReset}
                            style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '4px', color: 'white', cursor: 'pointer' }}
                        >
                            신규 입력으로 전환
                        </button>
                    )}
                </div>
                <button onClick={onCancel} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', opacity: 0.6 }}>
                    <X size={20} />
                </button>
            </div>

            {/* DB Connection Status Indicator */}
            <div style={{ position: 'absolute', top: '1.5rem', right: '4rem', display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(0,0,0,0.3)', padding: '4px 8px', borderRadius: '12px', border: '1px solid isset', borderColor: isCloudConnected ? 'rgba(0, 255, 133, 0.3)' : 'rgba(255, 75, 75, 0.3)' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: isCloudConnected ? '#00FF85' : '#FF4B4B', boxShadow: isCloudConnected ? '0 0 8px #00FF85' : 'none' }} />
                <span style={{ fontSize: '0.7rem', color: isCloudConnected ? '#00FF85' : '#FF4B4B', opacity: 0.8 }}>
                    {isCloudConnected ? "Cloud Sync On" : "Local Mode"}
                </span>
            </div>

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                {/* Left Side: Calendar & Quick Summary */}
                <div style={{ flex: 1.2, padding: '1.5rem', borderRight: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)', overflowY: 'auto', overscrollBehavior: 'contain' }}>
                    <div className="calendar-container premium-calendar">
                        <Calendar
                            onChange={(val) => handleDateChange(val as Date)}
                            value={selectedDate}
                            tileContent={tileContent}
                            calendarType="gregory"
                            formatDay={(_, d) => d.getDate().toString()}
                            maxDate={new Date()}
                        />
                    </div>

                    <div style={{ marginTop: '1.5rem' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.8rem', opacity: 0.8 }}>
                            {selectedDate.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}의 기록
                        </div>
                        {getRecordsForDate(selectedDate).length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                {getRecordsForDate(selectedDate).map((r: any, i: number) => (
                                    <div
                                        key={i}
                                        onClick={() => handleSelectForEdit(r)}
                                        style={{
                                            background: editingId === r.id ? 'rgba(0, 209, 255, 0.15)' : 'rgba(255,255,255,0.03)',
                                            border: editingId === r.id ? '1px solid var(--electric-blue)' : '1px solid transparent',
                                            padding: '0.8rem',
                                            borderRadius: '10px',
                                            fontSize: '0.8rem',
                                            position: 'relative',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                            <span style={{ color: 'var(--neon-green)' }}>{r.distance}km</span>
                                            <span style={{ opacity: 0.5 }}>{r.time}</span>
                                        </div>
                                        <div style={{ opacity: 0.6 }}>페이스: {r.pace} | 날씨: {r.weather}</div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onDelete?.(r.id); }}
                                            style={{ position: 'absolute', right: '4px', bottom: '4px', background: 'none', border: 'none', color: '#ff4b4b', cursor: 'pointer', opacity: 0.3 }}
                                            title="삭제"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ padding: '1rem', textAlign: 'center', opacity: 0.3, fontSize: '0.8rem', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '10px' }}>
                                저장된 기록이 없습니다.
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side: Data Entry Form */}
                <div style={{ flex: 1, padding: '1.5rem 2rem', overflowY: 'auto', background: 'rgba(255,255,255,0.01)', overscrollBehavior: 'contain' }}>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', opacity: 0.6, marginBottom: '0.5rem' }}>
                                <Clock size={14} /> 시작 시간
                                <span style={{ marginLeft: 'auto', color: 'var(--electric-blue)', fontWeight: 'bold' }}>{formatTimeWithAMPM(time)}</span>
                            </label>
                            <input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                style={{
                                    width: '100%',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    padding: '0.8rem',
                                    borderRadius: '8px',
                                    color: 'white',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>

                        {/* Bio-Data Steppers */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                            <Stepper
                                label="기온"
                                value={temp}
                                onChange={setTemp}
                                step={1}
                                unit="°C"
                                icon={<Thermometer size={14} />}
                            />
                            <Stepper
                                label="몸무게"
                                value={weight}
                                onChange={setWeight}
                                step={0.1}
                                unit="kg"
                                icon={<Scale size={14} />}
                            />
                        </div>

                        {/* Weather & Condition Section */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', opacity: 0.6, marginBottom: '0.5rem' }}>날씨</label>
                                <div style={{ display: 'flex', gap: '0.3rem', background: 'rgba(255,255,255,0.03)', padding: '4px', borderRadius: '10px' }}>
                                    {weatherIcons.map((item) => (
                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() => setWeather(item.id)}
                                            style={{
                                                flex: 1,
                                                padding: '0.6rem 0',
                                                background: weather === item.id ? 'var(--electric-blue)' : 'transparent',
                                                border: 'none',
                                                borderRadius: '8px',
                                                color: 'white',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                            title={item.label}
                                        >
                                            {item.icon}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', opacity: 0.6, marginBottom: '0.5rem' }}>컨디션</label>
                                <div style={{ display: 'flex', gap: '0.3rem', background: 'rgba(255,255,255,0.03)', padding: '4px', borderRadius: '10px' }}>
                                    {conditionIcons.map((item) => (
                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() => setCondition(item.id)}
                                            style={{
                                                flex: 1,
                                                padding: '0.6rem 0',
                                                background: condition === item.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                                                border: condition === item.id ? '1px solid var(--neon-green)' : 'none',
                                                borderRadius: '8px',
                                                color: 'white',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                            title={item.label}
                                        >
                                            {item.icon}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Fine Dust Section */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', opacity: 0.6, marginBottom: '0.5rem' }}>
                                <Wind size={14} /> 미세먼지
                            </label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {dustOptions.map((option) => (
                                    <button
                                        key={option.id}
                                        type="button"
                                        onClick={() => setDust(option.id)}
                                        style={{
                                            flex: 1,
                                            padding: '0.8rem',
                                            background: dust === option.id ? `${option.color}22` : 'rgba(255,255,255,0.03)',
                                            border: dust === option.id ? `1px solid ${option.color}` : '1px solid rgba(255,255,255,0.05)',
                                            borderRadius: '12px',
                                            color: dust === option.id ? option.color : 'white',
                                            fontSize: '0.9rem',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            fontWeight: dust === option.id ? 'bold' : 'normal'
                                        }}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.8rem', opacity: 0.6, marginBottom: '0.5rem' }}>총 거리 / 구간 기록</label>
                            <div style={{ padding: '1rem', background: 'rgba(0, 209, 255, 0.02)', borderRadius: '12px', border: '1px solid rgba(0, 209, 255, 0.1)' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                    {splits.map((split, index) => (
                                        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <span style={{ fontSize: '0.8rem', width: '40px', opacity: 0.7 }}>{index + 1}km</span>
                                            <input
                                                type="text"
                                                ref={el => splitRefs.current[index] = el}
                                                value={split}
                                                onChange={(e) => handleSplitChange(index, e.target.value)}
                                                onFocus={() => handleSplitChange(index, '')}
                                                className="focus-neon"
                                                style={{
                                                    flex: 1,
                                                    background: 'rgba(255,255,255,0.03)',
                                                    border: '1px solid rgba(255,255,255,0.05)',
                                                    padding: '0.5rem',
                                                    borderRadius: '8px',
                                                    color: 'white',
                                                    textAlign: 'center',
                                                    fontSize: '0.9rem'
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveSplit(index)}
                                                style={{ background: 'none', border: 'none', color: '#ff4b4b', cursor: 'pointer', opacity: 0.4 }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    onClick={handleAddSplit}
                                    style={{
                                        marginTop: '1rem',
                                        width: '100%',
                                        background: 'transparent',
                                        border: '1px dashed rgba(255,255,255,0.1)',
                                        padding: '0.6rem',
                                        borderRadius: '8px',
                                        color: 'var(--electric-blue)',
                                        cursor: 'pointer',
                                        fontSize: '0.85rem'
                                    }}
                                >
                                    + 구간 추가
                                </button>
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.8rem', opacity: 0.6, marginBottom: '0.5rem' }}>오늘의 메모 (특이사항)</label>
                            <textarea
                                value={memo}
                                onChange={(e) => setMemo(e.target.value)}
                                placeholder="오늘의 컨디션이나 코스 특징을 기록해 보세요..."
                                style={{
                                    width: '100%',
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    padding: '1rem',
                                    borderRadius: '12px',
                                    color: 'white',
                                    fontSize: '0.9rem',
                                    minHeight: '100px',
                                    resize: 'none',
                                    outline: 'none'
                                }}
                            />
                        </div>

                        {/* Save Button */}
                        <button
                            type="submit"
                            style={{
                                width: '100%',
                                marginTop: '1rem',
                                background: saveSuccess ? '#00FF85' : (editingId ? 'linear-gradient(90deg, #00FF85, #00D1FF)' : 'linear-gradient(90deg, #00D1FF, #BD00FF)'),
                                border: 'none',
                                padding: '1.2rem',
                                borderRadius: '16px',
                                color: 'white',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.6rem',
                                boxShadow: saveSuccess ? '0 10px 20px rgba(0, 255, 133, 0.4)' : (editingId ? '0 10px 20px rgba(0, 255, 133, 0.2)' : '0 10px 20px rgba(0, 209, 255, 0.2)'),
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                        >
                            {saveSuccess ? (
                                <><Plus size={20} style={{ transform: 'rotate(45deg)' }} /> 기록 저장 완료!</>
                            ) : (
                                <><Save size={20} /> {isSaving ? '서버에 보관 중...' : (editingId ? '기록 수정 완료' : '스마트 기록 저장')}</>
                            )}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                onClick={handleReset}
                                style={{
                                    width: '100%',
                                    marginTop: '0.8rem',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    padding: '0.8rem',
                                    borderRadius: '12px',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    opacity: 0.7
                                }}
                            >
                                수정 취소 (신규 입력으로 전환)
                            </button>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ManualRecordForm;
