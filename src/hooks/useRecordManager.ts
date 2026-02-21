
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { calculateAveragePace, calculateCalories, formatPace, formatSecondsToTime, parseTimeToSeconds } from '../utils/calculations';

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

    // 시스템 정밀 재계산: 모든 기록을 분석하여 누락된 업적과 포인트를 전수 동기화!
    const recalculateAllAchievements = (data: any[]) => {
        if (!data) return;

        let newBadges: string[] = [];
        let newMedals: string[] = [];
        let recalculatedPoints = 0;

        // 1. 포인트 전수 재계산 (동기화의 핵심)
        data.forEach(r => {
            let earned = Math.floor(r.distance * 100);
            if (r.isImproved) earned += 300;
            recalculatedPoints += earned;
        });

        // 2. 배지/트로피 체크
        const totalDist = data.reduce((acc, r) => acc + r.distance, 0);
        if (data.some(r => r.isImproved)) newBadges.push('improved');
        if (data.some(r => r.distance >= 10)) newBadges.push('10k');
        if (totalDist >= 8.8) newBadges.push('everest');
        if (streak >= 3) newBadges.push('streak3');
        if (totalDist >= 42.195) newBadges.push('marathoner');

        // 3. 10대 전략 미션 체크
        // 1. 모닝 아우라
        const morningRuns = data.filter(r => {
            const hour = r.time ? parseInt(r.time.split(':')[0]) : 0;
            return hour < 8;
        }).length;
        if (morningRuns >= 5) newMedals.push('morning_aura');

        // 2. 미드나잇 네온
        const nightRuns = data.filter(r => {
            const hour = r.time ? parseInt(r.time.split(':')[0]) : 0;
            return hour >= 22;
        }).length;
        if (nightRuns >= 5) newMedals.push('midnight_neon');

        // 3. 퍼펙트 시메트리
        const distCounts: { [key: number]: number } = {};
        data.forEach(r => {
            const d = parseFloat(r.distance.toFixed(1));
            distCounts[d] = (distCounts[d] || 0) + 1;
        });
        if (Object.values(distCounts).some(count => count >= 3)) newMedals.push('perfect_symmetry');

        // 4. 스테디 스트림
        if (data.length >= 10) {
            const allPaces = data.map(r => parseTimeToSeconds(r.pace));
            const avgPace = allPaces.reduce((a, b) => a + b, 0) / allPaces.length;
            const steadyRuns = allPaces.filter(p => Math.abs(p - avgPace) <= 10).length;
            if (steadyRuns >= 10) newMedals.push('steady_stream');
        }

        // 5. 아이언 윌
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const last30DaysDist = data.filter(r => new Date(r.date) >= thirtyDaysAgo).reduce((acc, r) => acc + r.distance, 0);
        if (last30DaysDist >= 100) newMedals.push('iron_will');

        // 6. 위켄드 아키텍트
        const weekendRuns = data.filter(r => {
            const day = new Date(r.date).getDay();
            return day === 0 || day === 6;
        }).length;
        if (weekendRuns >= 8) newMedals.push('weekend_architect');

        // 10. 레인보우 컬렉터
        const usedCoaches = new Set(data.map(r => r.coachId).filter(Boolean));
        if (usedCoaches.size >= 7) newMedals.push('rainbow_collector');

        // 상태 업데이트 및 저장 (userId별 격리 저장소 사용)
        const finalBadges = Array.from(new Set(newBadges));
        const finalMedals = Array.from(new Set(newMedals));

        setPoints(recalculatedPoints);
        setUnlockedBadges(finalBadges);
        setUnlockedMedals(finalMedals);
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
        refreshData: () => fetchInitialData(false) // v13.3: 수동 새로고침 노출
    };
};
