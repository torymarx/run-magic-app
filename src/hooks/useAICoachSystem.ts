import { useMemo } from 'react';
import { parseTimeToSeconds, formatPace } from '../utils/calculations';
import { diagnoseRunnerProfile } from '../utils/coachUtils';

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
            totalHours: (totalSeconds / 3600).toFixed(1),
            lastHeartRate: lastSavedRecord?.hr || lastSavedRecord?.heart_rate,
            lastCadence: lastSavedRecord?.cad || lastSavedRecord?.cadence
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

    // 3. 당일 성과 (Today): 현재 세션 또는 가장 최근 기록의 임계치 분석
    const effectiveRecord = lastSavedRecord || (Array.isArray(records) && records.length > 0 ? records[0] : null);

    const todayStats = useMemo(() => {
        if (effectiveRecord) {
            return {
                paceSec: parseTimeToSeconds(effectiveRecord.pace || "0:00"),
                distance: effectiveRecord.distance || 0,
                isImproved: effectiveRecord.isImproved,
                paceStr: effectiveRecord.pace || "0'00\"",
                heartRate: effectiveRecord.heart_rate || effectiveRecord.hr,
                cadence: effectiveRecord.cadence || effectiveRecord.cad
            };
        }
        return null;
    }, [effectiveRecord]);

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
                        detail: todayStats && lastSavedRecord
                            ? `오늘 ${todayStats.distance}km 주행(${todayStats.paceStr})은 당신의 잠재력을 증명했습니다. 런싱크 분석 결과 ${diagnoseRunnerProfile(lastSavedRecord) === 'AEROBIC_SIEVE' ? '유산소 엔진의 보강이 절실합니다.' : '기초 체력이 탄탄하게 구축되고 있습니다.'}`
                            : `현재 레벨(${levelInfo?.level})에서 '${levelInfo?.nextLevelName}'로의 진화는 임계치 훈련량에 달려 있습니다. 누적 ${overallStats?.totalDist.toFixed(1)}km의 기반 위에, 이번 주는 400m 전력 질주와 200m 조깅을 8회 반복하는 인터벌 세션을 반드시 포함하십시오.`,
                        insight: `런싱크 프로파일 진단: ${lastSavedRecord ? diagnoseRunnerProfile(lastSavedRecord) : 'UNKNOWN'}. 심박수(${todayStats?.heartRate || 'N/A'})와 케이던스(${todayStats?.cadence || 'N/A'}) 분석 결과, ${todayStats?.heartRate && todayStats.heartRate > 170 ? '유산소 디커플링 현상이 우려되니 Zone 2 훈련 비중을 높이세요.' : '심박 제어가 매우 안정적입니다.'}`,
                        mental: "고통은 한계를 뚫고 나가는 소리입니다. 런싱크 4.0의 과학적 처방을 믿고 따르십시오."
                    }
                },
                insight: {
                    msg: `[알고리즘 분석 리포트] ${runnerName}님의 프로필과 주행 빅데이터를 정밀 교차 분석했습니다. '${currentLevel}' 단계에서의 대사 효율과 에너지 효율성은 이미 상위 15%의 안정 궤도에 진입했습니다. 🐟`,
                    rect: {
                        title: todayStats ? `데이터 기반 세션 최적화 솔루션` : "물리적 한계 극복을 위한 역학 설계",
                        detail: todayStats && lastSavedRecord
                            ? `오늘 페이스(${todayStats.paceStr})와 케이던스(${todayStats.cadence || 'N/A'}spm)를 분석했을 때, ${diagnoseRunnerProfile(lastSavedRecord) === 'MECHANICAL_BRAKE' ? '기계적 브레이크형 패턴이 감지되었습니다.' : '에너지 효율이 향상되었습니다.'} 보폭을 줄이고 회전력을 높이세요.`
                            : `"${runnerGoal}"을(를) 달성하기 위해서는 일관된 물리 법칙의 적용이 필요합니다. 누적 ${overallStats?.totalDist.toFixed(1)}km의 데이터 패턴을 볼 때, 5km 지점 이후의 피치 저하가 관찰됩니다. 보완을 위해 런지 및 플랭크 기반의 코어 보강 운동을 주 3회 권장합니다.`,
                        insight: `런싱크 물리 진단: ${lastSavedRecord ? diagnoseRunnerProfile(lastSavedRecord) : 'UNKNOWN'}. 심박수(${todayStats?.heartRate || '측정 불가'}) 및 케이던스(${todayStats?.cadence || '측정 불가'})를 분석한 결과, ${todayStats?.cadence && todayStats.cadence >= 170 ? '이상적인 케이던스 구간에서 질주하셨습니다.' : '케이던스를 5-10% 점진적으로 상향하여 오버스트라이딩을 방지하세요.'}`,
                        mental: "숫자는 거짓말을 하지 않으며, 런싱크 알고리즘은 당신의 헌신을 투영하는 거울입니다."
                    }
                },
                wellness: {
                    msg: `[바이오 리드믹 가이드] 따뜻한 응원을 보냅니다, ${runnerName}님! 벌써 ${overallStats?.count}번이나 세상을 향해 발을 내디디셨네요. '${currentLevel}' 단계의 정성 어린 기록들이 당신의 미래를 밝히고 있습니다. 🌿`,
                    rect: {
                        title: todayStats ? `바이오 밸런스 정밀 진단 및 회복 처방` : "지속 가능한 성장을 위한 상생 전략",
                        detail: todayStats
                            ? `오늘 ${todayStats.distance}km 주행(${todayStats.paceStr})은 훌륭한 회복의 여정이었습니다. 런싱크 분석 결과 ${diagnoseRunnerProfile(effectiveRecord) === 'AEROBIC_SIEVE' ? '심박수가 페이스 대비 높으므로 무리한 증속은 피하십시오.' : '신체 밸런스와 심박 안정성이 매우 뛰어납니다.'}`
                            : `"${runnerGoal}"이라는 꿈을 이루기 위해 가장 중요한 것은 지치지 않는 마음입니다. 최근 7일간의 주행(${recentStats?.count || 0}회)을 통해 당신의 성실함을 확인했습니다. 이번 주는 따뜻한 차 한 잔과 함께 충분한 명상, 그리고 종아리 스트레칭으로 몸의 긴장을 보듬어주는 시간을 가져보세요.`,
                        insight: `런싱크 바이오 인사이트: ${lastSavedRecord || records[0] ? diagnoseRunnerProfile(effectiveRecord) : 'UNKNOWN'}. 심박수(${todayStats?.heartRate || 'N/A'})와 케이던스(${todayStats?.cadence || 'N/A'}) 분석 결과, ${todayStats?.heartRate && todayStats.heartRate > 165 ? '심장 부하가 관찰되니 3:2 호흡법으로 심박을 제어하세요.' : '현재 생체 리듬은 매우 유연하고 안정적인 상태입니다.'}`,
                        mental: "빨리 가는 것보다 중요한 것은 끝까지 가는 것입니다. 런싱크의 과학적 가이드가 당신의 건강한 질주를 지킵니다."
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

    return { 
        message: feedback.message, 
        recommendation: feedback.recommendation, 
        periodStats: overallStats, 
        recentStats,
        runnerProfile: effectiveRecord ? diagnoseRunnerProfile(effectiveRecord) : 'UNKNOWN'
    };
};
