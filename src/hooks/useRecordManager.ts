
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
            setMedalAchievements({}); // v17.0
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

    // v17.0: 메달 달성 시점(날짜) 추적을 위한 상태 추가
    const [medalAchievements, setMedalAchievements] = useState<{ [id: string]: string }>({});

    // v15.0/v17.0: 50대 메달 대장정 시스템 - 모든 기록을 분석하여 메달 해금 및 포인트 정산
    const recalculateAllAchievements = (data: any[]) => {
        if (!data) return;

        // v17.0: 날짜순 정렬된 복사본 (달성 시점 추적용)
        const chronologicalData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        let newMedals: string[] = [];
        let newMedalAchievements: { [id: string]: string } = {};
        let recalculatedPoints = 0;

        // 기초 통계 산출
        const totalDist = data.reduce((acc, r) => acc + r.distance, 0);
        const totalSeconds = data.reduce((acc, r) => acc + parseTimeToSeconds(r.totalTime), 0);
        const totalMinutes = totalSeconds / 60;
        const totalSessions = data.length;

        // 메달별 조건 체크 (50개)
        MEDAL_DATA.forEach(medal => {
            let isUnlocked = false;
            let achievementDate = '-';

            // 달성일 추적 도우미
            const findFirstOccurrence = (predicate: (r: any, idx: number, arr: any[]) => boolean) => {
                const first = chronologicalData.find(predicate);
                return first ? first.date : null;
            };

            switch (medal.id) {
                // Phase 1
                case 'm1':
                    isUnlocked = true;
                    achievementDate = data.length > 0 ? chronologicalData[0].date : new Date().toISOString().split('T')[0];
                    break;
                case 'm2':
                    const d2 = findFirstOccurrence(r => r.distance >= 1);
                    if (d2) { isUnlocked = true; achievementDate = d2; }
                    break;
                case 'm3':
                    const d3 = findFirstOccurrence(r => parseTimeToSeconds(r.totalTime) >= 600);
                    if (d3) { isUnlocked = true; achievementDate = d3; }
                    break;
                case 'm4':
                    const d4 = findFirstOccurrence(r => {
                        const h = parseInt(r.time.split(':')[0]);
                        return h >= 5 && h < 9;
                    });
                    if (d4) { isUnlocked = true; achievementDate = d4; }
                    break;
                case 'm5':
                    const d5 = findFirstOccurrence(r => {
                        const h = parseInt(r.time.split(':')[0]);
                        return h >= 19 || h < 24;
                    });
                    if (d5) { isUnlocked = true; achievementDate = d5; }
                    break;

                // Phase 2
                case 'm6':
                    // 스트릭은 실시간 계산이므로 현재 세션 데이터 중 streak 요건 충족 시점 추정
                    if (streak >= 3) {
                        isUnlocked = true;
                        achievementDate = chronologicalData[chronologicalData.length - 1].date;
                    }
                    break;
                case 'm7':
                    if (data.length >= 3) {
                        isUnlocked = true;
                        achievementDate = chronologicalData[2].date;
                    }
                    break;
                case 'm8':
                    const d8 = findFirstOccurrence(r => {
                        const day = new Date(r.date).getDay();
                        return day === 0 || day === 6;
                    });
                    if (d8) { isUnlocked = true; achievementDate = d8; }
                    break;
                case 'm9':
                    // 누적 거리 10km 시점 추적
                    let accDist9 = 0;
                    for (const r of chronologicalData) {
                        accDist9 += r.distance;
                        if (accDist9 >= 10) {
                            isUnlocked = true;
                            achievementDate = r.date;
                            break;
                        }
                    }
                    break;
                case 'm10':
                    const d10 = findFirstOccurrence(r => r.distance >= 3);
                    if (d10) { isUnlocked = true; achievementDate = d10; }
                    break;

                // Phase 3
                case 'm11':
                    const d11 = findFirstOccurrence(r => new Date(r.date).getDay() === 1);
                    if (d11) { isUnlocked = true; achievementDate = d11; }
                    break;
                case 'm12':
                    let accTime12 = 0;
                    for (const r of chronologicalData) {
                        accTime12 += parseTimeToSeconds(r.totalTime) / 60;
                        if (accTime12 >= 100) {
                            isUnlocked = true;
                            achievementDate = r.date;
                            break;
                        }
                    }
                    break;
                case 'm13':
                    const shortRuns = chronologicalData.filter(r => r.distance <= 2);
                    if (shortRuns.length >= 5) {
                        isUnlocked = true;
                        achievementDate = shortRuns[4].date;
                    }
                    break;
                case 'm14':
                    const d14 = findFirstOccurrence(r => r.distance >= 7);
                    if (d14) { isUnlocked = true; achievementDate = d14; }
                    break;

                // Phase 4
                case 'm15':
                    const d15 = findFirstOccurrence(r => parseTimeToSeconds(r.totalTime) >= 1800);
                    if (d15) { isUnlocked = true; achievementDate = d15; }
                    break;
                case 'm16':
                    const d16 = findFirstOccurrence(r => r.isImproved);
                    if (d16) { isUnlocked = true; achievementDate = d16; }
                    break;
                case 'm17':
                    const d17 = findFirstOccurrence(r => r.distance >= 5);
                    if (d17) { isUnlocked = true; achievementDate = d17; }
                    break;
                case 'm18':
                    let accDist18 = 0;
                    for (const r of chronologicalData) {
                        accDist18 += r.distance;
                        if (accDist18 >= 30) {
                            isUnlocked = true;
                            achievementDate = r.date;
                            break;
                        }
                    }
                    break;
                case 'm19':
                    if (data.length >= 10) {
                        isUnlocked = true;
                        achievementDate = chronologicalData[9].date;
                    }
                    break;
                case 'm20':
                    const d20 = findFirstOccurrence(r => r.distance >= 10);
                    if (d20) { isUnlocked = true; achievementDate = d20; }
                    break;

                // Phase 5 (누적 기록)
                case 'm21':
                    let accDist21 = 0;
                    for (const r of chronologicalData) {
                        accDist21 += r.distance;
                        if (accDist21 >= 20) { isUnlocked = true; achievementDate = r.date; break; }
                    }
                    break;
                case 'm22':
                    let accDist22 = 0;
                    for (const r of chronologicalData) {
                        accDist22 += r.distance;
                        if (accDist22 >= 50) { isUnlocked = true; achievementDate = r.date; break; }
                    }
                    break;
                case 'm23':
                    let accTime23 = 0;
                    for (const r of chronologicalData) {
                        accTime23 += parseTimeToSeconds(r.totalTime) / 60;
                        if (accTime23 >= 300) { isUnlocked = true; achievementDate = r.date; break; }
                    }
                    break;
                case 'm24':
                    if (totalSessions >= 15) { isUnlocked = true; achievementDate = chronologicalData[14].date; }
                    break;
                case 'm25':
                    if (totalSessions >= 30) { isUnlocked = true; achievementDate = chronologicalData[29].date; }
                    break;
                case 'm26':
                    let accDist26 = 0;
                    for (const r of chronologicalData) {
                        accDist26 += r.distance;
                        if (accDist26 >= 100) { isUnlocked = true; achievementDate = r.date; break; }
                    }
                    break;
                case 'm27':
                    let accTime27 = 0;
                    for (const r of chronologicalData) {
                        accTime27 += parseTimeToSeconds(r.totalTime) / 60;
                        if (accTime27 >= 500) { isUnlocked = true; achievementDate = r.date; break; }
                    }
                    break;
                case 'm28':
                    if (totalSessions >= 50) { isUnlocked = true; achievementDate = chronologicalData[49].date; }
                    break;
                case 'm29':
                    let accTime29 = 0;
                    for (const r of chronologicalData) {
                        accTime29 += parseTimeToSeconds(r.totalTime) / 60;
                        if (accTime29 >= 1000) { isUnlocked = true; achievementDate = r.date; break; }
                    }
                    break;
                case 'm30':
                    if (totalSessions >= 100) { isUnlocked = true; achievementDate = chronologicalData[99].date; }
                    break;

                // Phase 6
                case 'm31':
                    let accDist31 = 0;
                    for (const r of chronologicalData) {
                        accDist31 += r.distance;
                        if (accDist31 >= 150) { isUnlocked = true; achievementDate = r.date; break; }
                    }
                    break;
                case 'm32':
                    let accDist32 = 0;
                    for (const r of chronologicalData) {
                        accDist32 += r.distance;
                        if (accDist32 >= 200) { isUnlocked = true; achievementDate = r.date; break; }
                    }
                    break;
                case 'm33':
                    let accDist33 = 0;
                    for (const r of chronologicalData) {
                        accDist33 += r.distance;
                        if (accDist33 >= 300) { isUnlocked = true; achievementDate = r.date; break; }
                    }
                    break;
                case 'm34':
                    let accTime34 = 0;
                    for (const r of chronologicalData) {
                        accTime34 += parseTimeToSeconds(r.totalTime) / 60;
                        if (accTime34 >= 2000) { isUnlocked = true; achievementDate = r.date; break; }
                    }
                    break;
                case 'm35':
                    let accTime35 = 0;
                    for (const r of chronologicalData) {
                        accTime35 += parseTimeToSeconds(r.totalTime) / 60;
                        if (accTime35 >= 3000) { isUnlocked = true; achievementDate = r.date; break; }
                    }
                    break;
                case 'm36':
                    if (totalSessions >= 150) { isUnlocked = true; achievementDate = chronologicalData[149].date; }
                    break;
                case 'm37':
                    if (totalSessions >= 180) { isUnlocked = true; achievementDate = chronologicalData[179].date; }
                    break;
                case 'm38':
                    if (totalSessions >= 200) { isUnlocked = true; achievementDate = chronologicalData[199].date; }
                    break;
                case 'm39':
                    let accTime39 = 0;
                    for (const r of chronologicalData) {
                        accTime39 += parseTimeToSeconds(r.totalTime) / 60;
                        if (accTime39 >= 5000) { isUnlocked = true; achievementDate = r.date; break; }
                    }
                    break;
                case 'm40':
                    let accDist40 = 0;
                    for (const r of chronologicalData) {
                        accDist40 += r.distance;
                        if (accDist40 >= 500) { isUnlocked = true; achievementDate = r.date; break; }
                    }
                    break;

                // Phase 7
                case 'm41':
                    let accTime41 = 0;
                    for (const r of chronologicalData) {
                        accTime41 += parseTimeToSeconds(r.totalTime) / 60;
                        if (accTime41 >= 7000) { isUnlocked = true; achievementDate = r.date; break; }
                    }
                    break;
                case 'm42':
                    let accDist42 = 0;
                    for (const r of chronologicalData) {
                        accDist42 += r.distance;
                        if (accDist42 >= 777) { isUnlocked = true; achievementDate = r.date; break; }
                    }
                    break;
                case 'm43':
                    if (totalSessions >= 250) { isUnlocked = true; achievementDate = chronologicalData[249].date; }
                    break;
                case 'm44':
                    if (totalSessions >= 40) { isUnlocked = true; achievementDate = chronologicalData[39].date; }
                    break;
                case 'm45':
                    let accTime45 = 0;
                    for (const r of chronologicalData) {
                        accTime45 += parseTimeToSeconds(r.totalTime) / 60;
                        if (accTime45 >= 10000) { isUnlocked = true; achievementDate = r.date; break; }
                    }
                    break;
                case 'm46':
                    let accDist46 = 0;
                    for (const r of chronologicalData) {
                        accDist46 += r.distance;
                        if (accDist46 >= 1000) { isUnlocked = true; achievementDate = r.date; break; }
                    }
                    break;
                case 'm47':
                    if (totalSessions >= 300) { isUnlocked = true; achievementDate = chronologicalData[299].date; }
                    break;
                case 'm48':
                    if (totalSessions >= 100) { isUnlocked = true; achievementDate = chronologicalData[99].date; }
                    break;
                case 'm49':
                    if (totalSessions >= 365) { isUnlocked = true; achievementDate = chronologicalData[364].date; }
                    break;
                case 'm50':
                    if (totalDist >= 1000 && totalMinutes >= 10000 && totalSessions >= 365) {
                        isUnlocked = true;
                        achievementDate = chronologicalData[chronologicalData.length - 1].date;
                    }
                    break;
            }

            if (isUnlocked) {
                newMedals.push(medal.id);
                newMedalAchievements[medal.id] = achievementDate.replace(/-/g, '.');
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
        setMedalAchievements(newMedalAchievements); // v17.0
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
        medalAchievements, // v17.0: 달성 날짜 데이터 노출
        calculateLevelInfo, // v16.0: 레벨 정보 계산기 노출
        refreshData: () => fetchInitialData(false)
    };
};
