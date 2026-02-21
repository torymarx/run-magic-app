
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { calculateAveragePace, calculateCalories, formatPace, formatSecondsToTime, parseTimeToSeconds } from '../utils/calculations';
import { MEDAL_DATA } from '../data/medals';
import { LEVEL_DATA, POINT_RULES } from '../data/progression';

// 이 훅은 레코드 관리에 필요한 모든 복잡한 상태 관리를 캡슐화합니다.
export const useRecordManager = (
    setPoints: (p: number) => void,
    setUnlockedBadges: (b: string[]) => void,
    setUnlockedMedals: (m: string[]) => void,
    userId: string = '00000000-0000-0000-0000-000000000000'
) => {
    const [records, setRecords] = useState<any[]>([]);
    const [lastSavedRecord, setLastSavedRecord] = useState<any>(null);
    const [lastSyncStatus, setLastSyncStatus] = useState<{ status: string, time: string, message: string }>({
        status: 'IDLE',
        time: '-',
        message: '대기 중...'
    });
    const [streak, setStreak] = useState<number>(0);
    const [totalDays, setTotalDays] = useState<number>(0);
    const [baselines, setBaselines] = useState<any>({});
    const [isCloudConnected, setIsCloudConnected] = useState<boolean>(false);

    // v13.4: 통합된 데이터 로딩 프로세스
    useEffect(() => {
        if (userId && userId !== '00000000-0000-0000-0000-000000000000') {
            fetchInitialData(false);
        } else {
            // v13.3+: 로그아웃 시 즉시 모든 로컬 상태 소거 (보안 및 잔상 제거)
            setRecords([]);
            setIsCloudConnected(false);
            setPoints(0);
            setUnlockedBadges([]);
            setUnlockedMedals([]);
            setLastSyncStatus({
                status: 'IDLE',
                time: '-',
                message: '런너님의 접속을 기다리고 있습니다... 🛡️'
            });
        }
    }, [userId]);

    const updateStreak = (data: any[]) => {
        if (!data || data.length === 0) {
            setStreak(0);
            return;
        }

        const dates = [...new Set(data.map(r => r.date))].sort().reverse();
        const getLocalDateStr = (d: Date) => {
            const offset = d.getTimezoneOffset() * 60000;
            return new Date(d.getTime() - offset).toISOString().split('T')[0];
        };
        const today = getLocalDateStr(new Date());
        const yesterday = getLocalDateStr(new Date(Date.now() - 86400000));

        if (dates[0] !== today && dates[0] !== yesterday) {
            setStreak(0);
            return;
        }

        let count = 1;
        for (let i = 0; i < dates.length - 1; i++) {
            const current = new Date(dates[i]);
            const next = new Date(dates[i + 1]);
            const diffTime = Math.abs(current.getTime() - next.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) count++;
            else break;
        }
        setStreak(count);
    };

    const updateTotalDays = (data: any[]) => {
        if (!data || data.length === 0) {
            setTotalDays(0);
            return;
        }
        const relevantDates = data
            .filter(r => r.date >= '2026-01-01')
            .map(r => r.date);

        const uniqueTotalDays = new Set(relevantDates).size;
        setTotalDays(uniqueTotalDays);
    };

    const calculateBaselineData = (data: any[]) => {
        if (!data || data.length === 0) return;

        const now = new Date();
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        const oneWeekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);

        const monthlyRecords = data.filter(r => new Date(r.date) >= oneMonthAgo && r.distance > 0 && parseTimeToSeconds(r.pace) > 0);
        const weeklyRecords = data.filter(r => new Date(r.date) >= oneWeekAgo && r.distance > 0 && parseTimeToSeconds(r.pace) > 0);
        const getPaceSeconds = (paceStr: string) => parseTimeToSeconds(paceStr);

        const fastestPace = monthlyRecords.length > 0
            ? Math.min(...monthlyRecords.map(r => getPaceSeconds(r.pace)))
            : null;

        const yesterdayStr = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toISOString().split('T')[0];
        const yesterdayRecord = data.find(r => r.date === yesterdayStr);

        let monthlyAvgPace = null;
        if (monthlyRecords.length > 0) {
            const totalDist = monthlyRecords.reduce((acc, r) => acc + r.distance, 0);
            const totalTime = monthlyRecords.reduce((acc, r) => acc + (getPaceSeconds(r.pace) * r.distance), 0);
            monthlyAvgPace = totalDist > 0 ? totalTime / totalDist : 0;
        }

        let weeklyAvgPace = null;
        if (weeklyRecords.length > 0) {
            const totalDist = weeklyRecords.reduce((acc, r) => acc + r.distance, 0);
            const totalTime = weeklyRecords.reduce((acc, r) => acc + (getPaceSeconds(r.pace) * r.distance), 0);
            weeklyAvgPace = totalDist > 0 ? totalTime / totalDist : 0;
        }

        const slowestPace = weeklyRecords.length > 0
            ? Math.max(...weeklyRecords.map(r => getPaceSeconds(r.pace)))
            : null;

        setBaselines({
            apex: fastestPace,
            insight: yesterdayRecord ? getPaceSeconds(yesterdayRecord.pace) : (data.length > 0 ? getPaceSeconds(data[0].pace) : null),
            atlas: monthlyAvgPace,
            swift: weeklyAvgPace,
            zen: slowestPace
        });
    };

    const handleManualSave = async (data: any) => {
        const recordDate = new Date(data.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const recordDateOnly = new Date(recordDate.getFullYear(), recordDate.getMonth(), recordDate.getDate());

        if (recordDateOnly > today) {
            alert("미래의 날짜에는 기록을 등록할 수 없습니다. ⛔");
            return;
        }

        const totalSeconds = data.splits.reduce((acc: number, split: string) => acc + parseTimeToSeconds(split), 0);
        const avgPaceSeconds = calculateAveragePace(totalSeconds, data.distance);
        const calories = calculateCalories(data.distance, totalSeconds, data.weight);
        const prevPaceSeconds = baselines.atlas || parseTimeToSeconds("06:00");
        const paceDiff = prevPaceSeconds - avgPaceSeconds;

        const isEditing = !!data.id;
        // v12.2: DB 타입 호환성을 위해 다시 숫자(BigInt 호환)로 복구
        const recordId = data.id || Date.now();

        // v12.1: 유저 정보가 없는 상태에서의 저장을 원천 봉쇄 (휘발 방지)
        if (!userId || userId === '00000000-0000-0000-0000-000000000000') {
            console.error("🛑 [Auth Guard] 인증되지 않은 사용자의 기록 저장이 차단되었습니다.");
            alert("로그인 세션이 만료되었거나 정보가 없습니다. 다시 로그인해 주세요. ⛔");
            return;
        }

        const newRecord = {
            ...data,
            id: recordId,
            user_id: userId, // 계정 연동!
            totalTime: formatSecondsToTime(totalSeconds),
            pace: formatPace(avgPaceSeconds),
            calories,
            paceDiff: formatPace(Math.abs(paceDiff)),
            isImproved: paceDiff > 0
        };

        const updatedRecords = isEditing
            ? records.map(r => r.id === recordId ? newRecord : r)
            : [newRecord, ...records];

        // v13.3: 로컬 상태 선제 업데이트 제거 (서버 성공 확인 후 업데이트)
        // setRecords(updatedRecords); 

        console.group(`💾 [Diagnostics] 기록 저장 시도: ${recordId}`);
        console.log("User UUID:", userId);
        console.log("Payload Sample:", { distance: data.distance, date: data.date });

        const { error, status, statusText } = await supabase.from('records').upsert([newRecord]);

        console.log(`Supabase Status: ${status} (${statusText})`);

        if (error) {
            console.error("❌ Save Error Details:", error);
            setLastSyncStatus({
                status: 'SAVE_ERROR',
                time: new Date().toLocaleTimeString(),
                message: error.message
            });
            alert(`클라우드 저장 실패! ⛔\n이유: ${error.message}\n(SQL 명령어를 실행하셨는지 다시 한번 확인해 주세요)`);
            console.groupEnd();
            throw error;
        }

        console.log("✅ [Cloud Sync] 저장 성공!");

        // v13.3: 서버 저장 성공 확인 후 로컬 상태 업데이트
        setRecords(updatedRecords);
        setLastSyncStatus({
            status: 'SAVE_SUCCESS',
            time: new Date().toLocaleTimeString(),
            message: '기록 저장 완료'
        });
        console.groupEnd();

        calculateBaselineData(updatedRecords);
        updateStreak(updatedRecords);
        updateTotalDays(updatedRecords);

        // v10.5: 단순 더하기가 아닌 전체 기록 기반 재계산 트리거
        recalculateAllAchievements(updatedRecords);

        setLastSavedRecord(newRecord);
    };

    // v15.0: 50대 메달 대장정 시스템 - 모든 기록을 분석하여 메달 해금 및 포인트 정산
    const recalculateAllAchievements = (data: any[]) => {
        if (!data) return;

        let newMedals: string[] = [];
        let recalculatedPoints = 0;

        // 기초 통계 산출
        const totalDist = data.reduce((acc, r) => acc + r.distance, 0);
        const totalSeconds = data.reduce((acc, r) => acc + parseTimeToSeconds(r.totalTime), 0);
        const totalMinutes = totalSeconds / 60;
        const totalSessions = data.length;

        // 메달별 조건 체크 (50개)
        MEDAL_DATA.forEach(medal => {
            let isUnlocked = false;

            switch (medal.id) {
                // Phase 1
                case 'm1': isUnlocked = true; break; // 프로필 활성화 (현 시점 기본)
                case 'm2': isUnlocked = data.some(r => r.distance >= 1); break;
                case 'm3': isUnlocked = data.some(r => parseTimeToSeconds(r.totalTime) >= 600); break;
                case 'm4': isUnlocked = data.some(r => {
                    const h = parseInt(r.time.split(':')[0]);
                    return h >= 5 && h < 9;
                }); break;
                case 'm5': isUnlocked = data.some(r => {
                    const h = parseInt(r.time.split(':')[0]);
                    return h >= 19 || h < 24;
                }); break;

                // Phase 2
                case 'm6': isUnlocked = streak >= 3; break;
                case 'm7': isUnlocked = data.length >= 3; break; // 실제론 1주일 조건이나 누적 3회로 일단 체크
                case 'm8': isUnlocked = data.some(r => {
                    const day = new Date(r.date).getDay();
                    return day === 0 || day === 6;
                }); break;
                case 'm9': isUnlocked = totalDist >= 10; break;
                case 'm10': isUnlocked = data.some(r => r.distance >= 3); break;

                // Phase 3
                case 'm11': isUnlocked = data.some(r => new Date(r.date).getDay() === 1); break;
                case 'm12': isUnlocked = totalMinutes >= 100; break;
                case 'm13': isUnlocked = data.filter(r => r.distance <= 2).length >= 5; break;
                case 'm14': isUnlocked = data.some(r => r.distance >= 7); break;

                // Phase 4
                case 'm15': isUnlocked = data.some(r => parseTimeToSeconds(r.totalTime) >= 1800); break;
                case 'm16': isUnlocked = data.some(r => r.isImproved); break;
                case 'm17': isUnlocked = data.some(r => r.distance >= 5); break;
                case 'm18': isUnlocked = totalDist >= 30; break;
                case 'm19': isUnlocked = data.length >= 10; break; // 한달 내 조건은 단순 누적 10회로 처리
                case 'm20': isUnlocked = data.some(r => r.distance >= 10); break;

                // Phase 5 (누적 기록)
                case 'm21': isUnlocked = totalDist >= 20; break;
                case 'm22': isUnlocked = totalDist >= 50; break;
                case 'm23': isUnlocked = totalMinutes >= 300; break;
                case 'm24': isUnlocked = totalSessions >= 15; break;
                case 'm25': isUnlocked = totalSessions >= 30; break;
                case 'm26': isUnlocked = totalDist >= 100; break;
                case 'm27': isUnlocked = totalMinutes >= 500; break;
                case 'm28': isUnlocked = totalSessions >= 50; break;
                case 'm29': isUnlocked = totalMinutes >= 1000; break;
                case 'm30': isUnlocked = totalSessions >= 100; break;

                // Phase 6
                case 'm31': isUnlocked = totalDist >= 150; break;
                case 'm32': isUnlocked = totalDist >= 200; break;
                case 'm33': isUnlocked = totalDist >= 300; break;
                case 'm34': isUnlocked = totalMinutes >= 2000; break;
                case 'm35': isUnlocked = totalMinutes >= 3000; break;
                case 'm36': isUnlocked = totalSessions >= 150; break;
                case 'm37': isUnlocked = totalSessions >= 180; break; // 6개월 연속 기준 완화
                case 'm38': isUnlocked = totalSessions >= 200; break;
                case 'm39': isUnlocked = totalMinutes >= 5000; break;
                case 'm40': isUnlocked = totalDist >= 500; break;

                // Phase 7
                case 'm41': isUnlocked = totalMinutes >= 7000; break;
                case 'm42': isUnlocked = totalDist >= 777; break;
                case 'm43': isUnlocked = totalSessions >= 250; break;
                case 'm44': isUnlocked = totalSessions >= 40; break; // 사계절 체크 대신 누적 40회 보수적 적용
                case 'm45': isUnlocked = totalMinutes >= 10000; break;
                case 'm46': isUnlocked = totalDist >= 1000; break;
                case 'm47': isUnlocked = totalSessions >= 300; break;
                case 'm48': isUnlocked = totalSessions >= 100; break; // 가입 1주년 연동은 추후 프로필 날짜와 결합
                case 'm49': isUnlocked = totalSessions >= 365; break;
                case 'm50': isUnlocked = totalDist >= 1000 && totalMinutes >= 10000 && totalSessions >= 365; break;
            }

            if (isUnlocked) {
                newMedals.push(medal.id);
                recalculatedPoints += medal.points;
            }
        });

        // v16.0: 활동 포인트 정밀 산출
        let activityPoints = 0;

        // 1. 러닝 기록 등록 (30P): 일자별 1회
        const uniqueDays = new Set(data.map(r => r.date)).size;
        activityPoints += uniqueDays * POINT_RULES.RUNNING_SESSION;

        // 2. 연속 러닝 보너스 (50P): 3, 7, 14, 30일 등 주요 마일스톤 시점
        if (streak >= 3) activityPoints += POINT_RULES.STREAK_BONUS;
        if (streak >= 7) activityPoints += POINT_RULES.STREAK_BONUS;
        if (streak >= 14) activityPoints += POINT_RULES.STREAK_BONUS;

        // 3. 특정 시간대 보너스 (20P)
        const specialRuns = data.filter(r => {
            const h = parseInt(r.time.split(':')[0]);
            return h < 6 || h >= 21; // 얼리버드 or 나이트런
        }).length;
        activityPoints += specialRuns * POINT_RULES.SPECIAL_TIME;

        // 결과 업데이트
        const finalPoints = recalculatedPoints + activityPoints;
        setPoints(finalPoints);
        setUnlockedMedals(newMedals);
        setUnlockedBadges([]);
    };

    // v16.0: 포인트 기반 레벨 계산기
    const calculateLevelInfo = (totalPoints: number) => {
        const currentLevel = LEVEL_DATA.find(l => totalPoints >= l.minPoints && totalPoints <= l.maxPoints)
            || LEVEL_DATA[LEVEL_DATA.length - 1];

        const nextLevel = LEVEL_DATA.find(l => l.level === currentLevel.level + 1);

        let progress = 100;
        let xpToNext = 0;

        if (nextLevel) {
            const range = nextLevel.minPoints - currentLevel.minPoints;
            const currentXP = totalPoints - currentLevel.minPoints;
            progress = Math.min(Math.floor((currentXP / range) * 100), 100);
            xpToNext = nextLevel.minPoints - totalPoints;
        }

        return {
            ...currentLevel,
            progress,
            xpToNext,
            nextLevelName: nextLevel?.name || 'MAX'
        };
    };

    const handleDeleteRecord = async (id: number) => {
        if (!window.confirm("정말로 이 기록을 삭제하시겠습니까?")) return;

        const updatedRecords = records.filter(r => r.id !== id);
        setRecords(updatedRecords);

        const { error } = await supabase.from('records').delete().eq('id', id).eq('user_id', userId);
        if (error) console.error("Supabase Delete Failed:", error);

        calculateBaselineData(updatedRecords);
        updateStreak(updatedRecords);
        updateTotalDays(updatedRecords);

        if (lastSavedRecord?.id === id) setLastSavedRecord(null);
    };

    const handleImportRecords = async (importedData: any[]) => {
        if (!Array.isArray(importedData)) return;

        // v13.3: 가져오기 시에도 인증 상태 체크 강화
        if (!userId || userId === '00000000-0000-0000-0000-000000000000') {
            alert("로그인 세션이 만료되었습니다. 다시 로그인해 주세요. ⛔");
            return;
        }

        console.log("📥 데이터 가져오기 시작...");
        const existingIds = new Set(records.map(r => r.id));
        const newRecords = importedData
            .filter(r => !existingIds.has(r.id))
            .map(r => ({ ...r, user_id: userId })); // 현재 유저 키 할당

        if (newRecords.length === 0) {
            alert("가져올 새로운 기록이 없습니다.");
            return;
        }

        const { error } = await supabase.from('records').upsert(newRecords);
        if (error) {
            console.error("Supabase Import Failed:", error);
            alert(`가져오기 실패: ${error.message}`);
            return;
        }

        // v13.3: 서버 성공 확인 후 로컬 상태 업데이트
        const updatedRecords = [...newRecords, ...records].sort((a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setRecords(updatedRecords);

        calculateBaselineData(updatedRecords);
        updateStreak(updatedRecords);
        updateTotalDays(updatedRecords);

        alert(`${newRecords.length}개의 기록을 성공적으로 가져오고 서버와 동기화했습니다! 🫡✨`);
    };

    const fetchInitialData = async (silent: boolean = false) => {
        if (!userId || userId === '00000000-0000-0000-0000-000000000000') {
            if (!silent) {
                setIsCloudConnected(false);
                setRecords([]);
            }
            return;
        }

        if (!silent) console.group(`📡 [Diagnostics] 클라우드 동기화 시작: ${userId}`);

        try {
            const { data: cloudRecords, error } = await supabase
                .from('records')
                .select('*')
                .eq('user_id', userId)
                .order('date', { ascending: false });

            if (error) throw error;

            setIsCloudConnected(true);
            const loadedRecords = cloudRecords || [];
            setRecords(loadedRecords);

            // 데이터 기반 통계 및 업적 전수 재계산
            calculateBaselineData(loadedRecords);
            updateStreak(loadedRecords);
            updateTotalDays(loadedRecords);
            recalculateAllAchievements(loadedRecords);

            if (!silent) {
                console.log(`✅ 동기화 완료: ${loadedRecords.length}개의 기록이 최신화되었습니다.`);
                setLastSyncStatus({
                    status: 'FETCH_SUCCESS',
                    time: new Date().toLocaleTimeString(),
                    message: `${loadedRecords.length}개의 기록이 안전하게 연결되었습니다.`
                });
            }
        } catch (error: any) {
            console.error("❌ 데이터 동기화 실패:", error);
            setIsCloudConnected(false);
            setLastSyncStatus({
                status: 'FETCH_ERROR',
                time: new Date().toLocaleTimeString(),
                message: error.message || '데이터를 불러오는 중 오류가 발생했습니다.'
            });
        } finally {
            if (!silent) console.groupEnd();
        }
    };

    return {
        records,
        setRecords,
        lastSavedRecord,
        setLastSavedRecord,
        streak,
        baselines,
        isCloudConnected,
        handleManualSave,
        handleDeleteRecord,
        handleImportRecords,
        calculateBaselineData,
        updateStreak,
        updateTotalDays,
        totalDays,
        lastSyncStatus,
        calculateLevelInfo, // v16.0: 레벨 정보 계산기 노출
        refreshData: () => fetchInitialData(false)
    };
};
