
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
        maxPoints: 500,
        description: '입문 단계. 약간 통통한 일반인 체형. 헐렁한 면티와 유선 이어폰으로 시작하는 소박한 첫걸음.',
        visual: 'beginner',
        imageUrl: '/assets/characters/magician_lv1_beginner_1771677294985.png'
    },
    {
        level: 2,
        name: '아마추어 러너',
        minPoints: 501,
        maxPoints: 1500,
        description: '습관 형성. 군살이 빠진 슬림한 체형. 브랜드 기능성 티셔츠와 무선 이어폰, 스마트워치를 장착했습니다.',
        visual: 'amateur',
        imageUrl: '/assets/characters/magician_lv2_apprentice_1771677316785.png'
    },
    {
        level: 3,
        name: '프로 러너',
        minPoints: 1501,
        maxPoints: 3500,
        description: '중급 정착. 탄탄하게 다져진 근육질 몸매. 타이트한 컴프레션 웨어와 바람막이, 러닝 벨트로 전문성을 더합니다.',
        visual: 'professional',
        imageUrl: '/assets/characters/magician_progression_all_stages_1771678241395.png'
    },
    {
        level: 4,
        name: '엘리트 나이트',
        minPoints: 3501,
        maxPoints: 7000,
        description: '고급 단계. 데피니션이 선명한 강력한 하체 근육. 초경량 싱글렛, 카본화, 스포츠 선글라스로 무장한 실력자입니다.',
        visual: 'elite',
        imageUrl: '/assets/characters/magician_lv4_elite_knight_cybernetic_1771677344184.png'
    },
    {
        level: 5,
        name: '그랜드 마스터',
        minPoints: 7001,
        maxPoints: 999999,
        description: '정점의 완성. 완벽한 육체와 압도적인 오라. 최첨단 사이버네틱 슈트와 홀로그램 HUD가 장착된 전설의 런너.',
        visual: 'master',
        imageUrl: '/assets/characters/magician_lv5_archmage_aurora_1771677374648.png'
    }
];

export const POINT_RULES = {
    ATTENDANCE: 20,
    RUNNING_SESSION: 50, // 30 -> 50P로 강화
    STREAK_BONUS: 100, // 50 -> 100P로 강화
    AI_FEEDBACK: 10,
    SHARING: 20,
    SPECIAL_TIME: 30, // 20 -> 30P로 강화
    MEDAL_COLLECTION: 100 // 메달당 기본 보상 점수
};
