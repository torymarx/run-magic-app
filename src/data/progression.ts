
export interface LevelDetail {
    level: number;
    name: string;
    title: string;
    minPoints: number;
    maxPoints: number;
    description: string;
    visual: string;
    imageUrl?: string;
    theme: {
        color: string;
        secondary: string;
    };
}

export const LEVEL_DATA: LevelDetail[] = [
    {
        level: 1,
        name: '비기너 런너',
        title: 'NOVICE RUNNER',
        minPoints: 0,
        maxPoints: 5000,
        description: '입문 단계. 약간 통통한 일반인 체형. 헐렁한 면티와 유선 이어폰에서 시작되는 위대한 변화.',
        visual: 'beginner',
        theme: { color: '#00D1FF', secondary: 'rgba(0, 209, 255, 0.1)' }
    },
    {
        level: 2,
        name: '아마추어 러너',
        title: 'ACTIVE RUNNER',
        minPoints: 5001,
        maxPoints: 20000,
        description: '습관 형성. 군살이 빠진 슬림한 체형. 브랜드 기능성 웨어와 함께 본격적인 질주가 시작됩니다.',
        visual: 'amateur',
        theme: { color: '#39FF14', secondary: 'rgba(57, 255, 20, 0.1)' }
    },
    {
        level: 3,
        name: '프로 러너',
        title: 'ACE RUNNER',
        minPoints: 20001,
        maxPoints: 50000,
        description: '중급 정착. 탄탄한 근육질 몸매. 전문 장비를 장착하고 자신만의 페이스를 개척하는 런너.',
        visual: 'professional',
        theme: { color: '#FFD700', secondary: 'rgba(255, 215, 0, 0.1)' }
    },
    {
        level: 4,
        name: '엘리트 나이트',
        title: 'ELITE RUNNER',
        minPoints: 50001,
        maxPoints: 100000,
        description: '고급 단계. 데피니션이 선명한 강력한 신체. 1년의 꾸준함이 빚어낸 명예로운 경지.',
        visual: 'elite',
        theme: { color: '#BD00FF', secondary: 'rgba(189, 0, 255, 0.1)' }
    },
    {
        level: 5,
        name: '그랜드 마스터',
        title: 'LEGENDARY RUNNER',
        minPoints: 100001,
        maxPoints: 9999999,
        description: '정점의 완성. 완벽한 육체와 압도적인 오라. 풀코스 마라톤을 완주한 전설의 런칭 아크메이지.',
        visual: 'master',
        theme: { color: '#FFFFFF', secondary: 'rgba(255, 255, 255, 0.1)' }
    }
];

export const getCharacterImageUrl = (level: number, gender: string = 'male') => {
    const safeGender = gender === 'female' ? 'female' : 'male';
    return `/assets/characters/${safeGender}_lv${level}.png`;
};

// v26.0: 포인트 미학 개편 - 거리 보상 및 등급별 메달 시스템 도입 🚀
export const POINT_RULES = {
    ATTENDANCE: 10,      // 일일 출석 (로그인 시 1회) 10P
    RUNNING_SESSION: 10, // 일일 첫 운동 기록 생성 10P
    DISTANCE_KM: 10,     // 주행 거리 1km당 10P (무제한 합산) ✨
    STREAK_3DAY: 30,     
    STREAK_7DAY: 30,     
    STREAK_14DAY: 30,    
    STREAK_30DAY: 50,    
    AI_FEEDBACK: 5,      
    SHARING: 10,         
    SPECIAL_TIME: 15,    
    // 메달 등급별 포인트 차등 적용 (recalculateAllAchievements에서 적용)
    MEDAL_RARITY: {
        COMMON: 20,
        UNCOMMON: 50,
        RARE: 100,
        EPIC: 250,
        LEGENDARY: 500,
        MYTHIC: 1000
    }
};

