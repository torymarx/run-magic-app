# DESIGN.md: Run-Magic 디자인 가이드

## 1. 디자인 컨셉: "Aurora Premium & RPG Immersion"
- **Keywords**: 압도적 아우라, 보석 같은 질감, RPG 성장 서사, 미래지향적
- **Style**: Aurora Theme 2.0 & Glassmorphism 3.0

## 2. 디자인 시스템 토큰
- **Aurora Background**: 5개의 광원을 사용한 심해 색상과 몽환적인 애니메이션 (배경 블러 25px)
- **Glassmorphism 3.0**: 
  - `backdrop-filter: blur(25px)`
  - `border: 0.5px solid rgba(255, 255, 255, 0.2)`
  - 'Inner Light' (box-shadow) 효과로 보석 같은 질감 구현
- **Typography**: 
  - Headline: **Outfit** (세련미, 가독성)
  - Body: **Inter** (정밀성, 위계)

## 3. 컬러 팔레트 (Neon & Aura)
- **Core Dark**: `#0A0A0C` (심해 배경)
- **Electric Cyan**: `#00F2FF` (미래적 지표)
- **Neon Lime**: `#ADFF00` (에너지, 성취)
- **Royal Amethyst**: `#9D00FF` (전설적 등급, 아우라)
- **Critical Red**: `#FF005C` (경고, 한계 돌파)

## 4. RPG UI & 마이크로 인터랙션
- **Character Card**: 전신 대형 카드 스타일 + 레벨별 가변 아우라 애니메이션
- **Status Bars**: Speed(Cyan), Stamina(Green), Willpower(Purple) 게이지 시각화
- **Staggered Reveal**: 페이지/섹션 진입 시 차례대로 떠오르는 애니메이션
- **Input UX**: +/- 스텝퍼와 직접 타이핑이 결합된 하이브리드 입력

## 5. 애니메이션 가이드
- **Timing**: `cubic-bezier(0.23, 1, 0.32, 1)` (빠르고 매끄러운 반응)
- **Feedback**: 성공 시 Shimmer(빛 반사) 및 Glow(발광) 효과 극대화
