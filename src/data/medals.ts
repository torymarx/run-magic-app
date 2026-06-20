
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
    { id: 'm1', name: '프로필 설정 완료', points: 20, criteria: '앱 최초 로그인 및 프로필 설정', description: '최초 가입 후 프로필 설정을 완수한 기록입니다.', rarity: 'COMMON', phase: 1, iconType: 'Shield', targetValue: 1, category: 'special' },
    { id: 'm2', name: '최초 1km 완주', points: 20, criteria: '생애 첫 1km 완주 (걷기 포함)', description: '처음으로 1km 달리기에 성공한 발자취입니다.', rarity: 'COMMON', phase: 1, iconType: 'Sprout', targetValue: 1, category: 'distance' },
    { id: 'm3', name: '10분 연속 달리기', points: 20, criteria: '처음으로 10분 연속 달리기', description: '멈추지 않고 10분 연속 달리기를 완수한 기록입니다.', rarity: 'COMMON', phase: 1, iconType: 'Zap', targetValue: 10, category: 'special' },
    { id: 'm4', name: '오전 러닝 완료', points: 50, criteria: '오전(05:00~09:00) 러닝 1회 완료', description: '오전(05:00 ~ 09:00)에 1회 러닝을 완료한 기록입니다.', rarity: 'UNCOMMON', phase: 1, iconType: 'Sun', targetValue: 1, category: 'dawnCount' },
    { id: 'm5', name: '야간 러닝 완료', points: 50, criteria: '야간(19:00~24:00) 러닝 1회 완료', description: '야간(19:00 ~ 24:00)에 1회 러닝을 완료한 기록입니다.', rarity: 'UNCOMMON', phase: 1, iconType: 'Moon', targetValue: 1, category: 'nightCount' },

    // Phase 2: 습관의 형성
    { id: 'm6', name: '3일 연속 달리기', points: 50, criteria: '3일 연속 러닝 인증', description: '꾸준함의 시작으로 3일 연속 러닝을 완수한 기록입니다.', rarity: 'UNCOMMON', phase: 2, iconType: 'Flame', targetValue: 3, category: 'streak' },
    { id: 'm7', name: '주 3회 러닝 달성', points: 50, criteria: '1주일 내 3회 이상 러닝', description: '일주일 안에 3번 이상 달리기를 실천한 기록입니다.', rarity: 'UNCOMMON', phase: 2, iconType: 'Activity', targetValue: 3, category: 'sessions' },
    { id: 'm8', name: '주말 러닝 완료', points: 50, criteria: '주말(토/일) 러닝 1회 완료', description: '토요일 혹은 일요일에 주말 러닝을 1회 완수한 기록입니다.', rarity: 'UNCOMMON', phase: 2, iconType: 'BookOpen', targetValue: 1, category: 'weekendCount' },
    { id: 'm9', name: '누적 10km 돌파', points: 100, criteria: '누적 달리기 거리 10km 돌파', description: '누적 러닝 거리 10km를 돌파한 영광의 메달입니다.', rarity: 'RARE', phase: 2, iconType: 'Compass', targetValue: 10, category: 'distance' },
    { id: 'm10', name: '단일 3km 완주', points: 100, criteria: '3km 쉬지 않고 완주', description: '한 번의 러닝으로 쉬지 않고 3km를 완수한 기록입니다.', rarity: 'RARE', phase: 2, iconType: 'FlaskConical', targetValue: 3, category: 'special' },

    // Phase 3: 실력의 응용
    { id: 'm11', name: '월요병 격파 러닝', points: 50, criteria: '월요일 러닝 1회 완료', description: '한 주를 활기차게 여는 월요일 러닝을 1회 완료한 기록입니다.', rarity: 'UNCOMMON', phase: 3, iconType: 'Bird', targetValue: 1, category: 'mondayCount' },
    { id: 'm12', name: '누적 러닝 100분', points: 50, criteria: '누적 달리기 시간 100분 돌파', description: '누적 러닝 시간 100분을 달성한 기록입니다.', rarity: 'UNCOMMON', phase: 3, iconType: 'Timer', targetValue: 100, category: 'time' },
    { id: 'm13', name: '단거리 러닝 5회', points: 50, criteria: '2km 이하 짧은 러닝 누적 5회 완료', description: '2km 이하의 짧고 굵은 러닝을 5회 완료한 기록입니다.', rarity: 'UNCOMMON', phase: 3, iconType: 'Wind', targetValue: 5, category: 'shortRunCount' },
    { id: 'm14', name: '단일 7km 완주', points: 100, criteria: '한 번에 7km 완주', description: '한 번의 러닝으로 쉬지 않고 7km를 완수한 기록입니다.', rarity: 'RARE', phase: 3, iconType: 'Star', targetValue: 7, category: 'special' },

    // Phase 4: 한계 돌파
    { id: 'm15', name: '30분 연속 달리기', points: 100, criteria: '30분 연속 달리기 성공', description: '30분 동안 쉬지 않고 페이스를 유지하여 완수한 기록입니다.', rarity: 'RARE', phase: 4, iconType: 'Hourglass', targetValue: 30, category: 'special' },
    { id: 'm16', name: '최고 페이스 경신', points: 100, criteria: '이전 최고 페이스 대비 기록 단축', description: '이전의 본인 최고 페이스 기록을 깨뜨린 순간입니다.', rarity: 'RARE', phase: 4, iconType: 'Zap', targetValue: 1, category: 'special' },
    { id: 'm17', name: '단일 5km 완주', points: 100, criteria: '5km 완주 (초보자의 대목표)', description: '한 번의 러닝으로 쉬지 않고 5km 완주를 기록했습니다.', rarity: 'RARE', phase: 4, iconType: 'FastForward', targetValue: 5, category: 'special' },
    { id: 'm18', name: '누적 30km 돌파', points: 250, criteria: '누적 달리기 거리 30km 돌파', description: '꾸준히 달려 누적 거리 30km를 돌파한 기록입니다.', rarity: 'EPIC', phase: 4, iconType: 'Map', targetValue: 30, category: 'distance' },
    { id: 'm19', name: '월 10회 러닝 달성', points: 250, criteria: '한 달 내 10회 이상 러닝', description: '한 달 이내에 10회 이상 달리기를 성공한 성실함의 메달입니다.', rarity: 'EPIC', phase: 4, iconType: 'Crown', targetValue: 10, category: 'sessions' },
    { id: 'm20', name: '단일 10km 완주', points: 250, criteria: '10km 완주 (초보 졸업)', description: '초보 러너를 탈출하고 단일 10km 완주에 성공한 기록입니다.', rarity: 'EPIC', phase: 4, iconType: 'Layers', targetValue: 10, category: 'special' },

    // Phase 5: 영광의 기록
    { id: 'm21', name: '누적 20km 돌파', points: 50, criteria: '누적 20km 돌파', description: '꾸준한 달리기로 누적 거리 20km를 달성한 기록입니다.', rarity: 'UNCOMMON', phase: 5, iconType: 'MapPin', targetValue: 20, category: 'distance' },
    { id: 'm22', name: '누적 50km 돌파', points: 100, criteria: '누적 50km 돌파', description: '포기하지 않고 누적 거리 50km를 달성한 기록입니다.', rarity: 'RARE', phase: 5, iconType: 'Mountain', targetValue: 50, category: 'distance' },
    { id: 'm23', name: '누적 러닝 300분', points: 50, criteria: '누적 300분 돌파', description: '심장과 근육이 단련되어 누적 러닝 300분을 돌파한 기록입니다.', rarity: 'UNCOMMON', phase: 5, iconType: 'Beaker', targetValue: 300, category: 'time' },
    { id: 'm24', name: '누적 러닝 15회', points: 50, criteria: '누적 15회 러닝 달성', description: '습관을 완전히 들여 누적 러닝 15회를 달성한 메달입니다.', rarity: 'UNCOMMON', phase: 5, iconType: 'Dices', targetValue: 15, category: 'sessions' },
    { id: 'm25', name: '누적 러닝 30회', points: 100, criteria: '누적 30회 러닝 달성', description: '누적 러닝 횟수 30회를 기록하여 강인해진 증거입니다.', rarity: 'RARE', phase: 5, iconType: 'Gem', targetValue: 30, category: 'sessions' },
    { id: 'm26', name: '누적 100km 돌파', points: 250, criteria: '누적 100km 돌파', description: '대망의 세 자릿수, 누적 거리 100km를 완성한 자랑스러운 메달입니다.', rarity: 'EPIC', phase: 5, iconType: 'Globe', targetValue: 100, category: 'distance' },
    { id: 'm27', name: '누적 러닝 500분', points: 100, criteria: '누적 500분 돌파', description: '땀방울이 모여 누적 러닝 시간 500분을 돌파한 기록입니다.', rarity: 'RARE', phase: 5, iconType: 'Settings', targetValue: 500, category: 'time' },
    { id: 'm28', name: '누적 러닝 50회', points: 250, criteria: '누적 50회 러닝 달성', description: '누적 러닝 횟수 50회를 기록하여 끈기의 상징이 되었습니다.', rarity: 'EPIC', phase: 5, iconType: 'Star', targetValue: 50, category: 'sessions' },
    { id: 'm29', name: '누적 러닝 1,000분', points: 250, criteria: '누적 1,000분 돌파', description: '누적 러닝 시간 1,000분을 정복한 역사적인 메달입니다.', rarity: 'EPIC', phase: 5, iconType: 'Aperture', targetValue: 1000, category: 'time' },
    { id: 'm30', name: '누적 러닝 100회', points: 500, criteria: '누적 러닝 100회 달성', description: '누적 러닝 횟수 100회를 기록하여 마스터의 반열에 오른 순간입니다.', rarity: 'LEGENDARY', phase: 5, iconType: 'Flower', targetValue: 100, category: 'sessions' },

    // Phase 6: 진화하는 런너
    { id: 'm31', name: '누적 150km 돌파', points: 250, criteria: '누적 150km 돌파', description: '끈기를 바탕으로 누적 거리 150km를 달성한 기록입니다.', rarity: 'EPIC', phase: 6, iconType: 'Dog', targetValue: 150, category: 'distance' },
    { id: 'm32', name: '누적 200km 돌파', points: 250, criteria: '누적 200km 돌파', description: '한계를 넘어 누적 거리 200km 고지를 밟은 업적입니다.', rarity: 'EPIC', phase: 6, iconType: 'CloudLightning', targetValue: 200, category: 'distance' },
    { id: 'm33', name: '누적 300km 돌파', points: 250, criteria: '누적 300km 돌파', description: '지치지 않는 철마처럼 누적 거리 300km를 완성한 위대한 기록입니다.', rarity: 'EPIC', phase: 6, iconType: 'Train', targetValue: 300, category: 'distance' },
    { id: 'm34', name: '누적 러닝 2,000분', points: 250, criteria: '누적 2,000분 돌파', description: '끊임없는 훈련으로 누적 러닝 시간 2,000분을 달성한 기록입니다.', rarity: 'EPIC', phase: 6, iconType: 'Box', targetValue: 2000, category: 'time' },
    { id: 'm35', name: '누적 러닝 3,000분', points: 250, criteria: '누적 3,000분 돌파', description: '엄청난 지구력으로 누적 러닝 시간 3,000분을 완성한 기록입니다.', rarity: 'EPIC', phase: 6, iconType: 'Clock', targetValue: 3000, category: 'time' },
    { id: 'm36', name: '누적 러닝 150회', points: 250, criteria: '누적 150회 러닝 달성', description: '철과 같은 끈기로 누적 러닝 150회를 실천한 업적입니다.', rarity: 'EPIC', phase: 6, iconType: 'Hammer', targetValue: 150, category: 'sessions' },
    { id: 'm37', name: '6개월 꾸준한 러너', points: 500, criteria: '6개월 연속 매월 5회 이상 러닝', description: '6개월 동안 매달 최소 5회 이상 꾸준히 달려 기적을 만든 메달입니다.', rarity: 'LEGENDARY', phase: 6, iconType: 'Tower', targetValue: 6, category: 'special' },
    { id: 'm38', name: '누적 러닝 200회', points: 500, criteria: '누적 200회 러닝 달성', description: '태양처럼 식지 않는 열정으로 누적 러닝 200회를 수립한 순간입니다.', rarity: 'LEGENDARY', phase: 6, iconType: 'SunInside', targetValue: 200, category: 'sessions' },
    { id: 'm39', name: '누적 러닝 5,000분', points: 250, criteria: '누적 5,000분 돌파', description: '끊임없이 길 위를 달려 누적 러닝 시간 5,000분을 돌파한 대기록입니다.', rarity: 'EPIC', phase: 6, iconType: 'Waves', targetValue: 5000, category: 'time' },
    { id: 'm40', name: '누적 500km 돌파', points: 500, criteria: '누적 500km 돌파', description: '누적 거리 500km를 돌파하여 지역 내 최정상 러너로 거듭났습니다.', rarity: 'LEGENDARY', phase: 6, iconType: 'Footprints', targetValue: 500, category: 'distance' },

    // Phase 7: 아크메이지의 길
    { id: 'm41', name: '누적 러닝 7,000분', points: 500, criteria: '누적 7,000분 돌파', description: '시간의 한계를 초월하여 누적 러닝 7,000분을 달성한 업적입니다.', rarity: 'LEGENDARY', phase: 7, iconType: 'Watch', targetValue: 7000, category: 'time' },
    { id: 'm42', name: '누적 777km 돌파', points: 500, criteria: '누적 777km 돌파', description: '럭키 넘버 777! 누적 거리 777km 돌파의 짜릿한 기록입니다.', rarity: 'LEGENDARY', phase: 7, iconType: 'Zap', targetValue: 777, category: 'distance' },
    { id: 'm43', name: '누적 러닝 250회', points: 500, criteria: '누적 250회 러닝 달성', description: '마르지 않는 에너지를 증명하며 누적 러닝 250회를 완수한 메달입니다.', rarity: 'LEGENDARY', phase: 7, iconType: 'BatteryCharging', targetValue: 250, category: 'sessions' },
    { id: 'm44', name: '사계절 올웨더 러너', points: 500, criteria: '사계절 각 10회 이상 러닝', description: '봄, 여름, 가을, 겨울 각 계절별 최소 10회 이상 달리기를 완성한 메달입니다.', rarity: 'LEGENDARY', phase: 7, iconType: 'Wind', targetValue: 4, category: 'special' },
    { id: 'm45', name: '누적 러닝 10,000분', points: 500, criteria: '누적 10,000분 돌파', description: '누적 러닝 10,000분(약 166시간)이라는 불멸의 대업을 완수했습니다.', rarity: 'LEGENDARY', phase: 7, iconType: 'Library', targetValue: 10000, category: 'time' },
    { id: 'm46', name: '누적 1,000km 돌파', points: 500, criteria: '누적 1,000km 돌파', description: '지구와 우주를 가로지르는 듯한 누적 거리 1,000km 완주의 기적입니다.', rarity: 'LEGENDARY', phase: 7, iconType: 'Rocket', targetValue: 1000, category: 'distance' },
    { id: 'm47', name: '누적 러닝 300회', points: 500, criteria: '누적 300회 러닝 달성', description: '달리기가 매일의 숨쉬기가 되어 누적 러닝 300회를 달성했습니다.', rarity: 'LEGENDARY', phase: 7, iconType: 'Infinity', targetValue: 300, category: 'sessions' },
    { id: 'm48', name: '1주년 & 100회 달성', points: 500, criteria: '가입 1주년 및 누적 100회 기록', description: '런매직과 함께한 지 1년이 지나며, 100회 달리기를 동시에 달성했습니다.', rarity: 'LEGENDARY', phase: 7, iconType: 'Gift', targetValue: 365, category: 'special' },
    { id: 'm49', name: '누적 러닝 365회', points: 500, criteria: '누적 365회 러닝 달성', description: '1년의 매일 매일을 수놓은 끈기로 누적 러닝 365회 달성했습니다.', rarity: 'LEGENDARY', phase: 7, iconType: 'Sword', targetValue: 365, category: 'sessions' },
    { id: 'm50', name: '그랜드마스터 (궁극 달성)', points: 500, criteria: '1,000km & 10,000분 & 365회 달성', description: '1,000km & 10,000분 & 365회 기록을 모두 정복하여 최강자에 올랐습니다.', rarity: 'LEGENDARY', phase: 7, iconType: 'Wand2', targetValue: 1, category: 'special' },

    // Phase 8: 전설을 넘어선 성좌
    { id: 'm51', name: '누적 1,500km 돌파', points: 1000, criteria: '누적 1,500km 달성', description: '초장거리 마일스톤인 누적 1,500km를 달성한 전설적인 증표입니다.', rarity: 'MYTHIC', phase: 8, iconType: 'Sparkles', targetValue: 1500, category: 'distance' },
    { id: 'm52', name: '누적 러닝 15,000분', points: 1000, criteria: '누적 15,000분 주행', description: '누적 15,000분 주행에 성공하여 러닝의 달인이 되었습니다.', rarity: 'MYTHIC', phase: 8, iconType: 'Telescope', targetValue: 15000, category: 'time' },
    { id: 'm53', name: '누적 러닝 500회', points: 1000, criteria: '총 500회 러닝 달성', description: '누적 러닝 500회를 돌파하여 강철 같은 체력을 입증했습니다.', rarity: 'MYTHIC', phase: 8, iconType: 'Satellite', targetValue: 500, category: 'sessions' },
    { id: 'm54', name: '새벽의 수호자 (20회)', points: 500, criteria: '새벽 4~6시 러닝 20회', description: '새벽 4시 ~ 6시 사이의 아침잠을 이겨내고 20회 러닝을 완수했습니다.', rarity: 'LEGENDARY', phase: 8, iconType: 'Star', targetValue: 20, category: 'earlyCount' },
    { id: 'm55', name: '심야의 질주자 (20회)', points: 500, criteria: '심야 22~02시 러닝 20회', description: '밤 10시 ~ 새벽 2시 사이의 칠흑 같은 어둠 속에서 20회 러닝을 완수했습니다.', rarity: 'LEGENDARY', phase: 8, iconType: 'Moon', targetValue: 20, category: 'lateCount' },
    { id: 'm56', name: '우천/강설 러닝 10회', points: 1000, criteria: '악천후 속 러닝 10회 (비/눈 실측)', description: '눈, 비가 내리는 혹독한 날씨를 뚫고 10회 러닝을 완수했습니다.', rarity: 'MYTHIC', phase: 8, iconType: 'Wind', targetValue: 10, category: 'stormCount' },
    { id: 'm57', name: '누적 2,000km 돌파', points: 1000, criteria: '누적 2,000km 달성', description: '누적 2,000km라는 압도적인 질주 기록을 수립했습니다.', rarity: 'MYTHIC', phase: 8, iconType: 'Nebula', targetValue: 2000, category: 'distance' },
    { id: 'm58', name: '페이스 4\'15" 돌파', points: 1000, criteria: '평균 페이스 4\'15" 진입', description: '평균 페이스 4분 15초 이하를 기록하여 상급자로 거듭났습니다.', rarity: 'MYTHIC', phase: 8, iconType: 'Lightning', targetValue: 255, category: 'pace' },
    { id: 'm59', name: '누적 러닝 1,000회', points: 1000, criteria: '총 1,000회 러닝 달성', description: '신의 경지, 누적 러닝 1,000회에 도달한 전무후무한 대기록입니다.', rarity: 'MYTHIC', phase: 8, iconType: 'Constellation', targetValue: 1000, category: 'sessions' },
    { id: 'm60', name: '지구 한 바퀴 (40,075km)', points: 1000, criteria: '누적 40,075km (최종 목표)', description: '지구 둘레(40,075km)에 해당하는 거리를 달성한 궁극의 신화적 증표입니다.', rarity: 'MYTHIC', phase: 8, iconType: 'Earth', targetValue: 40075, category: 'distance' },
    { id: 'm61', name: '단일 4km 완주', points: 100, criteria: '단일 기록으로 4km 완주', description: '단일 러닝 세션에서 중간에 멈춤 없이 4km 완주를 기록했습니다.', rarity: 'RARE', phase: 3, iconType: 'FastForward', targetValue: 4, category: 'special' },
    { id: 'm62', name: '단일 5km 완주', points: 100, criteria: '단일 기록으로 5km 완주', description: '단일 러닝 세션에서 중간에 멈춤 없이 5km 완주를 기록했습니다.', rarity: 'RARE', phase: 4, iconType: 'FastForward', targetValue: 5, category: 'special' },
    { id: 'm63', name: '단일 6km 완주', points: 100, criteria: '단일 기록으로 6km 완주', description: '단일 러닝 세션에서 중간에 멈춤 없이 6km 완주를 기록했습니다.', rarity: 'RARE', phase: 4, iconType: 'FastForward', targetValue: 6, category: 'special' },
    { id: 'm64', name: '3km 페이스 돌파 (5\'30")', points: 150, criteria: '3km 이상 주행 및 평균 페이스 5\'30" 이하', description: '3km 이상 달리기에서 평균 페이스 5분 30초 이하를 기록한 증표입니다.', rarity: 'RARE', phase: 4, iconType: 'Zap', targetValue: 330, category: 'pace' },
    { id: 'm65', name: '4km 페이스 돌파 (5\'30")', points: 150, criteria: '4km 이상 주행 및 평균 페이스 5\'30" 이하', description: '4km 이상 달리기에서 평균 페이스 5분 30초 이하를 기록한 증표입니다.', rarity: 'RARE', phase: 4, iconType: 'Zap', targetValue: 330, category: 'pace' },
    { id: 'm66', name: '5km 페이스 돌파 (5\'30")', points: 200, criteria: '5km 이상 주행 및 평균 페이스 5\'30" 이하', description: '5km 이상 달리기에서 평균 페이스 5분 30초 이하를 기록한 증표입니다.', rarity: 'EPIC', phase: 5, iconType: 'Lightning', targetValue: 330, category: 'pace' },
    { id: 'm67', name: '10km Sub-1 (1시간 내 완주)', points: 300, criteria: '10km 이상 주행 및 1시간 이내 완주', description: '10km 러닝 코스를 1시간 이내(Sub-1)로 돌파한 실력자의 기록입니다.', rarity: 'EPIC', phase: 5, iconType: 'Clock', targetValue: 3600, category: 'special' },
];
