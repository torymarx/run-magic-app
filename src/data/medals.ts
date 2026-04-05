
export interface Medal {
    id: string;
    name: string;
    points: number;
    criteria: string;
    description: string;
    rarity: 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC';
    phase: number;
    iconType: string; // Lucide icon name mapping
    targetValue: number;
    category: 'distance' | 'time' | 'sessions' | 'streak' | 'pace' | 'special' | 
              'dawnCount' | 'nightCount' | 'weekendCount' | 'mondayCount' | 
              'shortRunCount' | 'earlyCount' | 'lateCount' | 'stormCount';
}

export const MEDAL_DATA: Medal[] = [
    // Phase 1: 시작의 발걸음
    { id: 'm1', name: '마법진 활성화', points: 50, criteria: '앱 최초 로그인 및 프로필 설정', description: '앱 설치 및 프로필 설정을 완료했습니다.', rarity: 'COMMON', phase: 1, iconType: 'Shield', targetValue: 1, category: 'special' },
    { id: 'm2', name: '마법의 씨앗', points: 50, criteria: '생애 첫 1km 완주 (걷기 포함)', description: '최초 1km 주행을 기록했습니다.', rarity: 'COMMON', phase: 1, iconType: 'Sprout', targetValue: 1, category: 'distance' },
    { id: 'm3', name: '시간의 파편', points: 50, criteria: '처음으로 10분 연속 달리기', description: '10분 연속 달리기에 성공했습니다.', rarity: 'COMMON', phase: 1, iconType: 'Zap', targetValue: 10, category: 'special' },
    { id: 'm4', name: '여명의 축복', points: 100, criteria: '오전(05:00~09:00) 러닝 1회 완료', description: '오전 시간대 러닝 기록입니다.', rarity: 'UNCOMMON', phase: 1, iconType: 'Sun', targetValue: 1, category: 'dawnCount' },
    { id: 'm5', name: '달빛의 인도', points: 100, criteria: '야간(19:00~24:00) 러닝 1회 완료', description: '야간 시간대 러닝 기록입니다.', rarity: 'UNCOMMON', phase: 1, iconType: 'Moon', targetValue: 1, category: 'nightCount' },

    // Phase 2: 습관의 형성
    { id: 'm6', name: '견습생의 끈기', points: 100, criteria: '3일 연속 러닝 인증', description: '3일 연속 러닝 미션을 달성했습니다.', rarity: 'UNCOMMON', phase: 2, iconType: 'Flame', targetValue: 3, category: 'streak' },
    { id: 'm7', name: '마나 순환', points: 100, criteria: '1주일 내 3회 이상 러닝', description: '주간 3회 러닝 빈도를 달성했습니다.', rarity: 'UNCOMMON', phase: 2, iconType: 'Activity', targetValue: 3, category: 'sessions' },
    { id: 'm8', name: '휴일의 마법사', points: 100, criteria: '주말(토/일) 러닝 1회 완료', description: '주말 러닝을 완료했습니다.', rarity: 'UNCOMMON', phase: 2, iconType: 'BookOpen', targetValue: 1, category: 'weekendCount' },
    { id: 'm9', name: '10km의 지평선', points: 250, criteria: '누적 달리기 거리 10km 돌파', description: '총 누적 거리 10km를 돌파했습니다.', rarity: 'RARE', phase: 2, iconType: 'Compass', targetValue: 10, category: 'distance' },
    { id: 'm10', name: '마력의 물약', points: 250, criteria: '3km 쉬지 않고 완주', description: '단일 기록으로 3km 연속 주행했습니다.', rarity: 'RARE', phase: 2, iconType: 'FlaskConical', targetValue: 3, category: 'special' },

    // Phase 3: 마법의 응용
    { id: 'm11', name: '부활의 주문', points: 100, criteria: '월요일 러닝 1회 완료', description: '월요일 러닝을 완료했습니다.', rarity: 'UNCOMMON', phase: 3, iconType: 'Bird', targetValue: 1, category: 'mondayCount' },
    { id: 'm12', name: '영겁의 모래', points: 100, criteria: '누적 달리기 시간 100분 돌파', description: '총 누적 주행 시간 100분을 돌파했습니다.', rarity: 'UNCOMMON', phase: 3, iconType: 'Timer', targetValue: 100, category: 'time' },
    { id: 'm13', name: '바람의 정령', points: 100, criteria: '2km 이하 짧은 러닝 누적 5회 완료', description: '단거리(2km 이하) 러닝을 5회 완료했습니다.', rarity: 'UNCOMMON', phase: 3, iconType: 'Wind', targetValue: 5, category: 'shortRunCount' },
    { id: 'm14', name: '일곱 별의 궤적', points: 250, criteria: '한 번에 7km 완주', description: '단일 기록으로 7km를 완주했습니다.', rarity: 'RARE', phase: 3, iconType: 'Star', targetValue: 7, category: 'special' },

    // Phase 4: 한계 돌파
    { id: 'm15', name: '시간의 모래시계', points: 250, criteria: '30분 연속 달리기 성공', description: '30분 연속 주행에 성공했습니다.', rarity: 'RARE', phase: 4, iconType: 'Hourglass', targetValue: 30, category: 'special' },
    { id: 'm16', name: '바람의 부츠', points: 250, criteria: '이전 최고 페이스 대비 기록 단축', description: '개인 페이스 기록을 경신했습니다.', rarity: 'RARE', phase: 4, iconType: 'Zap', targetValue: 1, category: 'special' },
    { id: 'm17', name: '유성우 러너', points: 250, criteria: '5km 완주 (초보자의 대목표)', description: '5km 코스를 완주했습니다.', rarity: 'RARE', phase: 4, iconType: 'FastForward', targetValue: 5, category: 'special' },
    { id: 'm18', name: '마법 지도의 개척자', points: 500, criteria: '누적 달리기 거리 30km 돌파', description: '총 누적 거리 30km를 달성했습니다.', rarity: 'EPIC', phase: 4, iconType: 'Map', targetValue: 30, category: 'distance' },
    { id: 'm19', name: '월간 마나 마스터', points: 500, criteria: '한 달 내 10회 이상 러닝', description: '월간 러닝 횟수 10회를 달성했습니다.', rarity: 'EPIC', phase: 4, iconType: 'Crown', targetValue: 10, category: 'sessions' },
    { id: 'm20', name: '초월의 룬', points: 500, criteria: '10km 완주 (초보 졸업)', description: '10km 코스를 완주했습니다.', rarity: 'EPIC', phase: 4, iconType: 'Layers', targetValue: 10, category: 'special' },

    // Phase 5: 영광의 기록
    { id: 'm21', name: '마을 밖의 모험가', points: 100, criteria: '누적 20km 돌파', description: '누적 거리 20km를 달성했습니다.', rarity: 'UNCOMMON', phase: 5, iconType: 'MapPin', targetValue: 20, category: 'distance' },
    { id: 'm22', name: '대지의 순례자', points: 250, criteria: '누적 50km 돌파', description: '누적 거리 50km를 달성했습니다.', rarity: 'RARE', phase: 5, iconType: 'Mountain', targetValue: 50, category: 'distance' },
    { id: 'm23', name: '응축된 마나', points: 100, criteria: '누적 300분 돌파', description: '누적 주행 시간 300분을 돌파했습니다.', rarity: 'UNCOMMON', phase: 5, iconType: 'Beaker', targetValue: 300, category: 'time' },
    { id: 'm24', name: '마법진의 각성', points: 100, criteria: '누적 15회 러닝 달성', description: '총 러닝 횟수 15회를 달성했습니다.', rarity: 'UNCOMMON', phase: 5, iconType: 'Dices', targetValue: 15, category: 'sessions' },
    { id: 'm25', name: '마나의 결정체', points: 250, criteria: '누적 30회 러닝 달성', description: '총 러닝 횟수 30회를 달성했습니다.', rarity: 'RARE', phase: 5, iconType: 'Gem', targetValue: 30, category: 'sessions' },
    { id: 'm26', name: '차원의 여행자', points: 500, criteria: '누적 100km 돌파', description: '누적 거리 100km를 달성했습니다.', rarity: 'EPIC', phase: 5, iconType: 'Globe', targetValue: 100, category: 'distance' },
    { id: 'm27', name: '영겁의 톱니바퀴', points: 250, criteria: '누적 500분 돌파', description: '누적 주행 시간 500분을 돌파했습니다.', rarity: 'RARE', phase: 5, iconType: 'Settings', targetValue: 500, category: 'time' },
    { id: 'm28', name: '별빛 궤적의 수호자', points: 500, criteria: '누적 50회 러닝 달성', description: '총 러닝 횟수 50회를 달성했습니다.', rarity: 'EPIC', phase: 5, iconType: 'Star', targetValue: 50, category: 'sessions' },
    { id: 'm29', name: '시공간의 지배자', points: 500, criteria: '누적 1,000분 돌파', description: '누적 주행 시간 1,000분을 돌파했습니다.', rarity: 'EPIC', phase: 5, iconType: 'Aperture', targetValue: 1000, category: 'time' },
    { id: 'm30', name: '백일몽의 현실화', points: 1250, criteria: '누적 러닝 100회 달성', description: '총 러닝 횟수 100회를 달성했습니다.', rarity: 'LEGENDARY', phase: 5, iconType: 'Flower', targetValue: 100, category: 'sessions' },

    // Phase 6: 진화하는 마법사
    { id: 'm31', name: '銀빛 늑대의 궤적', points: 500, criteria: '누적 150km 돌파', description: '누적 거리 150km를 달성했습니다.', rarity: 'EPIC', phase: 6, iconType: 'Dog', targetValue: 150, category: 'distance' },
    { id: 'm32', name: '폭풍의 인도자', points: 500, criteria: '누적 200km 돌파', description: '누적 거리 200km를 달성했습니다.', rarity: 'EPIC', phase: 6, iconType: 'CloudLightning', targetValue: 200, category: 'distance' },
    { id: 'm33', name: '대륙횡단 열차', points: 500, criteria: '누적 300km 돌파', description: '누적 거리 300km를 달성했습니다.', rarity: 'EPIC', phase: 6, iconType: 'Train', targetValue: 300, category: 'distance' },
    { id: 'm34', name: '마법사의 모래폭풍', points: 500, criteria: '누적 2,000분 돌파', description: '누적 주행 시간 2,000분을 달성했습니다.', rarity: 'EPIC', phase: 6, iconType: 'Box', targetValue: 2000, category: 'time' },
    { id: 'm35', name: '시간의 왜곡', points: 500, criteria: '누적 3,000분 돌파', description: '누적 주행 시간 3,000분을 달성했습니다.', rarity: 'EPIC', phase: 6, iconType: 'Clock', targetValue: 3000, category: 'time' },
    { id: 'm36', name: '철의 의지', points: 500, criteria: '누적 150회 러닝 달성', description: '총 러닝 횟수 150회를 달성했습니다.', rarity: 'EPIC', phase: 6, iconType: 'Hammer', targetValue: 150, category: 'sessions' },
    { id: 'm37', name: '반년의 기적', points: 1250, criteria: '6개월 연속 매월 5회 이상 러닝', description: '6개월간 꾸준한 월간 활동 기준을 충족했습니다.', rarity: 'LEGENDARY', phase: 6, iconType: 'Tower', targetValue: 6, category: 'special' },
    { id: 'm38', name: '태양의 사제', points: 1250, criteria: '누적 200회 러닝 달성', description: '총 러닝 횟수 200회를 달성했습니다.', rarity: 'LEGENDARY', phase: 6, iconType: 'SunInside', targetValue: 200, category: 'sessions' },
    { id: 'm39', name: '영원의 메아리', points: 500, criteria: '누적 5,000분 돌파', description: '누적 주행 시간 5,000분을 달성했습니다.', rarity: 'EPIC', phase: 6, iconType: 'Waves', targetValue: 5000, category: 'time' },
    { id: 'm40', name: '하늘을 걷는 자', points: 1250, criteria: '누적 500km 돌파', description: '누적 거리 500km를 달성했습니다.', rarity: 'LEGENDARY', phase: 6, iconType: 'Footprints', targetValue: 500, category: 'distance' },

    // Phase 7: 아크메이지의 길
    { id: 'm41', name: '시간의 절대자', points: 1250, criteria: '누적 7,000분 돌파', description: '누적 주행 시간 7,000분을 달성했습니다.', rarity: 'LEGENDARY', phase: 7, iconType: 'Watch', targetValue: 7000, category: 'time' },
    { id: 'm42', name: '빛의 속도', points: 1250, criteria: '누적 777km 돌파', description: '누적 거리 777km를 달성했습니다.', rarity: 'LEGENDARY', phase: 7, iconType: 'Zap', targetValue: 777, category: 'distance' },
    { id: 'm43', name: '무한한 동력', points: 1250, criteria: '누적 250회 러닝 달성', description: '총 러닝 횟수 250회를 달성했습니다.', rarity: 'LEGENDARY', phase: 7, iconType: 'BatteryCharging', targetValue: 250, category: 'sessions' },
    { id: 'm44', name: '계절의 지배자', points: 1250, criteria: '사계절 각 10회 이상 러닝', description: '사계절 내내 꾸준한 활동을 완료했습니다.', rarity: 'LEGENDARY', phase: 7, iconType: 'Wind', targetValue: 4, category: 'special' },
    { id: 'm45', name: '크로노스의 유산', points: 1250, criteria: '누적 10,000분 돌파', description: '누적 주행 시간 10,000분을 달성했습니다.', rarity: 'LEGENDARY', phase: 7, iconType: 'Library', targetValue: 10000, category: 'time' },
    { id: 'm46', name: '성간 여행자', points: 1250, criteria: '누적 1,000km 돌파', description: '총 누적 거리 1,000km를 달성했습니다.', rarity: 'LEGENDARY', phase: 7, iconType: 'Rocket', targetValue: 1000, category: 'distance' },
    { id: 'm47', name: '초월적 일상', points: 1250, criteria: '누적 300회 러닝 달성', description: '총 러닝 횟수 300회를 달성했습니다.', rarity: 'LEGENDARY', phase: 7, iconType: 'Infinity', targetValue: 300, category: 'sessions' },
    { id: 'm48', name: '1년의 마법', points: 1250, criteria: '가입 1주년 및 누적 100회 기록', description: '함께한 지 1년, 100회의 기록을 달성했습니다.', rarity: 'LEGENDARY', phase: 7, iconType: 'Gift', targetValue: 365, category: 'special' },
    { id: 'm49', name: '전설의 시작', points: 1250, criteria: '누적 365회 러닝 달성', description: '총 러닝 횟수 365회를 달성했습니다.', rarity: 'LEGENDARY', phase: 7, iconType: 'Sword', targetValue: 365, category: 'sessions' },
    { id: 'm50', name: '런-매직 아크메이지', points: 1250, criteria: '1,000km & 10,000분 & 365회 달성', description: '궁극의 마일스톤(거리/시간/횟수)을 정복했습니다.', rarity: 'LEGENDARY', phase: 7, iconType: 'Wand2', targetValue: 1, category: 'special' },

    // Phase 8: 전설을 넘어선 성좌
    { id: 'm51', name: '은하수의 인도자', points: 2500, criteria: '누적 1,500km 달성', description: '누적 거리 1,500km를 달성했습니다.', rarity: 'MYTHIC', phase: 8, iconType: 'Sparkles', targetValue: 1500, category: 'distance' },
    { id: 'm52', name: '시공의 관측자', points: 2500, criteria: '누적 15,000분 주행', description: '누적 주행 시간 15,000분을 달성했습니다.', rarity: 'MYTHIC', phase: 8, iconType: 'Telescope', targetValue: 15000, category: 'time' },
    { id: 'm53', name: '불멸의 위성', points: 2500, criteria: '총 500회 러닝 달성', description: '총 러닝 횟수 500회를 달성했습니다.', rarity: 'MYTHIC', phase: 8, iconType: 'Satellite', targetValue: 500, category: 'sessions' },
    { id: 'm54', name: '새벽의 실리우스', points: 1250, criteria: '새벽 4~6시 러닝 20회', description: '새벽 시간대 러닝 20회를 완료했습니다.', rarity: 'LEGENDARY', phase: 8, iconType: 'Star', targetValue: 20, category: 'earlyCount' },
    { id: 'm55', name: '밤의 베가', points: 1250, criteria: '심야 22~02시 러닝 20회', description: '심야 시간대 러닝 20회를 완료했습니다.', rarity: 'LEGENDARY', phase: 8, iconType: 'Moon', targetValue: 20, category: 'lateCount' },
    { id: 'm56', name: '폭풍의 눈', points: 2500, criteria: '악천후 속 러닝 10회 (비/눈 실측)', description: '악천후 속에서 10회 러닝을 완료했습니다.', rarity: 'MYTHIC', phase: 8, iconType: 'Wind', targetValue: 10, category: 'stormCount' },
    { id: 'm57', name: '안드로메다로의 도약', points: 2500, criteria: '누적 2,000km 달성', description: '누적 거리 2,000km를 달성했습니다.', rarity: 'MYTHIC', phase: 8, iconType: 'Nebula', targetValue: 2000, category: 'distance' },
    { id: 'm58', name: '광속의 수렴', points: 2500, criteria: '평균 페이스 4\'15" 진입', description: '상급자 수준의 페이스(4\'15")를 달성했습니다.', rarity: 'MYTHIC', phase: 8, iconType: 'Lightning', targetValue: 255, category: 'pace' },
    { id: 'm59', name: '성좌의 수호자', points: 2500, criteria: '총 1,000회 러닝 달성', description: '총 러닝 횟수 1,000회를 달성했습니다.', rarity: 'MYTHIC', phase: 8, iconType: 'Constellation', targetValue: 1000, category: 'sessions' },
    { id: 'm60', name: '지구 한 바퀴의 꿈', points: 2500, criteria: '누적 40,075km (최종 목표)', description: '누적 거리 40,075km의 거대 목표를 달성했습니다.', rarity: 'MYTHIC', phase: 8, iconType: 'Earth', targetValue: 40075, category: 'distance' },
];
