import { describe, it, expect } from 'vitest';
import { getCoachAdvice, diagnoseRunnerProfile, getDetailedPrescription } from '../coachUtils';
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

    it('심박수가 높을 때 적절한 경고 및 격려 메시지를 반환한다', () => {
        const highHrRecord = { heart_rate: 180, distance: 5, weight: 70 };
        const mockWellnessCoach: Coach = { id: 'wellness', name: 'Wellness', emoji: '🌿', role: '부상 관리', color: '#4bff4b', themeColor: 'rgba(75, 255, 75, 0.2)', tendency: 'mental', message: 'test' };

        const advice = getCoachAdvice(highHrRecord, mockWellnessCoach);
        expect(advice).toContain('심박수');
    });

    it('should diagnose Aerobic Sieve profile', () => {
        const aerobicSieveRecord = {
            heart_rate: 170,
            pace_seconds: 450, // 7:30 pace
            cadence: 165,
            weight: 85
        };
        const profile = diagnoseRunnerProfile(aerobicSieveRecord);
        expect(profile).toBe('AEROBIC_SIEVE');
    });

    it('should diagnose Mechanical Brake profile', () => {
        const mechanicalBrakeRecord = {
            heart_rate: 140,
            pace_seconds: 300, // 5:00 pace
            cadence: 155, // Low cadence
            weight: 75
        };
        const profile = diagnoseRunnerProfile(mechanicalBrakeRecord);
        expect(profile).toBe('MECHANICAL_BRAKE');
    });

    it('should provide Run-Sync specific advice for Mechanical Brake', () => {
        const mechanicalBrakeRecord = {
            heart_rate: 140,
            pace_seconds: 300,
            cadence: 155,
            weight: 75
        };
        const mockHardCoach: Coach = {
            id: 'apex',
            name: 'Apex',
            emoji: '🦾',
            role: 'Tester',
            color: '#ff0000',
            message: 'test',
            tendency: 'hard',
            themeColor: 'rgba(0,0,0,0)'
        };
        const advice = getCoachAdvice(mechanicalBrakeRecord, mockHardCoach);
        expect(advice).toContain('기계적 브레이크형');
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

    it('심박수가 높을 때 적절한 경고 및 격려 메시지를 반환한다', () => {
        const record = { heart_rate: 180, distance: 5, weight: 70 };

        // Profile comparison takes priority, but individual HR advice is professionalized
        expect(getCoachAdvice(record, mockCoachHard)).toContain('유산소 디커플링');
    });

    it('케이던스가 최적 범위일 때 칭찬 메시지를 반환한다', () => {
        const record = { cadence: 180, heart_rate: 140, pace_seconds: 360, distance: 10, weight: 70 };
        const mockCoachPacer: Coach = { id: 'marathon', name: 'Marathon', emoji: '🏃‍♂️', role: '러닝', color: '#ffffff', themeColor: 'rgba(255, 255, 255, 0.2)', tendency: 'pacer', message: 'test' };

        // Matches EFFICIENT profile
        expect(getCoachAdvice(record, mockCoachPacer)).toContain('효율적 엔진형');
        expect(getCoachAdvice(record, mockCoachPacer)).toContain('180spm');
    });

    it('케이던스가 낮을 때 개선 방향을 제시한다', () => {
        const record = { cadence: 150, distance: 5, weight: 70 };

        expect(getCoachAdvice(record, mockCoachIntel)).toContain('수직 충격 부하');
        expect(getCoachAdvice(record, mockCoachIntel)).toContain('보폭을 줄이고 회전수');
    });

    describe('getDetailedPrescription', () => {
        it('should return 7 specific prescriptions based on coach ID', () => {
             const apexPrescription = getDetailedPrescription('EFFICIENT', 'apex');
             expect(apexPrescription.insight).toContain('최대 산소 섭취량');
             expect(apexPrescription.mental).toContain('심연으로 다이빙하십시오');
             expect(apexPrescription.issue).toContain('안주한다면 당신은 곧 정체기');

             const zenPrescription = getDetailedPrescription('EFFICIENT', 'zen');
             expect(zenPrescription.insight).toContain('신체와 정신의 통제가 거의 명상의 상태');
             expect(zenPrescription.mental).toContain('대지 위를 흐르는 바람 자체');
             expect(zenPrescription.issue).toContain('아름다운 몰입 상태');

             const insightPrescription = getDetailedPrescription('AEROBIC_SIEVE', 'insight');
             expect(insightPrescription.insight).toContain('비율이 40% 미만으로 떨어지는 임계점');

             const marathonPrescription = getDetailedPrescription('AEROBIC_SIEVE', 'marathon');
             expect(marathonPrescription.insight).toContain('글리코겐 대사 의존도');
        });
    });
});
