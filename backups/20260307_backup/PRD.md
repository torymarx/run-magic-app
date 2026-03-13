# PRD: Run-Magic (러닝 코치 앱)

## 1. 제품 개요
데이터 기반의 러닝 트래킹 및 고도화된 AI 코칭을 제공하여 사용자의 러닝 성과를 극대화하고, RPG 스타일의 성장 서사를 통해 강력한 동기부여를 제공하는 프리미엄 웹 애플리케이션.

## 2. 타겟 사용자
- 자신의 러닝 데이터를 정밀하게 기록하고 분석하고 싶은 러너
- 전문적인 AI 코칭(7인 페르소나)을 통해 성과를 개선하고 싶은 사용자
- 캐릭터 성장 시스템과 시각적 아우라로 성취감을 느끼고 싶은 사용자

## 3. 핵심 기능 (v21.8)
### 3.1. 데이터 트래킹 및 분석
- 정밀 기록 입력 (시간, 거리, 페이스, 기온, 체중 연동)
- 가상 레이스 트릭 (Virtual Race Track): 과거의 나, 평균 기록과 실시간 경주 시뮬레이션
- 클라우드 전용 아키텍처 (Cloud-Only): Supabase 기반의 철저한 데이터 동기화 및 보안

### 3.2. 지능형 AI 코칭 스튜디오
- 7인 전문 코칭 스탭 (Apex, Insight, Wellness 등)의 상황별 맞춤형 피드백
- BMI 및 실전 질주 데이터를 기반으로 한 능동적 로드맵 제시

### 3.3. 캐릭터 성장 및 RPG 시스템
- 5단계 단계별 마법사 성장 서사 (비기너 ~ 아크메이지/마스터)
- RPG 스테이터스 시트: Speed, Stamina, Willpower 게이지 시각화
- 50종 이상의 메달 및 칭호 시스템 연동

### 3.4. 프리미엄 비주얼 경험
- Aurora Theme 2.0 및 Glassmorphism 3.0 적용
- 모바일 최적화 반응형 대시보드 (Responsive Card & Mobile Stack)

## 4. 기술 스택
- **Frontend**: Vite + React + TypeScript
- **Backend/Auth**: Supabase (Auth, RLS, Database)
- **Styling**: Vanilla CSS (Premium Dark Theme, Aurora Background)
- **Visualization**: Recharts + Custom CSS Animations

## 5. 단계별 로드맵 (업데이트: 2026-02-27)
1. **v1.0 - v14.0**: 초기 기반 구축 및 프리미엄 비주얼 오버홀 완료.
2. **v15.0 - v21.0**: 캐릭터 성장 서사, RPG 시스템 및 7인 코칭 시스템 완성.
3. **v21.8 (Current)**: 튜토리얼 데이터 패키지 및 사용 설명서 정밀화 완료.
4. **v22.0 (Next)**: 보안 코드 감사, 테스트 코드 도입(Vitest) 및 App.tsx 리팩토링 진행 예정.
