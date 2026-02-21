
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
        name: '비기너',
        minPoints: 0,
        maxPoints: 500,
        description: '앱 적응기. 무채색의 평범한 트레이닝복 상반신.',
        visual: 'beginner',
        imageUrl: 'C:/Users/Nakus/.gemini/antigravity/brain/95ca533c-207a-42df-97b2-32d403112790/magician_lv1_beginner_1771677294985.png'
    },
    {
        level: 2,
        name: '어프렌티스',
        minPoints: 501,
        maxPoints: 1500,
        description: '초기 습관 형성기. 깔끔한 스포츠 브랜드 러닝복과 미세하게 점멸하는 이어폰.',
        visual: 'apprentice',
        imageUrl: 'C:/Users/Nakus/.gemini/antigravity/brain/95ca533c-207a-42df-97b2-32d403112790/magician_lv2_apprentice_1771677316785.png'
    },
    {
        level: 3,
        name: '매직 러너',
        minPoints: 1501,
        maxPoints: 3500,
        description: '꾸준한 러닝 정착. 테크웨어와 홀로그램 데이터 입자 효과.',
        visual: 'magic_runner',
        imageUrl: 'C:/Users/Nakus/.gemini/antigravity/brain/95ca533c-207a-42df-97b2-32d403112790/magician_progression_all_stages_1771678241395.png'
    },
    {
        level: 4,
        name: '엘리트 나이트',
        minPoints: 3501,
        maxPoints: 7000,
        description: '중고급 러너. 사이버네틱 슈트와 네온 눈동자, 렌즈 플레어 이펙트.',
        visual: 'elite_knight',
        imageUrl: 'C:/Users/Nakus/.gemini/antigravity/brain/95ca533c-207a-42df-97b2-32d403112790/magician_lv4_elite_knight_cybernetic_1771677344184.png'
    },
    {
        level: 5,
        name: '아크메이지',
        minPoints: 7001,
        maxPoints: 999999,
        description: '앱 마스터. 마법과 과학이 결합된 슈트와 압도적인 오로라 아우라.',
        visual: 'archmage',
        imageUrl: 'C:/Users/Nakus/.gemini/antigravity/brain/95ca533c-207a-42df-97b2-32d403112790/magician_lv5_archmage_aurora_1771677374648.png'
    }
];

export const POINT_RULES = {
    ATTENDANCE: 20,
    RUNNING_SESSION: 30, // 1일 1회 제한
    STREAK_BONUS: 50,
    AI_FEEDBACK: 10,
    SHARING: 15,
    SPECIAL_TIME: 20 // 얼리버드 & 나이트런
};
