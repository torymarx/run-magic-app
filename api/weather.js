// api/weather.js
// Vercel Serverless Proxy — OpenWeatherMap + 에어코리아 API 통합 프록시
// v25.0: 날씨 & 미세먼지 자동 입력 시스템
// 도시명(한글) + 측정소명(동)으로 조회

export default async function handler(req, res) {
    // CORS 헤더 설정
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }

    const { city, station } = req.query;

    if (!city) {
        return res.status(400).json({ error: 'city parameter is required. (예: 광주, 서울)' });
    }

    const openWeatherKey = process.env.OPENWEATHER_API_KEY;
    const airKoreaKey = process.env.AIRKOREA_API_KEY;

    const result = {
        weather: 'sun',
        temp: 18,
        dust: 'good',
        pm10: null,
        description: '',
        source: { weather: false, dust: false }
    };

    // 1. OpenWeatherMap — 도시명으로 현재 날씨 조회
    if (openWeatherKey) {
        try {
            // 한글 도시명 매핑 (OpenWeatherMap은 일부 한글명을 404 처리함)
            const cityMap = {
                '서울': 'Seoul', '부산': 'Busan', '대구': 'Daegu', '인천': 'Incheon',
                '광주': 'Gwangju', '대전': 'Daejeon', '울산': 'Ulsan', '세종': 'Sejong',
                '경기': 'Gyeonggi-do', '강원': 'Gangwon-do', '충북': 'Chungcheongbuk-do',
                '충남': 'Chungcheongnam-do', '전북': 'Jeollabuk-do', '전남': 'Jeollanam-do',
                '경북': 'Gyeongsangbuk-do', '경남': 'Gyeongsangnam-do', '제주': 'Jeju'
            };
            const mappedCity = cityMap[city] || city;
            
            const encodedCity = encodeURIComponent(mappedCity);
            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodedCity},KR&appid=${openWeatherKey}&units=metric&lang=kr`;
            const weatherRes = await fetch(weatherUrl);

            if (weatherRes.ok) {
                const data = await weatherRes.json();
                const weatherId = data.weather?.[0]?.id || 800;

                // 날씨 코드 매핑
                if (weatherId >= 200 && weatherId < 600) result.weather = 'rain';
                else if (weatherId >= 600 && weatherId < 700) result.weather = 'snow';
                else if (weatherId >= 700 && weatherId < 800) result.weather = 'cloud';
                else if (weatherId === 800) result.weather = 'sun';
                else if (weatherId > 800) result.weather = 'cloud';

                result.temp = Math.round(data.main?.temp ?? 18);
                result.description = data.weather?.[0]?.description || '';
                result.source.weather = true;

                console.log(`🌤️ Weather: ${city} → ${result.temp}°C, ${result.weather} (${result.description})`);
            } else {
                // 한글 실패 시, 영문 도시명 fallback 시도하지 않음 (로그만)
                console.error(`❌ OpenWeatherMap Error for "${city}": ${weatherRes.status}`);
            }
        } catch (err) {
            console.error('❌ OpenWeatherMap fetch failed:', err.message);
        }
    } else {
        console.warn('⚠️ OPENWEATHER_API_KEY not set. Skipping weather fetch.');
    }

    // 2. 에어코리아 — 측정소명(동)으로 미세먼지(PM10) 조회
    if (airKoreaKey && station) {
        try {
            const encodedStation = encodeURIComponent(station);
            const encodedKey = encodeURIComponent(airKoreaKey);
            const dustUrl = `http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?serviceKey=${encodedKey}&returnType=json&numOfRows=1&pageNo=1&stationName=${encodedStation}&dataTerm=DAILY&ver=1.0`;
            
            const dustRes = await fetch(dustUrl);

            if (dustRes.ok) {
                const data = await dustRes.json();
                const items = data?.response?.body?.items;

                if (items && items.length > 0) {
                    const pm10Value = parseInt(items[0].pm10Value, 10);

                    if (!isNaN(pm10Value)) {
                        result.pm10 = pm10Value;
                        if (pm10Value <= 30) result.dust = 'good';
                        else if (pm10Value <= 80) result.dust = 'soso';
                        else result.dust = 'bad';
                        result.source.dust = true;

                        console.log(`🌫️ Air: ${station} → PM10=${pm10Value}, ${result.dust}`);
                    }
                } else {
                    console.warn(`⚠️ AirKorea: 측정소 "${station}"의 데이터가 없습니다. 측정소명을 확인해 주세요.`);
                }
            } else {
                console.error(`❌ AirKorea Error: ${dustRes.status} ${dustRes.statusText}`);
            }
        } catch (err) {
            console.error('❌ AirKorea fetch failed:', err.message);
        }
    } else {
        if (!airKoreaKey) console.warn('⚠️ AIRKOREA_API_KEY not set.');
        if (!station) console.warn('⚠️ station not provided. Skipping dust.');
    }

    return res.status(200).json(result);
}
