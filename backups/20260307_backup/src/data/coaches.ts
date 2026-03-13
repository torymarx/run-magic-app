export type CoachTendency = 'hard' | 'vibe' | 'intel' | 'calm' | 'pacer' | 'mental';

export interface Coach {
    id: string;
    name: string;
    emoji: string;
    role: string;
    color: string;
    message: string;
    tendency: CoachTendency;
    themeColor: string;
}

export const coaches: Coach[] = [
    { id: 'apex', name: 'Apex', emoji: '🦾', role: '인터벌 & 순발력', color: '#FF4B4B', themeColor: 'rgba(255, 75, 75, 0.2)', tendency: 'hard', message: "미토콘드리아가 소리치고 있습니다! 한계를 넘어서는 인터벌을 시작하죠." },
    { id: 'insight', name: 'Insight', emoji: '🐟', role: '운동 역학 & 영양', color: '#00D1FF', themeColor: 'rgba(0, 209, 255, 0.2)', tendency: 'intel', message: "전방 15m를 주시하세요. 상체 5도 전경 자세가 중력을 추진력으로 바꿉니다." },
    { id: 'atlas', name: 'Atlas', emoji: '🏛️', role: 'LSD & 적응', color: '#4DE1FF', themeColor: 'rgba(77, 225, 255, 0.2)', tendency: 'intel', message: "심박수 50-70% 구간을 유지하며 스포츠 심장의 기초를 다지세요." },
    { id: 'swift', name: 'Swift', emoji: '⚡', role: '리듬 & 동기부여', color: '#BD00FF', themeColor: 'rgba(189, 0, 255, 0.2)', tendency: 'vibe', message: "팔 스윙은 90-110도! 경쾌한 진자 운동으로 보폭 리듬을 깨우세요." },
    { id: 'zen', name: 'Zen', emoji: '🧘', role: '호흡 & 마인드', color: '#FFACAC', themeColor: 'rgba(255, 172, 172, 0.2)', tendency: 'calm', message: "횡격막을 깊게 쓰세요. '습-습-후-후' 리듬이 자율신경계에 평온을 줍니다." },
    { id: 'marathon', name: 'Marathon', emoji: '🏃‍♂️', role: '착지 & 지형', color: '#FFD700', themeColor: 'rgba(255, 215, 0, 0.2)', tendency: 'pacer', message: "미드풋 착지의 탄성을 느끼세요. 언덕 달리기는 천연의 근력 훈련입니다." },
    { id: 'wellness', name: 'Wellness', emoji: '🌿', role: '환경 & 부상 관리', color: '#A8FFAD', themeColor: 'rgba(168, 255, 173, 0.2)', tendency: 'mental', message: "모세혈관의 흐름을 느끼며 컨디션에 맞춰 속도를 조절해 보세요." },
];
