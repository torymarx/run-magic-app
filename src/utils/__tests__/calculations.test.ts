import { describe, it, expect } from 'vitest';
import { parseTimeToSeconds, formatSecondsToTime, formatPace } from '../calculations';

describe('calculations utility', () => {
    describe('parseTimeToSeconds', () => {
        it('should parse MM:SS correctly', () => {
            expect(parseTimeToSeconds('05:30')).toBe(330);
        });

        it('should parse HH:MM:SS correctly', () => {
            expect(parseTimeToSeconds('01:20:15')).toBe(4815);
        });

        it('should handle empty string', () => {
            expect(parseTimeToSeconds('')).toBe(0);
        });
    });

    describe('formatSecondsToTime', () => {
        it('should format seconds to MM:SS', () => {
            expect(formatSecondsToTime(330)).toBe('05:30');
        });

        it('should format seconds to HH:MM:SS', () => {
            expect(formatSecondsToTime(4815)).toBe('01:20:15');
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
