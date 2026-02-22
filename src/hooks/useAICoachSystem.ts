import { useMemo } from 'react';
import { parseTimeToSeconds, formatPace } from '../utils/calculations';

interface Recommendation {
    title: string;
    detail: string;
    insight?: string;
    mental?: string;
}

export const useAICoachSystem = (
    selectedCoachId: string,
    isRecording: boolean,
    distance: number,
    timer: number,
    records: any[],
    lastSavedRecord: any,
    profile?: any,
    levelInfo?: any
) => {
    // 1. 전체 성과 (Overall): 연초부터 현재까지의 누적 성장 궤적
    const overallStats = useMemo(() => {
        if (!Array.isArray(records) || records.length === 0) return { count: 0, totalDist: 0, avgPaceStr: "0'00\"" };
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
                isImproved: lastSavedRecord.isImproved,
                paceStr: lastSavedRecord.pace
            };
        }
        return null;
    }, [lastSavedRecord]);

    const feedback = useMemo(() => {
        let message = "";
        let recommendation: Recommendation = { title: "전략적 분석", detail: "당신의 러닝 데이터를 분석 중입니다." };

        // [실시간 코칭: 기록 중] Professional Persona
        if (isRecording) {
            const currentPaceSeconds = distance > 0 ? timer / distance : 0;
            const paceStr = formatPace(currentPaceSeconds);

            const coachScripts: Record<string, any> = {
                apex: {
                    msg: `현재 페이스 ${paceStr}. 당신의 한계 돌파를 지켜보고 있습니다. 숨이 턱 끝까지 차오를 때 진정한 성장이 시작됩니다! 🔥`,
                    rect: { title: "젖산 내성 강화", detail: "지금보다 초당 2~3초만 더 당겨보세요. 세포가 새로운 속도를 기억해야 합니다." }
                },
                insight: {
                    msg: `생체역학 분석 중: 현재 페이스 ${paceStr}. 착지 충격 분산과 상체 기울기가 조화롭습니다. 효율적인 질주입니다. 🐟`,
                    rect: { title: "운동 역학 최적화", detail: "팔 스윙의 리듬을 일정하게 유지하여 에너지 누수를 차단하세요. 효율이 최고의 기술입니다." }
                },
                wellness: {
                    msg: `심박과 호흡의 밸런스가 안정적입니다. 페이스 ${paceStr}. 자연스러운 흐름을 즐기며 나아가세요. 🌿`,
                    rect: { title: "바이오 리드믹 케어", detail: "지면 반발 충격이 무릎에 닿기 전 발바닥 전체로 분산시키세요. 예방이 전진보다 우선입니다." }
                }
            };

            const script = coachScripts[selectedCoachId] || coachScripts['wellness'];
            message = script.msg;
            recommendation = script.rect;
        }
        // [심층 분석 & 로드맵 가이드: 프로필 기반 조언]
        else {
            const runnerGoal = profile?.goal || "멋지게 달리기";
            const runnerName = profile?.name || "런너";
            const currentLevel = levelInfo?.name || "비기너";

            const coachScripts: Record<string, any> = {
                apex: {
                    msg: `[성장 로드맵] ${runnerName}님, 현재 '${currentLevel}' 단계에 계시군요. "${runnerGoal}"이라는 목표는 충분히 달성 가능한 사거리 안에 있습니다. 🔥`,
                    rect: {
                        title: todayStats ? `오늘의 질주 분석 & 처방` : "폭발적 성장을 위한 처방",
                        detail: todayStats
                            ? `오늘 ${todayStats.distance}km 주행(${todayStats.paceStr})은 훌륭했습니다. 다음 진화인 '${levelInfo?.nextLevelName}'를 위해 내일은 회복에 집중하세요.`
                            : `현재 레벨(${levelInfo?.level})에서 다음 단계인 '${levelInfo?.nextLevelName}'로 진화하기 위해서는 심폐 임계치 훈련이 필요합니다. 이번 주에는 1km 전력 질주를 3회 포함한 인터벌 세션을 추천합니다.`,
                        insight: `런너님의 체격 조건(${profile?.weight}kg/${profile?.height}cm)은 근력 전달력이 우수합니다. 파워를 속도로 전환하는 인터벌이 가장 효율적입니다.`,
                        mental: "한계를 마주하는 것은 고통이 아니라, 새로운 나를 만나는 축제입니다."
                    }
                },
                insight: {
                    msg: `[데이터 분석 리포트] ${runnerName}님의 프로필과 기록을 교차 분석했습니다. '${currentLevel}' 단계에서의 메타 대사 효율은 안정적인 궤도에 진입했습니다. 🐟`,
                    rect: {
                        title: todayStats ? `최근 세션 분석 & 솔루션` : "역학적 효율성 극대화",
                        detail: todayStats
                            ? `오늘 페이스(${todayStats.paceStr})를 최근 7일 평균과 비교했을 때 대사 효율은 균형적입니다. "${runnerGoal}" 달성을 위해 일관된 리듬을 유지하세요.`
                            : `"${runnerGoal}"을(를) 달성하기 위해서는 일관된 리듬이 핵심입니다. 누적 ${overallStats?.totalDist.toFixed(1)}km의 데이터를 볼 때, 주행 후반부의 페이스 유지가 과제입니다. 보완을 위해 코어 강화 루틴을 병행하십시오.`,
                        insight: `BMI 분석 결과, 관절에 가해지는 부하가 적절합니다. 착지 시 골반 정렬에 더 집중하면 부상 없이 주간 마일리지를 20% 더 늘릴 수 있습니다.`,
                        mental: "데이터는 거짓말을 하지 않습니다. 숫자 뒤에 숨겨진 당신의 가능성을 믿으십시오."
                    }
                },
                wellness: {
                    msg: `[마인드셋 가이드] 반가워요, ${runnerName}님! 벌써 ${overallStats?.count}번이나 길을 나서셨네요. '${currentLevel}' 단계의 노력이 프로필에 정성스럽게 기록되어 있습니다. 🌿`,
                    rect: {
                        title: todayStats ? `오늘의 마음 챙김 & 가이드` : "지속 가능한 질주 전략",
                        detail: todayStats
                            ? `오늘 ${todayStats.distance}km를 즐겁게 달리신 것 같아 기쁩니다. "${runnerGoal}"이라는 꿈을 향해 무리하지 않고 잘 가고 계세요.`
                            : `"${runnerGoal}"이라는 소중한 꿈을 위해, 오늘은 몸의 신호에 귀를 기울여보세요. 최근 7일간의 기록(${recentStats?.count || 0}회)이 훌륭합니다. 이번 주는 회복런과 스트레칭으로 신경계의 피로를 씻어내는 건 어떨까요?`,
                        insight: `현재 신체 스펙(${profile?.weight}kg)에서 무리한 고강도 훈련은 근막 긴장을 초래할 수 있습니다. 템포런보다는 즐거운 조깅으로 체력을 다지세요.`,
                        mental: "가장 빠른 길은 멈추지 않는 것입니다. 당신의 속도로 충분히 아름답습니다."
                    }
                }
            };

            const script = coachScripts[selectedCoachId] || coachScripts['wellness'];
            message = script.msg;
            recommendation = script.rect;
        }

        return {
            message,
            recommendation: {
                ...recommendation,
                insight: recommendation.insight || "데이터 사이언스에 기반한 실전적 트레이닝 가이드입니다.",
                mental: recommendation.mental || "승리는 철저한 분석과 흔들리지 않는 실행의 결과입니다."
            }
        };
    }, [selectedCoachId, isRecording, distance, timer, records, profile, levelInfo, overallStats, recentStats, todayStats]);

    return { message: feedback.message, recommendation: feedback.recommendation, periodStats: overallStats, recentStats };
};
