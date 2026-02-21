import { Coach, coaches } from '../data/coaches';

/**
 * 기록 데이터를 바탕으로 선택된 코치의 맞춤 조언 메시지를 생성합니다.
 */
export const getCoachAdvice = (record: any, coach: Coach): string => {
    const { temp, condition, isImproved, distance, weight } = record;

    // 1. 특수 상황 (기온)
    if (temp !== undefined) {
        if (temp >= 30) {
            switch (coach.tendency) {
                case 'hard': return `폭염(${temp}°C) 속의 질주는 세포를 강하게 단련시키지만, 과열은 금물입니다. 수분 보충을 최우선으로 하세요! 🔥`;
                case 'mental': return `이런 더위에 ${distance}km라니, 런너님의 환경 적응력이 놀랍습니다. 충분한 냉각과 전해질 섭취를 권장해요. 🌿`;
                case 'intel': return `체온 상승으로 대사 효율이 급감하는 온도입니다. 심박수 부하가 커졌으니 종료 후 반드시 쿨다운을 하세요. 🐟`;
                default: return `폭염 속 완주를 축하합니다! ${temp}°C의 열기보다 런너님의 의지가 더 뜨겁네요. ✨`;
            }
        }
        if (temp <= 0) {
            switch (coach.tendency) {
                case 'hard': return `영하의 날씨는 근육 수축을 유발합니다. 고강도 인터벌 전 충분한 워밍업이 없었다면 부상을 조심하세요! ❄️`;
                case 'calm': return `차가운 공기를 깊게 들이마시며 자율신경계를 정화하는 시간이 되었겠군요. 체온 유지에 신경 써주세요. 🧘`;
                default: return `혹한기를 뚫고 질주하신 런너님, 정말 대단합니다! 따뜻한 차로 몸을 녹여주세요. ❄️🫡`;
            }
        }
    }

    // 2. 컨디션 난조 상황
    if (condition === 'bad') {
        switch (coach.tendency) {
            case 'mental': return `몸의 신호가 좋지 않았음에도 끝까지 완주하셨네요. 오늘은 성취감보다 회복에 100% 집중할 때입니다. 🌿`;
            case 'hard': return `최악의 컨디션에서 거둔 질주는 정신적 임계치를 높여줍니다. 하지만 내일은 완전 휴식을 명합니다! 🦾`;
            default: return `컨디션이 안 좋으셨을 텐데 고생 많으셨습니다. 기록보다 오늘을 버텨낸 런너님의 끈기에 박수를 보냅니다! 👏`;
        }
    }

    // 3. 기록 향상 성공
    if (isImproved) {
        switch (coach.tendency) {
            case 'intel': return `분석 결과, 역학적 밸런스가 매우 훌륭했습니다. ${weight}kg의 신체 데이터를 가장 효율적으로 활용한 질주였어요! 🐟`;
            case 'pacer': return `미드풋 착지의 탄성을 아주 영리하게 사용하셨군요. 페이스 안정감이 돋보이는 구간이었습니다. 🏃‍♂️`;
            case 'vibe': return `오늘 리듬감은 최고였습니다! 팔 스윙과 보폭이 음악처럼 맞아떨어지는 쾌속 질주였네요! ⚡`;
            default: return `기록 단축을 진심으로 축하합니다! 런너님의 노력이 데이터로 증명되는 순간입니다. 🏆`;
        }
    }

    // 4. 일반적인 조언 (데이터 기반 전문가 피드백)
    const coachAdvice: Record<string, string> = {
        apex: `[고강도 처방] 심폐 시스템의 임계치를 높이기 위한 점진적 과부하가 필요합니다. 다음 세션은 최대 심박수의 85-90% 구간을 유지하는 인터벌 훈련을 권장합니다. 🔥`,
        insight: `[생체역학 분석] ${weight}kg의 하중 이동 경로를 분석한 결과, 중력 가속도를 활용한 전경 자세가 효율적입니다. 지면 접촉 시간(GCT)을 5% 더 줄여 대사 효율을 극대화하세요. 🐟`,
        wellness: `[회복 및 예방] 부상 방지를 위한 Bio-Signal이 안정적입니다. 근육의 미세 파열 회복을 위해 수면 8시간 준수와 마그네슘 섭취 비중을 높이는 전략이 유효합니다. 🌿`,
        zen: `[신경계 리셋] 자율신경계가 안정된 상태입니다. 기록이라는 압박을 내려놓고 호흡 노이즈를 최소화하는 명상적 러닝이 오늘의 성과입니다. 🧘`,
        atlas: `[기초 지구력] 모세혈관 발달을 위한 베이스 확보 단계입니다. Zone 2 영역의 심박수를 유지하며 미토콘드리아의 크기를 키우는 초장거리(LSD) 질주에 집중하세요. 🏛️`,
        swift: `[신경-근육 동기화] 보폭수(Cadence)와 팔 스윙의 진자 운동 리듬이 훌륭합니다. 신경계 반응 속도를 높이기 위해 종료 후 80m 전력 질주 3세트를 추가하십시오. ⚡`,
        marathon: `[마라톤 전략] 서브-4 완주를 위한 데이터 축적이 순조롭습니다. 미드풋 착지의 탄성을 영리하게 활용하여 관절 부하를 분산하고 효율적인 에너지 분배에 집중하세요. 🏃‍♂️`
    };

    return coachAdvice[coach.id] || `${distance}km 질주 완료. 데이터 사이언스 기반 분석을 통해 다음 도약을 준비하세요. ✨`;
};

/**
 * 7인의 코치 중 한 명을 랜덤으로 선정합니다.
 */
export const getRandomCoach = (): Coach => {
    const randomIndex = Math.floor(Math.random() * coaches.length);
    return coaches[randomIndex];
};
