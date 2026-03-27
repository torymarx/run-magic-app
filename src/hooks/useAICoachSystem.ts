import { useMemo } from 'react';
import { parseTimeToSeconds, formatPace } from '../utils/calculations';
import { diagnoseRunnerProfile, getProfileKoreanName, getDetailedPrescription, getInitialConsultation, InitialConsultation } from '../utils/coachUtils';
import { calculateVDOT, getRecommendedPaces, getIntensityLabel, RecommendedPaces } from '../utils/vdotUtils';

interface Recommendation {
    title: string;
    detail: string;
    insight: string;
    mental: string;
    vdotInfo?: {
        value: number;
        paces: RecommendedPaces;
        currentIntensity: string;
    };
    initialDiagnosis?: InitialConsultation;
}

interface AICoachSystemReturn {
    message: string;
    recommendation: Recommendation;
    periodStats: any;
    recentStats: any;
    runnerProfile: string;
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
): AICoachSystemReturn => {
    // 0. 기반 데이터 정의: 현재 세션 또는 가장 최근 기록
    const effectiveRecord = lastSavedRecord || (Array.isArray(records) && records.length > 0 ? records[0] : null);

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
            lastHeartRate: effectiveRecord?.hr || effectiveRecord?.heart_rate,
            lastCadence: effectiveRecord?.cad || effectiveRecord?.cadence
        };
    }, [records, effectiveRecord]);

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
    const todayStats = useMemo(() => {
        if (effectiveRecord) {
            const paceSec = parseTimeToSeconds(effectiveRecord.pace || "0:00");
            const distance = effectiveRecord.distance || 0;
            const timeMin = parseTimeToSeconds(effectiveRecord.totalTime || "0:00") / 60;
            const vdotValue = calculateVDOT(distance, timeMin);

            return {
                paceSec,
                distance,
                isImproved: effectiveRecord.isImproved,
                paceStr: effectiveRecord.pace || "0'00\"",
                heartRate: effectiveRecord.heart_rate || effectiveRecord.hr,
                cadence: effectiveRecord.cadence || effectiveRecord.cad,
                vdot: vdotValue
            };
        }
        return null;
    }, [effectiveRecord]);

    const feedback = useMemo(() => {
        let message = "";
        let recommendation: any = { title: "전략적 분석", detail: "당신의 러닝 데이터를 분석 중입니다." };

        const runnerGoal = profile?.goal || "멋지게 달리기";
        const runnerName = profile?.name || "런너";
        const currentLevel = levelInfo?.name || "비기너";

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
                atlas: {
                    msg: `항상성 유지 분석: 페이스 ${paceStr}. 엔진의 기초를 다지는 저강도 지속주 구간입니다. 조급해하지 마세요. 🏛️`,
                    rect: {
                        title: "LSD 기반 기초 지구력 빌드업",
                        detail: "심박수가 요동치지 않도록 리듬을 일정하게 유지하세요. 지금 쌓는 이 낮은 강도의 마일리지가 훗날 고강도 인터벌의 든든한 버팀목이 됩니다."
                    }
                },
                swift: {
                    msg: `비트와 함께 달리세요! 페이스 ${paceStr}. 당신의 케이던스는 한 편의 음악과 같습니다. 경쾌하게! ⚡`,
                    rect: {
                        title: "신경-근육 협응성 및 템포 리듬",
                        detail: "팔을 뒤로 치는 동작을 더 간결하게 가져가세요. 상체의 리듬이 하체로 전달될 때, 가장 효율적인 추진력이 발생합니다. 지면을 밀어내지 말고 스치듯 달리세요."
                    }
                },
                marathon: {
                    msg: `페이스 ${paceStr} 유지 중. 착지 시 발바닥의 탄성을 이용하세요. 코스 전체를 조망하는 현명한 러닝입니다. 🏃‍♂️`,
                    rect: {
                        title: "장거리 효율성 및 착지 메커니즘",
                        detail: "발의 뒷꿈치가 아닌 중앙으로 지면을 누르듯 착지하여 충격을 탄성으로 전환하십시오. 이 주법이 에너지를 보존하며 목적지까지 당신을 실어 나를 것입니다."
                    }
                },
                zen: {
                    msg: `심박과 호흡이 조밀해지고 있습니다. 페이스 ${paceStr}. 내면의 소리에 귀 기울이며 몸의 긴장을 걷어내세요. 🧘`,
                    rect: {
                        title: "마인드풀니스 및 횡격막 호흡",
                        detail: "코로 깊게 마시고 입으로 길게 내뱉으세요. 호흡이 차분해지면 부하가 걸린 근육도 부드럽게 이완됩니다. 기록이라는 압박에서 벗어나 지금 이 순간을 즐기세요."
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
        } else {
            const getCoachMessage = (coachId: string) => {
                switch(coachId) {
                    case 'apex': return `[성장 로드맵] ${runnerName}님, 현재 '${currentLevel}' 단계에 계시군요. "${runnerGoal}"이라는 목표는 단순한 열망을 넘어, 정밀한 훈련 데이터를 통해 충분히 요격 가능한 사거리 안에 들어왔습니다. 🔥`;
                    case 'insight': return `[알고리즘 분석 리포트] ${runnerName}님의 프로필과 주행 빅데이터를 정밀 교차 분석했습니다. '${currentLevel}' 단계에서의 대사 효율과 에너지 효율성은 이미 상위 15%의 안정 궤도에 진입했습니다. 🐟`;
                    case 'atlas': return `[지구력 아카이브] ${runnerName}님, '${currentLevel}' 레벨의 마일리지가 차곡차곡 쌓이고 있습니다. "${runnerGoal}"을 향한 기초 공사가 아주 견고합니다. 🏛️`;
                    case 'swift': return `[리듬 플레이리스트] 활력이 넘치는군요, ${runnerName}님! '${currentLevel}'의 에너지가 질주 리듬에 고스란히 묻어납니다. ⚡`;
                    case 'zen': return `[심신 안정 가이드] 평온한 질주였나요? '${currentLevel}' 단계에서 몸의 소리를 듣는 법을 익히셨네요. 🧘`;
                    case 'marathon': return `[코스 전략 리포트] 꾸준함이 돋보입니다. '${currentLevel}' 레벨에서의 성실함이 "${runnerGoal}" 달성의 열쇠가 될 것입니다. 🏃‍♂️`;
                    default: return `[바이오 리드믹 가이드] 따뜻한 응원을 보냅니다, ${runnerName}님! 벌써 ${overallStats?.count}번이나 세상을 향해 발을 내디디셨네요. '${currentLevel}' 단계의 정성 어린 기록들이 당신의 미래를 밝히고 있습니다. 🌿`;
                }
            };

            let todayPres: any = null;
            if (todayStats && effectiveRecord) {
                todayPres = getDetailedPrescription(diagnoseRunnerProfile(effectiveRecord), selectedCoachId, {
                    heartRate: todayStats.heartRate,
                    cadence: todayStats.cadence,
                    weight: profile?.weight,
                    pace: todayStats.paceSec
                });
            }

            const coachScripts: Record<string, any> = {
                generic: {
                    msg: getCoachMessage(selectedCoachId),
                    rect: {
                        title: todayStats ? `오늘의 전술적 질주 분석 & 처방` : "로드맵 진화 가이드",
                        detail: todayStats && effectiveRecord && todayPres
                            ? (() => {
                                const vdotPaces = getRecommendedPaces(todayStats.vdot);
                                let vdotTip = "";
                                if (todayStats.vdot > 0) {
                                    vdotTip = `\n\n📊 VDOT 분석(${todayStats.vdot.toFixed(1)}): 이 기록을 바탕으로 산출된 추천 훈련 페이스입니다.\n• 조깅(Easy): ${vdotPaces.easy}\n• 유산소역치: ${vdotPaces.threshold}\n• 인터벌: ${vdotPaces.interval}`;
                                }
                                return `오늘 ${todayStats.distance}km 주행(${todayStats.paceStr}) 분석 결과입니다.\n\n⚠️ 현재 상태: ${todayPres.issue}\n\n💡 개선점: ${todayPres.improvement}\n\n🗓️ 내일의 과제: ${todayPres.nextTask}${vdotTip}`;
                            })()
                            : (() => {
                                const weight = profile?.weight || 70;
                                const height = profile?.height || 175;
                                const initial = getInitialConsultation(weight, height, selectedCoachId);
                                return `환영합니다! 아직 기록이 없지만, 런너님의 신체 데이터(BMI: ${initial.bmi.toFixed(1)})를 기반으로 수립한 초기 전략입니다.\n\n⚠️ 가이드라인: ${initial.advice.issue}\n\n💡 추천 시작법: ${initial.advice.improvement}\n\n🗓️ 첫 번째 미션: ${initial.advice.nextTask}`;
                            })(),
                        insight: todayStats && effectiveRecord && todayPres
                            ? `런싱크 진단: ${getProfileKoreanName(diagnoseRunnerProfile(effectiveRecord))}. ${todayPres.insight}${todayStats && todayStats.vdot > 0 ? ` [강도: ${getIntensityLabel(todayStats.vdot, todayStats.paceSec)}]` : ''}`
                            : (() => {
                                const weight = profile?.weight || 70;
                                const height = profile?.height || 175;
                                const initial = getInitialConsultation(weight, height, selectedCoachId);
                                return `신체 프로필 분석 결과: ${initial.bmiCategory}군에 해당합니다. ${initial.advice.insight}`;
                            })(),
                        mental: todayStats && effectiveRecord && todayPres
                            ? todayPres.mental
                            : (() => {
                                const weight = profile?.weight || 70;
                                const height = profile?.height || 175;
                                const initial = getInitialConsultation(weight, height, selectedCoachId);
                                return initial.advice.mental;
                            })(),
                        vdotInfo: todayStats && todayStats.vdot > 0 ? {
                            value: todayStats.vdot,
                            paces: getRecommendedPaces(todayStats.vdot),
                            currentIntensity: getIntensityLabel(todayStats.vdot, todayStats.paceSec)
                        } : undefined,
                        initialDiagnosis: !todayStats || !effectiveRecord ? getInitialConsultation(profile?.weight || 70, profile?.height || 175, selectedCoachId) : undefined
                    }
                }
            };

            const script = coachScripts['generic'];
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
        recommendation: feedback.recommendation as Recommendation, 
        periodStats: overallStats, 
        recentStats,
        runnerProfile: effectiveRecord ? diagnoseRunnerProfile(effectiveRecord) : 'UNKNOWN'
    };
};
