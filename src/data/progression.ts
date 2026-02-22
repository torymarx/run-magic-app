
export interface LevelDetail {
    level: number;
    name: string;
    minPoints: number;
    maxPoints: number;
    description: string;
    visual: string;
    imageUrl?: string; // v16.1
}

export const LEVEL_DATA: LevelDetail[] = [
    {
        level: 1,
        name: '비기너 런너',
        minPoints: 0,
        maxPoints: 1500, // 현 상태 유지 (약 2~3개월 소요)
        description: '입문 단계. 약간 통통한 일반인 체형. 헐렁한 면티와 유선 이어폰에서 시작되는 위대한 변화.',
        visual: 'beginner'
    },
    {
        level: 2,
        name: '아마추어 러너',
        minPoints: 1501,
        maxPoints: 3500, // 약 6개월 소요
        description: '습관 형성. 군살이 빠진 슬림한 체형. 브랜드 기능성 웨어와 함께 본격적인 질주가 시작됩니다.',
        visual: 'amateur'
    },
    {
        level: 3,
        name: '프로 러너',
        minPoints: 3501,
        maxPoints: 7500, // 약 9~10개월 소요
        description: '중급 정착. 탄탄한 근육질 몸매. 전문 장비를 장착하고 자신만의 페이스를 개척하는 런너.',
        visual: 'professional'
    },
    {
        level: 4,
        name: '엘리트 나이트',
        minPoints: 7501,
        maxPoints: 15000, // 1년 이상 꾸준함의 상징
        description: '고급 단계. 데피니션이 선명한 강력한 신체. 1년의 꾸준함이 빚어낸 명예로운 경지.',
        visual: 'elite'
    },
    {
        level: 5,
        name: '그랜드 마스터',
        minPoints: 15001,
        maxPoints: 999999, // 풀코스 마라톤 완주자 전용
        description: '정점의 완성. 완벽한 육체와 압도적인 오라. 풀코스 마라톤을 완주한 전설의 런칭 아크메이지.',
        visual: 'master'
    }
];

export const getCharacterImageUrl = (level: number, gender: string = 'male') => {
    const safeGender = gender === 'female' ? 'female' : 'male';
    return `/assets/characters/${safeGender}_lv${level}.png`;
};

export const POINT_RULES = {
    ATTENDANCE: 10,      // 20 -> 10P (희소성 강화)
    RUNNING_SESSION: 10, // 50 -> 10P (꾸준함 유도)
    STREAK_BONUS: 30,    // 100 -> 30P
    AI_FEEDBACK: 5,      // 10 -> 5P
    SHARING: 10,         // 20 -> 10P
    SPECIAL_TIME: 15,    // 30 -> 15P
    MEDAL_COLLECTION: 20 // 일괄 하향은 medals.ts에서 진행
};
