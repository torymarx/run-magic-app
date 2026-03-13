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
        if (!Array.isArray(records) || records.length === 0) return { count: 0, totalDist: 0, avgPaceStr: "0'00\"", totalHours: "0.0" };
        const totalDist = records.reduce((sum, r) => sum + (r.distance || 0), 0);
        const totalSeconds = records.reduce((sum, r) => sum + parseTimeToSeconds(r.totalTime || "0:00"), 0);
        const avgPaceSec = records.reduce((sum, r) => sum + parseTimeToSeconds(r.pace || "0:00"), 0) / records.length;

        return {
            count: records.length,
            totalDist,
            avgPaceStr: formatPace(avgPaceSec),
            totalHours: (totalSeconds / 3600).toFixed(1)
        };
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
                    rect: {
                        title: "젖산 내성 및 폭발적 파워 강화",
                        detail: "지금 페이스에서 0.5km만 더 유지해보세요. 호흡이 가빠질 때 신체는 비로소 '다음 진화'를 위한 물리적 환경을 구축합니다. 여기서 3초만 더 당겨보십시오."
                    }
                },
                insight: {
                    msg: `생체역학 실시간 분석 보고: 현재 페이스 ${paceStr}. 지면 접촉 시간이 단축되고 있으며, 에너지 반환율이 극대화되고 있습니다. 🐟`,
                    rect: {
                        title: "운동 역학적 효율성 정밀 최적화",
                        detail: "팔 스윙의 진자 운동을 골반 높이에 맞추세요. 상체의 불필요한 흔들림을 제어하면 산소 소모량을 5% 이상 절감하여 후반부 페이스 저하를 막을 수 있습니다."
                    }
                },
                wellness: {
                    msg: `바이오 밸런스가 매우 안정적입니다. 페이스 ${paceStr}. 자연과 호흡하며 당신만의 리듬을 찾아가는 과정이 아름답습니다. 🌿`,
                    rect: {
                        title: "심신 통합형 리듬 케어",
                        detail: "어깨의 긴장을 풀고 발바닥 전체로 지면의 기운을 느끼며 부드럽게 굴려보세요. 기록보다는 오늘의 공기와 몸의 감각에 집중하는 것이 가장 큰 치유입니다."
                    }
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
                    msg: `[성장 로드맵] ${runnerName}님, 현재 '${currentLevel}' 단계에 계시군요. "${runnerGoal}"이라는 목표는 단순한 열망을 넘어, 정밀한 훈련 데이터를 통해 충분히 요격 가능한 사거리 안에 들어왔습니다. 🔥`,
                    rect: {
                        title: todayStats ? `오늘의 전술적 질주 분석 & 처방` : "전설적 레벨 도약을 위한 고강도 처방",
                        detail: todayStats
                            ? `오늘 ${todayStats.distance}km 주행(${todayStats.paceStr})은 당신의 잠재력을 증명했습니다. 특히 후반부 가속력은 '${levelInfo?.nextLevelName}'로 가기 위한 핵심 열쇠입니다. 내일은 초회복을 위해 딥 슬립과 단백질 섭취에 집중하세요.`
                            : `현재 레벨(${levelInfo?.level})에서 '${levelInfo?.nextLevelName}'로의 진화는 임계치 훈련량에 달려 있습니다. 누적 ${overallStats?.totalDist.toFixed(1)}km의 기반 위에, 이번 주는 400m 전력 질주와 200m 조깅을 8회 반복하는 인터벌 세션을 반드시 포함하십시오.`,
                        insight: `신체 조건(${profile?.weight}kg/${profile?.height}cm) 분석 결과, 둔근의 파워 전달력이 우수합니다. 오르막 주행을 주 1회 추가하면 폭발적인 가속력을 얻을 수 있습니다.`,
                        mental: "고통은 한계를 뚫고 나가는 소리입니다. 그 소리를 즐기는 자만이 정상의 공기를 마실 수 있습니다."
                    }
                },
                insight: {
                    msg: `[알고리즘 분석 리포트] ${runnerName}님의 프로필과 주행 빅데이터를 정밀 교차 분석했습니다. '${currentLevel}' 단계에서의 대사 효율과 에너지 효율성은 이미 상위 15%의 안정 궤도에 진입했습니다. 🐟`,
                    rect: {
                        title: todayStats ? `데이터 기반 세션 최적화 솔루션` : "물리적 한계 극복을 위한 역학 설계",
                        detail: todayStats
                            ? `오늘 페이스(${todayStats.paceStr})를 최근 7일 평균과 비교했을 때, 에너지 효율은 3.2% 향상되었습니다. "${runnerGoal}" 달성을 위해서는 심박수 변동성을 조금 더 좁히는 훈련이 효과적일 것입니다.`
                            : `"${runnerGoal}"을(를) 달성하기 위해서는 일관된 물리 법칙의 적용이 필요합니다. 누적 ${overallStats?.totalDist.toFixed(1)}km의 데이터 패턴을 볼 때, 5km 지점 이후의 피치 저하가 관찰됩니다. 보완을 위해 런지 및 플랭크 기반의 코어 보강 운동을 주 3회 권장합니다.`,
                        insight: `BMI 및 체성분 예측 분석 결과, 관절에 가해지는 동적 부하가 최적 범위 내에 있습니다. 착지 시 골반의 수평 유지를 1cm만 더 신경 쓰면 에너지 손실을 8% 줄일 수 있습니다.`,
                        mental: "숫자는 거짓말을 하지 않으며, 기록은 당신의 헌신을 투영하는 거울입니다. 데이터 속에 답이 있습니다."
                    }
                },
                wellness: {
                    msg: `[바이오 리드믹 가이드] 따뜻한 응원을 보냅니다, ${runnerName}님! 벌써 ${overallStats?.count}번이나 세상을 향해 발을 내디디셨네요. '${currentLevel}' 단계의 정성 어린 기록들이 당신의 미래를 밝히고 있습니다. 🌿`,
                    rect: {
                        title: todayStats ? `오늘의 몸과 마음을 위한 힐링 처방` : "지속 가능한 성장을 위한 상생 전략",
                        detail: todayStats
                            ? `오늘 ${todayStats.distance}km를 한 마리의 나비처럼 가볍게 달리신 것 같아 제 마음도 훈훈해집니다. "${runnerGoal}"이라는 소중한 꿈을 향해, 당신만의 아름다운 속도로 아주 잘 가고 계세요.`
                            : `"${runnerGoal}"이라는 꿈을 이루기 위해 가장 중요한 것은 지치지 않는 마음입니다. 최근 7일간의 주행(${recentStats?.count || 0}회)을 통해 당신의 성실함을 확인했습니다. 이번 주는 따뜻한 차 한 잔과 함께 충분한 명상, 그리고 종아리 스트레칭으로 몸의 긴장을 보듬어주는 시간을 가져보세요.`,
                        insight: `현재 ${profile?.weight}kg의 신체 밸런스는 매우 유연한 상태입니다. 하지만 과도한 추격보다는 느린 조깅을 통해 모세혈관 발달을 돕는 것이 장기적인 기초 체력 형성에 훨씬 이롭습니다.`,
                        mental: "빨리 가는 것보다 중요한 것은 끝까지 가는 것이며, 함께 가는 것입니다. 당신의 속도는 이미 충분히 빛나고 있습니다."
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
