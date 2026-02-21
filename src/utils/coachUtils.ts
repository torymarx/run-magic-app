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

    // 4. 일반적인 조언
    switch (coach.id) {
        case 'apex': return `현재의 페이스에 만족하지 마세요. 다음엔 스트라이드 질주를 2세트 더 추가하여 심장을 더 키워봅시다! 🔥`;
        case 'insight': return `${weight}kg의 질량을 추진력으로 바꾸는 능력이 향상되었습니다. 더 효율적인 정전 자세에 집중하세요. 🐟`;
        case 'wellness': return `부상 신호 없이 ${distance}km를 소화한 것은 완벽한 신체 조절 능력 덕분입니다. 오늘 잠든 사이 근육이 더 단단해질 거예요. 🌿`;
        case 'zen': return `호흡의 노이즈가 줄어들고 지면과의 교감이 깊어졌습니다. 기록을 넘어선 평온함에 도달하셨군요. 🧘`;
        default: return `${distance}km 질주 완료! 런너님의 꾸준함이 가장 강력한 재능임을 잊지 마세요. ✨`;
    }
};

/**
 * 7인의 코치 중 한 명을 랜덤으로 선정합니다.
 */
export const getRandomCoach = (): Coach => {
    const randomIndex = Math.floor(Math.random() * coaches.length);
    return coaches[randomIndex];
};
