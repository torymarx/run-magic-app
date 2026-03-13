import { describe, it, expect } from 'vitest';
import { getCoachAdvice } from '../coachUtils';
import { Coach } from '../../data/coaches';

describe('coachUtils - getCoachAdvice', () => {
    const mockCoachHard: Coach = { id: 'apex', name: 'Apex', emoji: '🦾', role: '인터벌', color: '#ff4b4b', themeColor: 'rgba(255, 75, 75, 0.2)', tendency: 'hard', message: 'test' };
    const mockCoachMental: Coach = { id: 'wellness', name: 'Wellness', emoji: '🌿', role: '부상 관리', color: '#4bff4b', themeColor: 'rgba(75, 255, 75, 0.2)', tendency: 'mental', message: 'test' };
    const mockCoachIntel: Coach = { id: 'insight', name: 'Insight', emoji: '🐟', role: '분석', color: '#4b4bff', themeColor: 'rgba(75, 75, 255, 0.2)', tendency: 'intel', message: 'test' };

    it('30도 이상의 폭염 상황에서 코치 성향에 맞는 조언을 반환한다', () => {
        const record = { temp: 30, distance: 5, weight: 70 };

        expect(getCoachAdvice(record, mockCoachHard)).toContain('폭염');
        expect(getCoachAdvice(record, mockCoachHard)).toContain('수분 보충');

        expect(getCoachAdvice(record, mockCoachMental)).toContain('더위');
        expect(getCoachAdvice(record, mockCoachMental)).toContain('환경 적응력');

        expect(getCoachAdvice(record, mockCoachIntel)).toContain('대사 효율');
    });

    it('0도 이하의 혹한 상황에서 코치 성향에 맞는 조언을 반환한다', () => {
        const record = { temp: -2, distance: 5, weight: 70 };

        expect(getCoachAdvice(record, mockCoachHard)).toContain('영하');
        expect(getCoachAdvice(record, mockCoachHard)).toContain('워밍업');

        const mockCoachCalm: Coach = { id: 'zen', name: 'Zen', emoji: '🧘', role: '호흡', color: '#ffffff', themeColor: 'rgba(255, 255, 255, 0.2)', tendency: 'calm', message: 'test' };
        expect(getCoachAdvice(record, mockCoachCalm)).toContain('자율신경계');
    });

    it('컨디션이 안 좋을 때 (condition: bad) 위로와 회복 메시지를 반환한다', () => {
        const record = { condition: 'bad', distance: 3, weight: 70 };

        expect(getCoachAdvice(record, mockCoachMental)).toContain('회복에 100% 집중');
        expect(getCoachAdvice(record, mockCoachHard)).toContain('정신적 임계치');
    });

    it('기록 향상 성공 시 (isImproved: true) 축하 메시지를 반환한다', () => {
        const record = { isImproved: true, distance: 5, weight: 75 };

        expect(getCoachAdvice(record, mockCoachIntel)).toContain('역학적 밸런스');
        expect(getCoachAdvice(record, mockCoachIntel)).toContain('75kg');

        const mockCoachPacer: Coach = { id: 'marathon', name: 'Marathon', emoji: '🏃‍♂️', role: '러닝', color: '#ffffff', themeColor: 'rgba(255, 255, 255, 0.2)', tendency: 'pacer', message: 'test' };
        expect(getCoachAdvice(record, mockCoachPacer)).toContain('미드풋 착지');
    });

    it('일반적인 상황에서 코치별 고유 서명 메시지를 반환한다', () => {
        const record = { distance: 10, weight: 70 };

        expect(getCoachAdvice(record, mockCoachHard)).toContain('[고강도 처방]');
        expect(getCoachAdvice(record, mockCoachIntel)).toContain('[생체역학 분석]');
        expect(getCoachAdvice(record, mockCoachMental)).toContain('[회복 및 예방]');
    });
});
