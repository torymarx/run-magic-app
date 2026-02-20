# DESIGN.md: Run-Magic 디자인 가이드

## 1. 디자인 컨셉: "Neon Aurora & Glass"
- **Keywords**: 역동성, 투명함, 미래지향적, 전문적
- **Style**: Dark Glassmorphism (배경 흐림 효과와 네온 컬러의 조화)

## 2. 컬러 팔레트
- **Core Dark**: `#0A0A0C` (딥 다크 배경)
- **Surface**: `rgba(255, 255, 255, 0.05)` (글래스 카드 배경)
- **Electric Blue**: `#00D1FF` (주요 강조색, 페이스 지표)
- **Neon Green**: `#39FF14` (성공, 에너지, 코칭 추천)
- **Vibrant Purple**: `#BD00FF` (고급 통계, 개인 기록 갱신)

## 3. 타이포그래피
- **Font**: Inter (또는 Roboto)
- **Heading**: Bold, Tracking -2% (현대적이고 단단한 느낌)
- **Body**: Regular, Line Height 1.6 (가독성 중점)

## 4. 컴포넌트 스타일
- **Cards**: `backdrop-filter: blur(12px)`, `border: 1px solid rgba(255, 255, 255, 0.1)`, `border-radius: 20px`
- **Buttons**: Gradient borders, Subtle hover scaling (+2%)
- **Charts**: 네온 그라데이션 라인, Glowing effect

## 5. 애니메이션 가이드
- **Transitions**: `cubic-bezier(0.4, 0, 0.2, 1)`, 300ms
- **Feedback**: 수치 로딩 시 카운트업 애니메이션, 데이터 진입 시 좌측에서 우측으로 페이드인
