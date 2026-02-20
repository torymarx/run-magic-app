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
    baselines: any,
    lastSavedRecord: any,
    viewingDate: Date // 신규: 조회 날짜 기반 분석 기능
) => {
    // 1. 특정 기간 (올해 1월 1일 ~ viewingDate) 데이터 필터링 및 분석
    const periodStats = useMemo(() => {
        if (!Array.isArray(records) || records.length === 0) return null;

        const startOfYear = new Date(viewingDate.getFullYear(), 0, 1);
        const endOfTarget = new Date(viewingDate);
        endOfTarget.setHours(23, 59, 59, 999);

        const periodRecords = records.filter(r => {
            const d = new Date(r.date);
            return d >= startOfYear && d <= endOfTarget;
        });

        if (periodRecords.length === 0) return null;

        const totalDist = periodRecords.reduce((sum, r) => sum + (r.distance || 0), 0);
        const totalSec = periodRecords.reduce((sum, r) => sum + parseTimeToSeconds(r.totalTime || "00:00"), 0);
        const avgPaceSec = totalDist > 0 ? totalSec / totalDist : 0;

        return {
            count: periodRecords.length,
            totalDist,
            totalHours: (totalSec / 3600).toFixed(1),
            avgPaceStr: formatPace(avgPaceSec),
            lastDate: periodRecords[0].date // 가장 최근 기록일
        };
    }, [records, viewingDate]);

    // Get latest weight from records or a default
    const latestWeight = useMemo(() => {
        if (lastSavedRecord?.weight) return lastSavedRecord.weight;
        if (records.length > 0) return records[0].weight;
        return 70; // Default
    }, [records, lastSavedRecord]);

    const feedback = useMemo(() => {
        let message = "";
        let recommendation: Recommendation = { title: "오늘의 추천", detail: "준비 운동 후 가볍게 시작하세요." };

        // 1. Logic during Recording
        if (isRecording) {
            const currentPaceSeconds = distance > 0 ? timer / distance : 0;
            const currentPaceStr = formatPace(currentPaceSeconds);

            switch (selectedCoachId) {
                case 'apex':
                    message = "미토콘드리아가 에너지를 폭발시키고 있습니다! 한계를 넘어서야 생합성이 시작됩니다! 🔥";
                    recommendation = {
                        title: "카보넨 공식 고강도 훈련",
                        detail: "현재 최대 심박수의 90% 구간입니다. 30초만 더 버티며 속도 지구력을 임계치까지 끌어올리세요!"
                    };
                    break;
                case 'insight':
                    message = `현재 페이스 ${currentPaceStr}. 상체 5도 전경 자세를 유지하여 중력을 추진력으로 활용하세요. 🐟`;
                    recommendation = {
                        title: "생체역학적 효율 극대화",
                        detail: "시선을 전방 15m에 두어 기도를 확보하고 호흡 효율을 높이세요. 제동력을 최소화하는 구간입니다."
                    };
                    break;
                case 'atlas':
                    message = "스포츠 심장의 기초를 다지는 중입니다. 혈액 박출량을 늘리기 위해 일정한 리듬에 집중하세요. 🏛️";
                    recommendation = {
                        title: "기초 지구력 (LSD) 구간",
                        detail: "심박수 50-70% 구간(Zone 2)을 유지하세요. 지방 대사 효율을 높이는 가장 정교한 방법입니다."
                    };
                    break;
                case 'swift':
                    message = "팔 스윙의 진자 운동이 느껴지나요? 하체의 보폭수(Cadence)와 리듬을 완벽히 동기화하세요! ⚡";
                    recommendation = {
                        title: "리드미컬 텐션 부스팅",
                        detail: "팔꿈치 각도를 90-110도로 유지하고 몸에 가깝게 붙이세요. 불필요한 회전 관성을 줄여야 합니다."
                    };
                    break;
                case 'zen':
                    message = "횡격막을 이용한 깊은 복식 호흡에 집중하세요. 발걸음에 맞춰 '습-습-후-후' 리듬을 타세요. 🧘";
                    recommendation = {
                        title: "자율신경계 안정화",
                        detail: "폐 하부까지 산소를 공급하여 혈액 내 산소 포화도를 높이세요. 지면의 감촉을 온전히 느끼는 시간입니다."
                    };
                    break;
                case 'marathon':
                    message = `현재 페이스 ${currentPaceStr}. 미드풋(Mid-foot) 착지의 탄성 에너지를 활용하여 관절 충격을 분산하세요. 🏃‍♂️`;
                    recommendation = {
                        title: "공학적 착지 메커니즘",
                        detail: "무게 중심 바로 아래에 발이 위치하도록 보폭을 조절하세요. SSC(신장-단축 주기)를 활용할 때입니다."
                    };
                    break;
                case 'wellness':
                    message = "기후 환경에 몸이 적응하고 있습니다. 체온 조절과 수분 상태를 수시로 체크하세요. 🌿";
                    recommendation = {
                        title: "환경 적응 & 부상 방지",
                        detail: "무릎 바깥쪽이나 정강이에 미세한 신호가 오면 즉시 속도를 낮추세요. RICE 요법보다 예방이 우선입니다."
                    };
                    break;
            }
        }
        // 2. Logic after Saving Record (Results Analysis)
        else if (lastSavedRecord && baselines[selectedCoachId]) {
            const lastPaceSec = parseTimeToSeconds(lastSavedRecord.pace);
            const baselineSec = baselines[selectedCoachId];
            const diff = baselineSec - lastPaceSec;
            const diffStr = formatPace(Math.abs(diff));
            const isFaster = diff > 0;

            switch (selectedCoachId) {
                case 'apex':
                    message = isFaster
                        ? `월간 한계를 ${diffStr}이나 깼습니다! 미토콘드리아의 크기와 수가 비약적으로 증가했을 겁니다! 🦾`
                        : `오늘의 자극은 세포를 깨우기에 부족했습니다. 내일은 스트라이드(Stride) 질주 5세트 추가를 권장합니다. 🔥`;
                    recommendation = {
                        title: "미토콘드리아 생합성 처방",
                        detail: "고강도 인터벌 후에는 완전한 회복이 필요합니다. 48시간 내에 저강도 리커버리 런을 배치하세요."
                    };
                    break;
                case 'insight':
                    const efficiency = (lastSavedRecord.calories / latestWeight).toFixed(2);
                    message = `체중 ${latestWeight}kg 기준, km당 대사 효율은 ${efficiency}입니다. ${isFaster ? '역학적 밸런스가 최고조네요.' : '상체 정렬이 흐트러지며 에너지가 누수되었습니다.'} 🐟`;
                    recommendation = {
                        title: "탄단비 4:1 골든타임",
                        detail: "종료 후 60분 이내에 탄수화물과 단백질을 4:1 비율로 섭취하여 글리코겐을 즉시 보충하세요."
                    };
                    break;
                case 'atlas':
                    message = isFaster
                        ? `모세혈관망이 촘촘해지는 소리가 들리네요! 점진적 과부하 원칙을 아주 정교하게 따르고 계십니다. 🏛️`
                        : `기초 체력 배양 구간입니다. 기록보다는 주간 누적 거래량을 채웠다는 것에 큰 의미를 두세요. 🏛️`;
                    recommendation = {
                        title: "스포츠 심장 강화 전략",
                        detail: "1회 혈액 박출량(Stroke Volume) 증가를 위해 주말에는 평소보다 20% 긴 LSD 코스를 추천합니다."
                    };
                    break;
                case 'swift':
                    message = isFaster
                        ? `오늘 리듬감은 예술이었습니다! 팔 스윙과 보폭의 동기화가 데이터로 증명되고 있어요. ⚡`
                        : `리듬이 다소 무거웠습니다. 다음엔 180 SPM 비트의 음악으로 신경계 반응 속도를 높여보세요! ⚡`;
                    recommendation = {
                        title: "신경-근육 반응 속도 개선",
                        detail: "하체 순발력 보강을 위해 러닝 종료 후 80m 스트라이드 질주 4세트를 루틴에 추가하세요."
                    };
                    break;
                case 'zen':
                    message = isFaster
                        ? `회복 러닝중에도 컨디션이 좋아 보이네요. 횡격막의 부드러운 가동 범위가 확보된 결과입니다! 🧘`
                        : `가장 느렸지만 가장 심오한 러닝이었습니다. 자율신경계가 완벽하게 리셋되었을 거예요. 🧘`;
                    recommendation = {
                        title: "심리적 회복력(Resilience)",
                        detail: "오늘은 따뜻한 카모마일 티로 몸의 독소를 배출하고 11시 전 취침하여 엔도르핀을 수면으로 연결하세요."
                    };
                    break;
                case 'marathon':
                    message = isFaster
                        ? `서브-4 페이스 안착! 미드풋 착지로 관절 부하를 줄이면서도 탄성을 아주 영리하게 쓰셨습니다. 🏃‍♂️`
                        : `페이스는 밀렸지만 지형 적응력은 좋았습니다. 언덕 달리기가 종아리와 대둔근을 강화시켰을 거예요. 🏃‍♂️`;
                    recommendation = {
                        title: "편심성 수축(Eccentric) 보강",
                        detail: "아킬레스건염 예방을 위해 계단 끝에서 뒤꿈치를 천천히 내리는 카프 레이즈 3세트를 실시하세요."
                    };
                    break;
                case 'wellness':
                    message = `오늘 기후 대비 레이어링 시스템이 적절했습니다. 수분과 전해질 균형도 데이터상 안정권이네요. 🌿`;
                    recommendation = {
                        title: "저나트륨혈증 예방 가이드",
                        detail: "땀을 많이 흘렸다면 물만 마시지 말고 6-8% 농도의 전해질 음료로 혈중 나트륨 농도를 맞추세요."
                    };
                    break;
            }
        }
        // 3. Dynamic Analysis based on viewingDate (Idle State)
        else if (periodStats) {
            const { count, totalDist, totalHours, avgPaceStr } = periodStats;
            const dateStr = viewingDate.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });

            switch (selectedCoachId) {
                case 'apex':
                    message = `1월부터 ${dateStr}까지 총 ${count}회, ${totalDist.toFixed(1)}km를 돌파했습니다. 평균 페이스 ${avgPaceStr}... 아직 심장이 터질 것 같지는 않군요. 인터벌 비중을 높여 한계를 시험하세요! 🔥`;
                    recommendation = { title: "젖산 역치 파괴 전략", detail: "현재 페이스보다 15초 빠른 속도로 400m 반복 주를 실시하여 무산소 역량 임계치를 높이세요." };
                    break;
                case 'insight':
                    const metabolicLoad = (totalDist * 50).toFixed(0); // 임의의 칼로리 소모량 계산
                    message = `${dateStr} 시점까지의 누적 데이터 분석 완료. 약 ${metabolicLoad}kcal를 연소하며 신진대사 효율을 개선했습니다. 하지만 최근 ${avgPaceStr} 페이스 유지는 상체 하중 이동이 불안정해 보입니다. 🐟`;
                    recommendation = { title: "대사 효율 정밀 진단", detail: "러닝 전 동적 스트레칭으로 고관절 가동 범위를 확보하여 에너지 누수를 차단하세요." };
                    break;
                case 'atlas':
                    message = `${totalHours}시간 동안 지치지 않고 달리며 스포츠 심장을 단련해 오셨군요. ${totalDist.toFixed(1)}km의 누적 성장은 모세혈관 발달의 증거입니다. 이제 거리를 15% 더 늘려볼까요? 🏛️`;
                    recommendation = { title: "심장 용적 확대 훈련", detail: "주 1회는 페이스를 잊고 90분 이상의 초장거리 저강도 주행(LSD)에만 집중해 보세요." };
                    break;
                case 'swift':
                    message = `와우! ${dateStr}까지 총 ${count}회의 세션을 힙하게 소화하셨네요. ${avgPaceStr}의 평균 리듬은 나쁘지 않지만, 팔 스윙의 진동을 더 예리하게 다듬으면 더 멋진 주행이 가능합니다! ⚡`;
                    recommendation = { title: "리듬 & 케이던스 튜닝", detail: "분당 180보의 케이던스를 목표로 짧고 경쾌하게 지면을 차는 연습을 추가하세요." };
                    break;
                case 'zen':
                    message = `${dateStr}까지 ${totalHours}시간 동안 온전히 자신과 마주하셨네요. ${totalDist.toFixed(1)}km라는 숫자에 연연하지 마세요. 호흡 노이즈가 줄어들고 마음이 평온해진 것이 진정한 성과입니다. 🧘`;
                    recommendation = { title: "명상적 호흡 심화", detail: "달리는 중 주변 소리에 귀 기울이며 나의 호흡이 자연의 일부가 되는 경험을 해 보세요." };
                    break;
                case 'marathon':
                    message = `풀코스 정복을 위한 데이터 축적이 순조롭습니다. ${dateStr} 기준 평균 페이스 ${avgPaceStr}은 안정적인 베이스를 의미해요. 미드풋 착지의 탄성이 익숙해지고 있는 것 같습니다. 🏃‍♂️`;
                    recommendation = { title: "탄성 에너지 활용 극대화", detail: "발목의 힘이 아닌 허벅지 뒤쪽(햄스트링)을 끌어올리는 느낌으로 착지 대미지를 줄이세요." };
                    break;
                case 'wellness':
                    message = `1월 1일부터 ${dateStr}까지 부상 없이 ${count}회 주행을 이어온 것은 대단한 신체 조절 능력입니다. ${totalDist.toFixed(1)}km의 여정 동안 큰 무리가 없었는지 Bio-Signal을 체크하세요. 🌿`;
                    recommendation = { title: "전해질 및 수면 관리", detail: "누적 피로가 쌓이는 시점입니다. 마그네슘 섭취를 늘리고 수면 시간을 30분만 더 확보하세요." };
                    break;
                default:
                    message = "과거 데이터를 분석하여 런너님의 성과를 진단하고 있습니다.";
            }
        }
        else {
            message = "조회된 데이터가 없습니다. 새로운 질주를 시작하고 과학적 분석을 받아보세요!";
            recommendation = { title: "첫 번째 질주 제안", detail: "가벼운 2km 조깅으로 생체 데이터를 축적하기 시작하세요." };
        }

        return {
            message,
            recommendation: {
                ...recommendation,
                insight: selectedCoachId === 'insight' ? "지면 접촉 시간을 줄이고 반발력을 극대화하는 구간입니다." : "에너지 효율성 최적화를 위한 정밀 분석 데이터입니다.",
                mental: "승리는 자신을 믿는 것에서 시작됩니다. 오늘의 질주를 즐기세요!"
            }
        };
    }, [selectedCoachId, isRecording, distance, timer, records, baselines, lastSavedRecord, latestWeight, periodStats, viewingDate]);

    return { message: feedback.message, recommendation: feedback.recommendation, periodStats };
};
