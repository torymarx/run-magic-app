// 한국 주요 도시별 위치 및 에어코리아 측정소 매핑 데이터
// v25.0: 날씨 & 미세먼지 자동 입력 시스템

export interface CityLocation {
    id: string;
    name: string;       // 한국어 도시명
    lat: number;        // 위도 (OpenWeatherMap용)
    lon: number;        // 경도 (OpenWeatherMap용)
    station: string;    // 에어코리아 측정소명
}

export const KOREAN_CITIES: CityLocation[] = [
    { id: 'gwangju',    name: '광주',   lat: 35.1595, lon: 126.8526, station: '서석동' },
    { id: 'seoul',      name: '서울',   lat: 37.5665, lon: 126.9780, station: '종로구' },
    { id: 'busan',      name: '부산',   lat: 35.1796, lon: 129.0756, station: '연산동' },
    { id: 'daegu',      name: '대구',   lat: 35.8714, lon: 128.6014, station: '중구' },
    { id: 'daejeon',    name: '대전',   lat: 36.3504, lon: 127.3845, station: '문화동' },
    { id: 'incheon',    name: '인천',   lat: 37.4563, lon: 126.7052, station: '구월동' },
    { id: 'ulsan',      name: '울산',   lat: 35.5384, lon: 129.3114, station: '신정동' },
    { id: 'suwon',      name: '수원',   lat: 37.2636, lon: 127.0286, station: '인계동' },
    { id: 'sejong',     name: '세종',   lat: 36.4800, lon: 127.2550, station: '보람동' },
    { id: 'jeju',       name: '제주',   lat: 33.4996, lon: 126.5312, station: '이도동' },
    { id: 'changwon',   name: '창원',   lat: 35.2280, lon: 128.6811, station: '상남동' },
    { id: 'cheongju',   name: '청주',   lat: 36.6424, lon: 127.4890, station: '서문동' },
    { id: 'jeonju',     name: '전주',   lat: 35.8242, lon: 127.1480, station: '중앙동' },
    { id: 'chuncheon',  name: '춘천',   lat: 37.8813, lon: 127.7298, station: '중앙로' },
    { id: 'wonju',      name: '원주',   lat: 37.3422, lon: 127.9202, station: '무실동' },
];

// OpenWeatherMap 날씨 코드 → Run-Magic 날씨 ID 매핑
export const mapWeatherCode = (weatherId: number): string => {
    if (weatherId >= 200 && weatherId < 600) return 'rain';   // Thunderstorm, Drizzle, Rain
    if (weatherId >= 600 && weatherId < 700) return 'snow';   // Snow
    if (weatherId >= 700 && weatherId < 800) return 'cloud';  // Atmosphere (fog, mist, haze)
    if (weatherId === 800) return 'sun';                      // Clear
    if (weatherId > 800) return 'cloud';                      // Clouds
    return 'sun';
};

// 에어코리아 미세먼지 PM10 수치 → Run-Magic 등급 매핑
// 기준: 좋음(0-30), 보통(31-80), 나쁨(81+)
export const mapDustLevel = (pm10: number | null): string => {
    if (pm10 === null || pm10 === undefined) return 'good';
    if (pm10 <= 30) return 'good';
    if (pm10 <= 80) return 'soso';
    return 'bad';
};

// 도시 ID로 도시 정보 찾기
export const getCityById = (cityId: string): CityLocation | undefined => {
    return KOREAN_CITIES.find(c => c.id === cityId);
};
