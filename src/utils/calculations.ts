/**
 * MM:SS 형식의 문자열을 초 단위 숫자로 변환합니다.
 */
export const parseTimeToSeconds = (timeStr: string): number => {
    if (!timeStr) return 0;
    const parts = timeStr.match(/\d+/g);
    if (!parts || parts.length === 0) return 0;

    if (parts.length === 1) return parseInt(parts[0]);
    if (parts.length === 2) {
        const mins = parseInt(parts[0]);
        const secs = parseInt(parts[1]);
        return (mins * 60) + (secs || 0);
    }
    if (parts.length === 3) {
        const hours = parseInt(parts[0]);
        const mins = parseInt(parts[1]);
        const secs = parseInt(parts[2]);
        return (hours * 3600) + (mins * 60) + (secs || 0);
    }
    return 0;
};

/**
 * 초 단위 숫자를 HH:MM:SS 또는 MM:SS 형식으로 변환합니다.
 */
export const formatSecondsToTime = (totalSeconds: number): string => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    if (h > 0) {
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

/**
 * 거리와 시간을 기반으로 소모 칼로리를 계산합니다. (기본 MET 산식 활용)
 * Calories = MET * Weight(kg) * Time(hours)
 * 러닝 평균 MET를 9.8로 가정 (약 6min/km 페이스 기준)
 */
export const calculateCalories = (distanceKm: number, timeSeconds: number, weightKg: number = 70): number => {
    const timeHours = timeSeconds / 3600;
    // 속도(km/h)에 따른 간이 MET 적용
    const speedKmh = distanceKm / timeHours;
    let met = 3; // 걷기 수준
    if (speedKmh > 8) met = 9.8;
    if (speedKmh > 10) met = 11.5;
    if (speedKmh > 12) met = 12.8;

    return Math.round(met * weightKg * timeHours);
};

/**
 * 평균 페이스를 계산합니다 (초/km).
 */
export const calculateAveragePace = (timeSeconds: number, distanceKm: number): number => {
    return distanceKm > 0 ? Math.round(timeSeconds / distanceKm) : 0;
};

/**
 * 초 단위 페이스를 M'SS" 형식으로 변환합니다.
 */
export const formatPace = (paceSeconds: number): string => {
    if (isNaN(paceSeconds) || !isFinite(paceSeconds) || paceSeconds <= 0) {
        return "0'00\"";
    }
    const rounded = Math.round(paceSeconds);
    const m = Math.floor(rounded / 60);
    const s = rounded % 60;
    return `${m}'${s.toString().padStart(2, '0')}"`;
};

/**
 * 초 단위 숫자를 'M분 S초' 또는 'H시간 M분' 형식으로 짧게 변환합니다.
 */
export const formatTimeShort = (totalSeconds: number): string => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    if (h > 0) return `${h}시간 ${m}분`;
    if (m > 0) return `${m}분 ${s}초`;
    return `${s}초`;
};
