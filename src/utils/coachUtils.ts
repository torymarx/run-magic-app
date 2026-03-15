import { Coach, coaches } from '../data/coaches';

export type RunnerProfile = 'AEROBIC_SIEVE' | 'MECHANICAL_BRAKE' | 'FATIGUE_SIGNATURE' | 'EFFICIENT' | 'UNKNOWN';

/**
 * 런싱크 4.0 알고리즘 기반 러너 프로파일 진단
 */
export const diagnoseRunnerProfile = (record: any): RunnerProfile => {
    if (!record) return 'UNKNOWN';
    
    const hr = record.heart_rate || record.hr;
    const cad = record.cadence || record.cad;
    const weight = record.weight;
    
    // pace_seconds가 없으면 pace 스트링을 파싱하여 시도
    let pace = record.pace_seconds;
    if (!pace && record.pace) {
        if (typeof record.pace === 'number') {
            pace = record.pace;
        } else if (typeof record.pace === 'string') {
            const parts = record.pace.split(':').map(Number);
            if (parts.length === 2) pace = parts[0] * 60 + parts[1];
        }
    }
    
    if (!hr || !cad || !pace) return 'UNKNOWN';

    // 1. 기계적 브레이크형 (Mechanical Brake): 페이스는 준수하나 케이던스가 지나치게 낮은 유형
    // 페이스가 6분 미만(360초)이면서 케이던스가 160 미만인 경우
    if (pace < 360 && cad < 160) return 'MECHANICAL_BRAKE';

    // 2. 유산소 누수형 (Aerobic Sieve): 몸무게에 비해 페이스는 낮지만 심박수가 높은 유형
    // 체중이 80kg 이상이면서 페이스는 느린데(7분+) 심박이 높은 경우 더 강력하게 의심
    if (pace > 420 && hr > 155) {
        if (weight && weight > 80) return 'AEROBIC_SIEVE';
        if (hr > 165) return 'AEROBIC_SIEVE';
    }

    // 3. 후반 붕괴형 (Fatigue Signature) 
    // 실제로는 시계열 데이터가 필요하나, 여기서는 '상태가 나쁨'인데 기록이 중간 정도인 경우로 간주 (단순화)
    if (record.condition === 'bad' && pace > 360 && hr > 165) return 'FATIGUE_SIGNATURE';

    // 4. 효율적 러너 (Efficient)
    if (cad >= 170 && hr <= 150) return 'EFFICIENT';

    return 'UNKNOWN';
};

/**
 * 프로파일 영문명을 한글로 변환합니다.
 */
export const getProfileKoreanName = (profile: RunnerProfile): string => {
    const names: Record<RunnerProfile, string> = {
        'AEROBIC_SIEVE': '유산소 누수형',
        'MECHANICAL_BRAKE': '기계적 브레이크형',
        'FATIGUE_SIGNATURE': '후반 붕괴형',
        'EFFICIENT': '효율적 엔진형',
        'UNKNOWN': '데이터 분석 중'
    };
    return names[profile] || names['UNKNOWN'];
};

/**
 * 기록 데이터를 바탕으로 선택된 코치의 맞춤 조언 메시지를 생성합니다.
 */
export const getCoachAdvice = (record: any, coach: Coach): string => {
    if (!record) return '기 기록 데이터를 기다리고 있습니다. ✨';
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

    // 4. 런싱크 4.0 알고리즘 정밀 진단 및 처방 (v4.0 신규)
    const profile = diagnoseRunnerProfile(record);
    const hr = record.heart_rate;
    const cad = record.cadence;

    // 프로파일별 공통 처방
    if (profile === 'AEROBIC_SIEVE') {
        switch (coach.tendency) {
            case 'intel': return `[런싱크 진단: 유산소 누수형] 엔진이 무산소 대사에 의존하고 있습니다. 최대 심박수의 60-70%인 Zone 2 영역에 80% 이상의 훈련을 집중하여 유산소 엔진을 재건해야 합니다. 🐟`;
            case 'mental': return `[회복 솔루션] 심박수가 페이스 대비 높습니다. 3:2 복식 호흡(3보 흡기, 2보 호기) 리듬을 적용하여 산소 효율을 높이고 심박을 안정시키세요. 🌿`;
        }
    }

    if (profile === 'MECHANICAL_BRAKE') {
        switch (coach.tendency) {
            case 'hard': return `[런싱크 진단: 기계적 브레이크형] 낮은 케이던스로 보폭을 넓게 가져가며 관절이 충격을 흡수하고 있습니다. 케이던스를 현재보다 5-10% 점진적으로 높여 부상 위험을 줄이세요! 🦾`;
            case 'pacer': return `[역학적 교정] 오버스트라이딩 징후가 보입니다. 보폭을 줄이고 발이 몸무게 중심 바로 아래에 떨어지도록 리듬을 수정하세요. 둔근 활성화 운동이 필수적입니다. 🏃‍♂️`;
        }
    }

    if (profile === 'FATIGUE_SIGNATURE') {
        return `[런싱크 진단: 후반 붕괴형] 질주 후반부에 폼이 무너지는 경향이 있습니다. 코어 보강 운동과 함께 LSD(장거리 저강도) 훈련으로 기초 체력의 임계치를 높여야 합니다. 🏛️`;
    }

    if (profile === 'EFFICIENT') {
        return `[런싱크 진단: 효율적 엔진형] 심박 제어와 케이던스 리듬(${cad}spm)이 매우 이상적입니다. 현재의 경제적 주행 메커니즘을 장거리에서도 유지할 수 있도록 에너지 젤 섭취 전략을 병행하세요. 🏆`;
    }

    // 5. 심박수 및 케이던스 개별 분석 (보조 데이터)
    if (hr || cad) {
        if (hr && hr > 175) {
            return `심박수 ${hr}bpm은 임계점에 가깝습니다. 유산소 디커플링 현상을 방지하기 위해 강도를 낮추고 수분을 즉시 보충하세요. ⚠️`;
        }
        if (cad && cad < 160) {
            return `현재 케이던스 ${cad}spm은 수직 충격 부하를 가중시킵니다. 보폭을 줄이고 회전수(spm)를 높여 에너지 효율을 개선하세요. ⚡`;
        }
        if (cad && cad >= 175 && cad <= 185) {
            return `환상적인 케이던스(${cad}spm)입니다! 가장 경제적이고 효율적인 리듬을 찾으셨네요. 🏆`;
        }
    }

    // 5. 일반적인 조언 (데이터 기반 전문가 피드백)
    const coachAdvice: Record<string, string> = {
        apex: `[고강도 처방] 심박수 ${record.heart_rate || 'N/A'}bpm 분석 결과, 심폐 시스템의 임계치를 높이기 위한 점진적 과부하가 필요합니다. 다음 세션은 최대 심박수의 85-90% 구간을 유지하는 인터벌 훈련을 권장합니다. 🔥`,
        insight: `[생체역학 분석] 케이던스 ${record.cadence || 'N/A'}spm과 ${weight}kg의 하중 이동을 분석한 결과, 지면 접촉 시간(GCT)을 5% 더 줄여 대사 효율을 극대화하는 전경 자세가 필요합니다. 🐟`,
        wellness: `[회복 및 예방] 심박 변동성이 안정적입니다. 근육의 미세 파열 회복을 위해 수면 8시간 준수와 마그네슘 섭취 비중을 높이는 전략이 유효합니다. 🌿`,
        zen: `[신경계 리셋] 자율신경계가 안정된 상태입니다. 기록이라는 압박을 내려놓고 심박수 노이즈를 최소화하는 명상적 러닝이 오늘의 성과입니다. 🧘`,
        atlas: `[기초 지구력] Zone 2 영역의 심박수를 유지하며 미토콘드리아의 크기를 키우는 초장거리(LSD) 질주에 집중하세요. 기초 체력이 모든 속도의 근원입니다. 🏛️`,
        swift: `[신경-근육 동기화] 현재 케이던스(${record.cadence || 'N/A'}spm)와 팔 스윙의 진자 운동 리듬을 최적화하세요. 신경계 반응 속도를 높이기 위해 종료 후 80m 전력 질주 3세트를 추가하십시오. ⚡`,
        marathon: `[마라톤 전략] 케이던스 리듬과 심박수 관리가 순조롭습니다. 미드풋 착지의 탄성을 영리하게 활용하여 관절 부하를 분산하고 효율적인 에너지 분배에 집중하세요. 🏃‍♂️`
    };

    return coachAdvice[coach.id] || `${distance}km 질주 완료. 심박(${record.heart_rate || '-'})/케이던스(${record.cadence || '-'}) 데이터를 기반으로 다음 도약을 준비하세요. ✨`;
};

/**
 * 7인의 코치 중 한 명을 랜덤으로 선정합니다.
 */
export const getRandomCoach = (): Coach => {
    const randomIndex = Math.floor(Math.random() * coaches.length);
    return coaches[randomIndex];
};
