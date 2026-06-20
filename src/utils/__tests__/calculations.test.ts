import { describe, it, expect } from 'vitest';
import { parseTimeToSeconds, formatSecondsToTime, formatPace, calculateCalories } from '../calculations';

describe('calculations utility', () => {
    describe('parseTimeToSeconds', () => {
        it('should parse MM:SS correctly', () => {
            expect(parseTimeToSeconds('05:30')).toBe(330);
        });

        it('should parse HH:MM:SS correctly', () => {
            expect(parseTimeToSeconds('01:20:15')).toBe(4815);
        });

        it('HH:MM:SS 형식을 초로 변환한다', () => {
            expect(parseTimeToSeconds('01:05:10')).toBe(3600 + 300 + 10);
        });

        it('시간 데이터가 없을 때 0을 반환한다', () => {
            expect(parseTimeToSeconds('')).toBe(0);
            expect(parseTimeToSeconds('invalid')).toBe(0);
        });
    });

    describe('calculations - formatSecondsToTime', () => {
        it('초를 HH:MM:SS 또는 MM:SS 형식으로 변환한다', () => {
            expect(formatSecondsToTime(65)).toBe('01:05');
            expect(formatSecondsToTime(3665)).toBe('01:01:05');
            expect(formatSecondsToTime(0)).toBe('00:00');
        });
    });

    describe('calculations - calculateCalories', () => {
        it('기본 무게(70kg)로 칼로리를 계산한다', () => {
            // 5km, 30분(1800초) -> 10km/h (MET 11.5)
            // Cal = 11.5 * 70 * 0.5 = 402.5 -> 403
            expect(calculateCalories(5, 1800)).toBe(403);
        });

        it('속도에 따라 다른 MET를 적용한다 (저속)', () => {
            // 5km, 1시간(3600초) -> 5km/h (MET 3)
            // Cal = 3 * 70 * 1 = 210
            expect(calculateCalories(5, 3600)).toBe(210);
        });

        it('속도에 따라 다른 MET를 적용한다 (고속)', () => {
            // 10km, 45분(2700초) -> 13.3km/h (MET 12.8)
            // Cal = 12.8 * 70 * 0.75 = 672
            expect(calculateCalories(10, 2700)).toBe(672);
        });
    });
    describe('formatPace', () => {
        it('should format pace seconds to M\'SS" format', () => {
            expect(formatPace(330)).toBe('5\'30"');
        });

        it('should handle invalid input', () => {
            expect(formatPace(0)).toBe("0'00\"");
            expect(formatPace(-1)).toBe("0'00\"");
        });
    });
});
