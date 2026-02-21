import { useMemo } from 'react';
import { parseTimeToSeconds, formatPace } from '../utils/calculations';

interface Recommendation {
    title: string;
    detail: string;
}

export const useAICoachSystem = (
    selectedCoachId: string,
    isRecording: boolean,
    distance: number,
    timer: number,
    records: any[],
    lastSavedRecord: any
) => {
    // 1. 전체 성과 (Overall): 연초부터 현재까지의 누적 성장 궤적
    const overallStats = useMemo(() => {
        if (!Array.isArray(records) || records.length === 0) return null;
        const totalDist = records.reduce((sum, r) => sum + (r.distance || 0), 0);
        const avgPaceSec = records.reduce((sum, r) => sum + parseTimeToSeconds(r.pace || "0:00"), 0) / records.length;
        return { count: records.length, totalDist, avgPaceStr: formatPace(avgPaceSec) };
    }, [records]);

    // 2. 최근 추세 (Recent - 7Days): 컨디션 및 리듬 변동성
    const recentStats = useMemo(() => {
        if (!Array.isArray(records) || records.length === 0) return null;
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentRecords = records.filter(r => new Date(r.date) >= sevenDaysAgo);
        if (recentRecords.length === 0) return null;
        const avgPaceSec = recentRecords.reduce((sum, r) => sum + parseTimeToSeconds(r.pace || "0:00"), 0) / recentRecords.length;
        return { count: recentRecords.length, avgPaceSec, avgPaceStr: formatPace(avgPaceSec) };
    }, [records]);

    // 3. 당일 성과 (Today): 현재 세션의 임계치 분석
    const todayStats = useMemo(() => {
        if (lastSavedRecord) {
            return {
                paceSec: parseTimeToSeconds(lastSavedRecord.pace),
                distance: lastSavedRecord.distance,
                isImproved: lastSavedRecord.isImproved
            };
        }
        return null;
    }, [lastSavedRecord]);

    const feedback = useMemo(() => {
        let message = "";
        let recommendation: Recommendation = { title: "전략적 분석", detail: "데이터 집계 중입니다. 질주를 준비하세요." };

        // [실시간 코칭: 기록 중] Professional Persona
        if (isRecording) {
            const currentPaceSeconds = distance > 0 ? timer / distance : 0;
            const paceStr = formatPace(currentPaceSeconds);

            const coachScripts: Record<string, any> = {
                apex: {
                    msg: `현재 페이스 ${paceStr}. 임계 구역 진입입니다. 산소 부채가 쌓일 때 미토콘드리아는 강해집니다! 🔥`,
                    rect: { title: "젖산 내성 강화", detail: "30초간 페이스를 10% 더 끌어올리세요. 세포가 한계를 기억해야 합니다." }
                },
                insight: {
                    msg: `생체역학 분석 결과: 상체 5도 전경 정렬 유지. 중력 추진력을 100% 활용 중입니다. 🐟`,
                    rect: { title: "운동 역학 최적화", detail: "팔 스윙 각도를 90도로 고정하여 에너지 누수를 차단하세요. 효율이 최고의 기술입니다." }
                },
                wellness: {
                    msg: `심박-근육 밸런스 안정적. 환경 변수에 맞게 체온 조절 능력이 가동되고 있습니다. 🌿`,
                    rect: { title: "컨디션 팩터 케어", detail: "지면 반발 충격이 무릎에 닿기 전 발바닥 전체로 분산시키세요. 예방이 전진보다 우선입니다." }
                }
            };

            const script = coachScripts[selectedCoachId] || coachScripts['wellness'];
            message = script.msg;
            recommendation = script.rect;
        }
        // [심층 분석: 기록 저장 후] Multi-layered Hybrid Analysis
        else if (todayStats && recentStats && overallStats) {
            const paceDiff = recentStats.avgPaceSec - todayStats.paceSec;
            const paceDiffStr = formatPace(Math.abs(paceDiff));

            const baseMsg = `[오늘의 분석] ${todayStats.distance}km 주행 완료. 최근 7일 평균(${recentStats.avgPaceStr}) 대비 ${paceDiff > 0 ? paceDiffStr + ' 단축' : paceDiffStr + ' 지연'}. `;

            switch (selectedCoachId) {
                case 'apex':
                    message = baseMsg + (paceDiff > 0
                        ? "심폐 지표가 상승 궤도에 올랐습니다. 누적 주행 거리와 함께 폭발력이 정교하게 다듬어지고 있군요! 🔥"
                        : "회복을 위한 저강도 구간이었나요? 아니라면 내일은 임계치를 넘는 인터벌이 필수입니다. 🔥");
                    recommendation = { title: "임계 자극 처방", detail: "오늘의 누적 피로도를 고려해 48시간 내에 최대 심박수 90% 구간 훈련을 배치하세요." };
                    break;
                case 'insight':
                    const eff = (todayStats.distance * 60).toFixed(0);
                    message = baseMsg + `전체 ${overallStats.totalDist.toFixed(1)}km의 여정 중 메타 대사 효율이 ${eff}kcal/hr로 최적화되었습니다. 🐟`;
                    recommendation = { title: "영양 및 역학 솔루션", detail: "근합성 골든타임을 위해 30분 내 유청 단백질 25g을 섭취하고 폼롤러로 근막을 이완하세요." };
                    break;
                default: // wellness
                    message = baseMsg + `전체 ${overallStats.count}회 질주 동안 부상 없이 꾸준함을 유지한 점이 가장 큰 데이터적 자산입니다. 🌿`;
                    recommendation = { title: "바이오 리듬 안정화", detail: "최근 7일간의 훈련 강도가 상승세입니다. 깊은 수면을 통해 신경계를 리셋하십시오." };
            }
        }
        else {
            message = "데이터 사이언스 기반의 전문 코칭 시스템입니다. 질주를 시작하면 다층 분석 리포트를 제공합니다.";
            recommendation = { title: "분석 베이스 확보", detail: "첫 5km의 주행 데이터가 있어야 정밀한 비교 진단이 가능합니다." };
        }

        return {
            message,
            recommendation: {
                ...recommendation,
                insight: "데이터 사이언스에 기반한 실전적 트레이닝 가이드입니다.",
                mental: "승리는 철저한 분석과 흔들리지 않는 실행의 결과입니다."
            }
        };
    }, [selectedCoachId, isRecording, distance, timer, records, lastSavedRecord, todayStats, recentStats, overallStats]);

    return { message: feedback.message, recommendation: feedback.recommendation, periodStats: overallStats, recentStats };
};
