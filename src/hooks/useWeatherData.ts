// v25.0: 날씨 & 미세먼지 자동 입력 커스텀 훅
// 프로필의 도시+동 정보로 오늘 날씨를 자동 조회
import { useState, useCallback } from 'react';

interface WeatherData {
    weather: string;   // 'sun' | 'cloud' | 'rain' | 'snow'
    temp: number;      // 기온 (°C)
    dust: string;      // 'good' | 'soso' | 'bad'
    pm10: number | null;
    description: string;
}

interface UseWeatherDataReturn {
    weatherData: WeatherData | null;
    isLoading: boolean;
    error: string | null;
    isAutoFilled: boolean;
    fetchWeather: (city: string, station?: string) => Promise<WeatherData | null>;
}

export const useWeatherData = (): UseWeatherDataReturn => {
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isAutoFilled, setIsAutoFilled] = useState(false);

    const fetchWeather = useCallback(async (city: string, station?: string): Promise<WeatherData | null> => {
        if (!city) {
            console.warn('⚠️ 도시 정보가 설정되지 않았습니다. 프로필에서 위치를 설정해 주세요.');
            return null;
        }

        setIsLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams({ city });
            if (station) params.set('station', station);

            const response = await fetch(`/api/weather?${params}`);

            if (!response.ok) {
                throw new Error(`API 호출 실패: ${response.status}`);
            }

            const data: WeatherData = await response.json();
            setWeatherData(data);
            setIsAutoFilled(true);
            console.log(`🌤️ 날씨 자동 입력: ${city} - ${data.temp}°C, ${data.weather}, 미세먼지: ${data.dust}`);
            return data;
        } catch (err: any) {
            const message = err.message || '날씨 정보를 불러올 수 없습니다.';
            setError(message);
            console.error('❌ 날씨 조회 실패:', message);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        weatherData,
        isLoading,
        error,
        isAutoFilled,
        fetchWeather
    };
};
