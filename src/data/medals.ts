
export interface Medal {
    id: string;
    name: string;
    points: number;
    criteria: string;
    description: string;
    rarity: 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
    phase: number;
    iconType: string; // Lucide icon name mapping
}

export const MEDAL_DATA: Medal[] = [
    // Phase 1: 시작의 발걸음
    { id: 'm1', name: '마법진 활성화', points: 2, criteria: '앱 최초 로그인 및 프로필 설정', description: '흑요석 베이스 위에 레이저로 각인된 푸른색 마법진. 은은한 속광 효과.', rarity: 'COMMON', phase: 1, iconType: 'Shield' },
    { id: 'm2', name: '마법의 씨앗', points: 5, criteria: '생애 첫 1km 완주 (걷기 포함)', description: '투명 캡슐 안에 떠 있는 네온 그린 홀로그램 씨앗.', rarity: 'COMMON', phase: 1, iconType: 'Sprout' },
    { id: 'm3', name: '시간의 파편', points: 5, criteria: '처음으로 10분 연속 달리기', description: '공중에 부양한 비대칭 크리스탈 조각. 내부 빛 굴절 효과.', rarity: 'COMMON', phase: 1, iconType: 'Zap' },
    { id: 'm4', name: '여명의 축복', points: 10, criteria: '오전(05:00~09:00) 러닝 1회 완료', description: '황동 재질의 태양 펜던트. 아침 햇살 조명 효과.', rarity: 'UNCOMMON', phase: 1, iconType: 'Sun' },
    { id: 'm5', name: '달빛의 인도', points: 10, criteria: '야간(19:00~24:00) 러닝 1회 완료', description: '크롬 질감의 초승달 배지. 강한 림 라이트 효과.', rarity: 'UNCOMMON', phase: 1, iconType: 'Moon' },

    // Phase 2: 습관의 형성
    { id: 'm6', name: '견습생의 끈기', points: 15, criteria: '3일 연속 러닝 인증', description: '거친 오크나무 마법 지팡이. 끝에 박힌 앰버 보석 내 불씨.', rarity: 'UNCOMMON', phase: 2, iconType: 'Flame' },
    { id: 'm7', name: '마나 순환', points: 15, criteria: '1주일 내 3회 이상 러닝', description: '뫼비우스의 띠 형태로 꼬인 투명 액체 튜브.', rarity: 'UNCOMMON', phase: 2, iconType: 'Activity' },
    { id: 'm8', name: '휴일의 마법사', points: 10, criteria: '주말(토/일) 러닝 1회 완료', description: '낡은 가죽 질감의 마도서. 금박 엠보싱 텍스트.', rarity: 'UNCOMMON', phase: 2, iconType: 'BookOpen' },
    { id: 'm9', name: '10km의 지평선', points: 20, criteria: '누적 달리기 거리 10km 돌파', description: '로즈골드 메탈 나침반. AI 마이크로칩 코어.', rarity: 'RARE', phase: 2, iconType: 'Compass' },
    { id: 'm10', name: '마력의 물약', points: 20, criteria: '3km 쉬지 않고 완주', description: '둥근 플라스크 속 보라색 액체. 신비로운 그림자 효과.', rarity: 'RARE', phase: 2, iconType: 'FlaskConical' },

    // Phase 3: 마법의 응용
    { id: 'm11', name: '부활의 주문', points: 10, criteria: '월요일 러닝 1회 완료', description: '돌무더기를 뚫고 피어나는 홀로그램 불사조 깃털.', rarity: 'UNCOMMON', phase: 3, iconType: 'Bird' },
    { id: 'm12', name: '영겁의 모래', points: 10, criteria: '누적 달리기 시간 100분 돌파', description: '가로로 누운 황금빛 모래시계. 우주 모래 순환.', rarity: 'UNCOMMON', phase: 3, iconType: 'Timer' },
    { id: 'm13', name: '바람의 정령', points: 10, criteria: '2km 이하 짧은 러닝 누적 5회 완료', description: '크리스탈 나비 날개. 오로라 빛 박막 간섭 효과.', rarity: 'UNCOMMON', phase: 3, iconType: 'Wind' },
    { id: 'm14', name: '일곱 별의 궤적', points: 15, criteria: '한 번에 7km 완주', description: '스페이스 블랙 원판 위 다이아몬드 북두칠성.', rarity: 'RARE', phase: 3, iconType: 'Star' },

    // Phase 4: 한계 돌파
    { id: 'm15', name: '시간의 모래시계', points: 20, criteria: '30분 연속 달리기 성공', description: '티타늄 프레임. 중력을 거스르는 은빛 모래 파티클.', rarity: 'RARE', phase: 4, iconType: 'Hourglass' },
    { id: 'm16', name: '바람의 부츠', points: 20, criteria: '이전 최고 페이스 대비 기록 단축', description: '에어로젤 재질의 날개 달린 신발. 공기 흐름 시각화.', rarity: 'RARE', phase: 4, iconType: 'Zap' },
    { id: 'm17', name: '유성우 러너', points: 25, criteria: '5km 완주 (초보자의 대목표)', description: '백금 메달. 밤하늘 배경 위 러너 실루엣 유성.', rarity: 'RARE', phase: 4, iconType: 'FastForward' },
    { id: 'm18', name: '마법 지도의 개척자', points: 30, criteria: '누적 달리기 거리 30km 돌파', description: '입체 지형도. 등고선 따라 흐르는 LED 띠.', rarity: 'EPIC', phase: 4, iconType: 'Map' },
    { id: 'm19', name: '월간 마나 마스터', points: 30, criteria: '한 달 내 10회 이상 러닝', description: '10개의 크리스탈이 결합된 왕관. 무지개빛 빛 분산.', rarity: 'EPIC', phase: 4, iconType: 'Crown' },
    { id: 'm20', name: '초월의 룬', points: 35, criteria: '10km 완주 (초보 졸업)', description: '공중에서 결합하는 황금색 룬 문자. 웅장한 아웃포커싱.', rarity: 'EPIC', phase: 4, iconType: 'Layers' },

    // Phase 5: 영광의 기록
    { id: 'm21', name: '마을 밖의 모험가', points: 15, criteria: '누적 20km 돌파', description: '양피지 위 청동 나침반. 푸른 빛 먼지 입자.', rarity: 'UNCOMMON', phase: 5, iconType: 'MapPin' },
    { id: 'm22', name: '대지의 순례자', points: 20, criteria: '누적 50km 돌파', description: '화강암 위 티타늄 마일스톤. 붉은 마나 분출.', rarity: 'RARE', phase: 5, iconType: 'Mountain' },
    { id: 'm23', name: '응축된 마나', points: 15, criteria: '누적 300분 돌파', description: '두꺼운 유리 속 액체 금속. 첨단 연금술 질감.', rarity: 'UNCOMMON', phase: 5, iconType: 'Beaker' },
    { id: 'm24', name: '마법진의 각성', points: 15, criteria: '누적 15회 러닝 달성', description: '20면체 흑색 주사위. 에메랄드 리드미컬 점멸.', rarity: 'UNCOMMON', phase: 5, iconType: 'Dices' },
    { id: 'm25', name: '마나의 결정체', points: 25, criteria: '누적 30회 러닝 달성', description: '순도 100% 자수정 클러스터. 보라색 산란광.', rarity: 'RARE', phase: 5, iconType: 'Gem' },
    { id: 'm26', name: '차원의 여행자', points: 35, criteria: '누적 100km 돌파', description: '투명 지구본 위 금빛 선 궤적. 레이트레이싱 반사.', rarity: 'EPIC', phase: 5, iconType: 'Globe' },
    { id: 'm27', name: '영겁의 톱니바퀴', points: 25, criteria: '누적 500분 돌파', description: '황동 스팀펑크 톱니바퀴. 사이버네틱 LED 링.', rarity: 'RARE', phase: 5, iconType: 'Settings' },
    { id: 'm28', name: '별빛 궤적의 수호자', points: 35, criteria: '누적 50회 러닝 달성', description: '50개의 점이 모여 만든 홀로그램 네온 별자리.', rarity: 'EPIC', phase: 5, iconType: 'Star' },
    { id: 'm29', name: '시공간의 지배자', points: 35, criteria: '누적 1,000분 돌파', description: '블랙홀 강착 원반. 소용돌이치는 플라즈마 고리.', rarity: 'EPIC', phase: 5, iconType: 'Aperture' },
    { id: 'm30', name: '백일몽의 현실화', points: 40, criteria: '누적 러닝 100회 달성', description: '사이버네틱 연꽃. 중심 코어의 압도적 백색광.', rarity: 'LEGENDARY', phase: 5, iconType: 'Flower' },

    // Phase 6: 진화하는 마법사
    { id: 'm31', name: '은빛 늑대의 궤적', points: 30, criteria: '누적 150km 돌파', description: '은빛 금속으로 조각된 달리는 늑대. 차가운 달빛 조명.', rarity: 'EPIC', phase: 6, iconType: 'Dog' },
    { id: 'm32', name: '폭풍의 인도자', points: 35, criteria: '누적 200km 돌파', description: '유리 돔 속 토네이도와 실시간 번개 방전.', rarity: 'EPIC', phase: 6, iconType: 'CloudLightning' },
    { id: 'm33', name: '대륙횡단 열차', points: 40, criteria: '누적 300km 돌파', description: '황동 기차 바퀴. 역동적인 모션 블러 효과.', rarity: 'EPIC', phase: 6, iconType: 'Train' },
    { id: 'm34', name: '마법사의 모래폭풍', points: 30, criteria: '누적 2,000분 돌파', description: '공중에 뜬 황금 모래 큐브. 빛의 산란 효과.', rarity: 'EPIC', phase: 6, iconType: 'Box' },
    { id: 'm35', name: '시간의 왜곡', points: 35, criteria: '누적 3,000분 돌파', description: '녹아내린 회중시계와 기하학적 폴리곤 배경.', rarity: 'EPIC', phase: 6, iconType: 'Clock' },
    { id: 'm36', name: '철의 의지', points: 40, criteria: '누적 150회 러닝 달성', description: '강철 모루 위 튀어 오르는 불꽃 파티클.', rarity: 'EPIC', phase: 6, iconType: 'Hammer' },
    { id: 'm37', name: '반년의 기적', points: 50, criteria: '6개월 연속 매월 5회 이상 러닝', description: '4계절 홀로그램이 회전하는 6층 마탑.', rarity: 'LEGENDARY', phase: 6, iconType: 'Tower' },
    { id: 'm38', name: '태양의 사제', points: 50, criteria: '누적 200회 러닝 달성', description: '코로나 폭발이 재현되는 작고 완벽한 항성.', rarity: 'LEGENDARY', phase: 6, iconType: 'SunInside' },
    { id: 'm39', name: '영원의 메아리', points: 40, criteria: '누적 5,000분 돌파', description: '얼어붙은 물방울 파동. 프리즘 스펙트럼 광원.', rarity: 'EPIC', phase: 6, iconType: 'Waves' },
    { id: 'm40', name: '하늘을 걷는 자', points: 50, criteria: '누적 500km 돌파', description: '은하수 텍스트가 맵핑된 반투명 발자국.', rarity: 'LEGENDARY', phase: 6, iconType: 'Footprints' },

    // Phase 7: 아크메이지의 길
    { id: 'm41', name: '시간의 절대자', points: 50, criteria: '누적 7,000분 돌파', description: '다이아몬드가 박힌 펜듈럼. 다중 노출 잔상 효과.', rarity: 'LEGENDARY', phase: 7, iconType: 'Watch' },
    { id: 'm42', name: '빛의 속도', points: 50, criteria: '누적 777km 돌파', description: '시공간을 뚫는 네온 광선과 렌즈 플레어.', rarity: 'LEGENDARY', phase: 7, iconType: 'Zap' },
    { id: 'm43', name: '무한한 동력', points: 50, criteria: '누적 250회 러닝 달성', description: '자체 발전 아크 리액터. 보라색 플라즈마 점멸.', rarity: 'LEGENDARY', phase: 7, iconType: 'BatteryCharging' },
    { id: 'm44', name: '계절의 지배자', points: 50, criteria: '사계절 각 10회 이상 러닝', description: '4개 계절 파티클이 소용돌이치는 3D 엠블럼.', rarity: 'LEGENDARY', phase: 7, iconType: 'Wind' },
    { id: 'm45', name: '크로노스의 유산', points: 50, criteria: '누적 10,000분 돌파', description: '고대 신전 기둥과 디지털 홀로그램의 결합.', rarity: 'LEGENDARY', phase: 7, iconType: 'Library' },
    { id: 'm46', name: '성간 여행자', points: 50, criteria: '누적 1,000km 돌파', description: '탐사선 형태. 이온 불꽃과 극적인 명암비.', rarity: 'LEGENDARY', phase: 7, iconType: 'Rocket' },
    { id: 'm47', name: '초월적 일상', points: 50, criteria: '누적 300회 러닝 달성', description: '백금 뫼비우스 다리. HDR 하늘 배경 반사.', rarity: 'LEGENDARY', phase: 7, iconType: 'Infinity' },
    { id: 'm48', name: '1년의 마법', points: 50, criteria: '가입 1주년 및 누적 100회 기록', description: '크리스탈 케이크와 하늘로 솟는 레이저 빔.', rarity: 'LEGENDARY', phase: 7, iconType: 'Gift' },
    { id: 'm49', name: '전설의 시작', points: 50, criteria: '누적 365회 러닝 달성', description: '돌에 꽂힌 엑스칼리버. 강렬한 황금 오라.', rarity: 'LEGENDARY', phase: 7, iconType: 'Sword' },
    { id: 'm50', name: '런-매직 아크메이지', points: 50, criteria: '1,000km & 10,000분 & 365회 달성', description: '황금 지팡이 3D 홀로그램 도시 자전.', rarity: 'LEGENDARY', phase: 7, iconType: 'Wand2' },
];
