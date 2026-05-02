import { parseTimeToSeconds } from './calculations';
import { Coach, coaches } from '../data/coaches';

export type RunnerProfile = 'AEROBIC_SIEVE' | 'MECHANICAL_BRAKE' | 'FATIGUE_SIGNATURE' | 'EFFICIENT' | 'UNKNOWN' | 'INITIAL_CONSULT';

export interface InitialConsultation {
    bmi: number;
    bmiCategory: 'LOW' | 'NORMAL' | 'OVER' | 'OBESE';
    advice: {
        issue: string;
        improvement: string;
        nextTask: string;
        insight: string;
        mental: string;
    };
}

export const diagnoseRunnerProfile = (record: any): RunnerProfile => {
    if (!record) return 'UNKNOWN';
    
    // pace_seconds가 없으면 pace 스트링을 파싱하여 시도
    let pace = record.pace_seconds;
    if (!pace && record.pace) {
        if (typeof record.pace === 'number') {
            pace = record.pace;
        } else if (typeof record.pace === 'string') {
            pace = parseTimeToSeconds(record.pace);
        }
    }
    
    if (!pace) return 'UNKNOWN';

    const condition = record.condition || 'normal';
    const distance = record.distance || 0;
    
    const hr = record.heart_rate || record.hr;
    const cad = record.cadence || record.cad;
    const weight = record.weight;

    // --- 1. 생체 데이터(심박/케이던스)가 입력된 경우 우선 분석 (정밀 코칭) ---
    if (hr || cad) {
        // 케이던스가 매우 낮고 페이스가 준수한 경우 -> 기계적 브레이크
        if (cad && pace < 360 && cad < 160) return 'MECHANICAL_BRAKE';
        
        // 심박수가 높고 페이스가 느린 경우 -> 유산소 누수
        if (hr && pace > 420 && hr > 155) {
            if (weight && weight > 80) return 'AEROBIC_SIEVE';
            if (hr > 165) return 'AEROBIC_SIEVE';
        }

        // 컨디션 악화 + 고심박 + 안정적인 페이스 -> 후반 붕괴
        if (hr && (condition === 'bad' || condition === 'worst') && pace > 360 && hr > 165) return 'FATIGUE_SIGNATURE';

        // 높은 케이던스와 안정적인 심박수 -> 효율적 엔진
        if (hr && cad && cad >= 170 && hr <= 150) return 'EFFICIENT';
    }

    // --- 2. 생체 데이터가 없거나 위 조건에 부합하지 않는 경우 대체 로직 (Fallback) ---
    // 1. 후반 붕괴형 (Fatigue Signature) : 컨디션이 나쁘고 일정 거리 이상 달린 경우
    if ((condition === 'bad' || condition === 'worst') && distance >= 3) return 'FATIGUE_SIGNATURE';

    // 2. 기계적 브레이크형 (Mechanical Brake) : 페이스가 7분(420초) 이상으로 다소 느린 경우
    if (pace >= 420) return 'MECHANICAL_BRAKE';

    // 3. 유산소 누수형 (Aerobic Sieve) : 단거리(3km 미만)를 5분 이하의 너무 빠른 페이스로 뛴 경우 (오버페이스)
    if (pace < 300 && distance < 3) return 'AEROBIC_SIEVE';

    // 4. 효율적 러너 (Efficient) : 컨디션이 좋고 페이스가 5~7분 사이인 경우
    if ((condition === 'best' || condition === 'good') || (pace >= 300 && pace < 420)) return 'EFFICIENT';

    return 'INITIAL_CONSULT';
};

/**
 * 프로파일 영문명을 한글로 변환합니다.
 */
export const getProfileKoreanName = (profile: RunnerProfile): string => {
    const names: Record<RunnerProfile, string> = {
        'AEROBIC_SIEVE': '유산소 누수형',
        'MECHANICAL_BRAKE': '기계적 브레이크형',
        'FATIGUE_SIGNATURE': '후반 붕괴형',
        'EFFICIENT': '효율적 엔진형',
        'INITIAL_CONSULT': '초기 전략 진단',
        'UNKNOWN': '데이터 분석 중'
    };
    return names[profile] || names['UNKNOWN'];
};

/**
 * 프로파일별 구조화된 처방 데이터를 코치의 성향에 맞춰 제공합니다.
 */
export const getDetailedPrescription = (
    profile: RunnerProfile, 
    coachId: string, 
    stats?: { heartRate?: number | null, cadence?: number | null, weight?: number | null, pace?: number | null }
) => {
    const prescriptions: Record<RunnerProfile, Record<string, { issue: string; improvement: string; nextTask: string; insight: string; mental: string; }>> = {
        'AEROBIC_SIEVE': {
            'apex': {
                issue: "고강도 훈련 비중이 높아 유산소 베이스 구축이 되지 않은 상태입니다. VO2 Max 향상 이전에 기초 토대가 부실합니다.",
                improvement: "점진적 과부하(10% 룰)를 철저히 지키세요. 주간 마일리지 증가는 10%를 넘지 않아야 합니다.",
                nextTask: "내일 훈련은 잭 다니엘스의 E 페이스(최대 심박수 65-79%) 조깅으로 제한하고, 60분 이상 심근을 단련하십시오.",
                insight: "ATL(급성 훈련 피로) 수치가 CTL(만성 체력)을 초월하여 오버트레이닝 위험 구간입니다. 훈련 강도 제어가 필요합니다.",
                mental: "훈련 부하를 데이터로 증명하십시오. 무작정 달리는 것은 훈련이 아니라 노동입니다."
            },
            'insight': {
                issue: "보폭에 의존하여 심박이 요동칩니다. 케이던스가 170 이하로 떨어져 매 걸음 수직 충격이 발생하고 있습니다.",
                improvement: "자연스러운 미드풋 착지를 유도하기 위해 보폭을 줄이고 케이던스를 최소 170 이상으로 상향 평준화하세요.",
                nextTask: "메트로놈 앱(175bpm)을 켜고, 2:2 호흡법(두 발자국 흡기, 두 발자국 호기)을 신경 쓰며 30분간 달려보십시오.",
                insight: "GCT(지면 접촉 시간) 상승으로 수직 충격이 누적되어 하체 피로를 유발. 롤링 역학 수정이 시급합니다.",
                mental: "질주는 데이터와 역학의 아름다운 춤입니다. 각도 하나가 효율을 바꿉니다."
            },
            'atlas': {
                issue: "기초 체력이 마련되지 않아 심장이 과도하게 무리하고 있습니다. 80:20 훈련 법칙이 전혀 지켜지지 않고 있군요.",
                improvement: "고강도 훈련 욕심을 버리세요. 전체 훈련 시간의 80% 이상은 옆 사람과 대화가 가능한 '말하기 테스트' 패스 강도여야 합니다.",
                nextTask: "시계를 보지 말고, 편안한 대화가 가능한 조깅(E 페이스)으로 이번 주 전체 훈련을 채워 기초(Base)를 다지세요.",
                insight: "유산소 대사 구간(Zone 2) 훈련 절대량 부족으로, 젖산 역치 도달 시간이 현저히 빠릅니다.",
                mental: "가장 위대한 건축물은 가장 넓고 단단한 기초(Base Building) 위에서만 완성됩니다."
            },
            'swift': {
                issue: "템포가 무너져 페이스가 들쭉날쭉합니다! 훈련의 목적성(E, M, T, I, R) 없이 스피드만 내려 하고 있어요.",
                improvement: "목적에 맞는 페이스를 지키세요. T 페이스(젖산 역치) 훈련이 아니면 무리하게 속도를 올려서는 안 됩니다.",
                nextTask: "무산소 역치를 자극하기 전, 짧고 빠른 I 페이스(Interval) 1분 질주 후 2분 회복을 반복하며 감각을 익혀보세요.",
                insight: "페이스 변동성 폭주로 글리코겐 무산소 대사 효율이 급감. 리드미컬한 에너지 분배가 필요합니다.",
                mental: "빠르다는 것은 거칠다는 뜻이 아닙니다. 번개처럼 빠르면서도 깃털처럼 가벼워야죠!"
            },
            'zen': {
                issue: "숨이 목까지 차올라 헐떡이고 계십니다. 과호흡으로 이산화탄소가 불균형해져 러닝이 고통으로 변질되었네요.",
                improvement: "코로 깊게 들이쉬고 입으로 짧게 내뱉는 2:2 리듬 호흡법을 통해 폐의 환기를 돕고 마음을 차분히 가라앉히세요.",
                nextTask: "내일은 속도를 잊고 들숨과 날숨의 리듬에만 오직 집중하는 명상 러닝을 40분간 수행하십시오.",
                insight: "교감신경 지배적 상태. 호흡 통제를 통해 부교감신경을 일깨우고 심박 변동성(HRV)을 복구해야 합니다.",
                mental: "바람의 흐름을 억지로 가르려 하지 마세요. 호흡에 올라타 바람과 함께 흐르십시오."
            },
            'marathon': {
                issue: "장거리를 버티기엔 유산소 베이스가 아쉽습니다. 풀코스의 벽을 넘으려면 M 페이스(실전 레이스) 적응이 필요합니다.",
                improvement: "초반의 조급함을 버리세요. 주간 훈련 메뉴에 주말 장거리 롱런(LSD)을 추가해 34회의 지구력 베이스를 닦아야 합니다.",
                nextTask: "주말에는 거리를 목표로, 10km 구간마다 에너지 젤 하나씩 섭취하는 실전 뉴트리션 전략을 예행연습 하세요.",
                insight: "장거리 레이스 에너지 대사 전환 스위치 미흡. 1.2~1.6g/kg의 적정 단백질 보충 전략을 병행하십시오.",
                mental: "우리는 1km를 가장 빨리 가는 사람이 아니라, 최후의 42km에서 웃는 사람이 되려는 것입니다."
            },
            'wellness': {
                issue: "근육에 미세 파열과 피로가 너무 많이 쌓인 상태로 달리셨어요. 휴식도 가장 중요한 훈련의 일부랍니다.",
                improvement: "부상 예방을 위해 편측 고관절 및 무릎 중심의 동적 코어 운동(스트렝스 훈련)을 주 2회 꼭 병행해 주세요.",
                nextTask: "오늘은 러닝화를 벗어두고 8시간 이상의 꿀잠(수면)과 함께 CAM(압박, 활동, 마사지) 요법으로 근막을 다정하게 풀어주세요.",
                insight: "근신경계 항상성 저하. 스트레스를 극복하고 밸런스를 되찾는 적극적 회복(Active Recovery)이 필수입니다.",
                mental: "오늘 흘린 땀방울과 푹 자고 일어난 내일의 개운함이 예쁜 런너님을 완성한답니다."
            }
        },
        'MECHANICAL_BRAKE': {
            'apex': {
                issue: "수직 진폭이 너무 큽니다. 케이던스 170을 넘지 못하는 무거운 발걸음은 관절을 무기력하게 파괴합니다.",
                improvement: "강제를 동원해서라도 발의 체공 시간을 줄이십시오. PMC 데이터 상의 TSB(훈련 스트레스 밸런스)를 악화시키는 제1원인입니다.",
                nextTask: "케이던스 180 타겟의 피치 훈련(100m 대시 x 10회)으로 단기 신경계 각성을 이끌어내십시오.",
                insight: "과도한 힐 스트라이크로 추진력(Push-off)이 수직 제동력(Braking force)으로 전량 소모되는 비효율 상태.",
                mental: "발을 더 빨리 굴리십시오. 충격을 온전히 받아내는 미련함에서 벗어날 시간입니다."
            },
            'insight': {
                issue: "무릎을 과도하게 뻗어 오버스트라이딩을 유발, 브레이크를 걸며 달리는 최악의 생체 역학 패턴입니다.",
                improvement: "역학적 착지점은 당신의 골반 수직 아래여야 합니다. 무리한 교정보다 피로가 가장 적고 쾌적한 폼을 찾아야 합니다.",
                nextTask: "상체를 3도 기울인 상태에서 좁고 잦은 보폭(175spm)으로 3km만 집중해서 디테일을 수정해보세요.",
                insight: "스트라이드가 신장을 상회하며 무릎과 전경골근에 체중의 3배 충격하중을 지속 주입 중입니다.",
                mental: "아름다운 질주는 다리의 힘이 아니라 중력과 밸런스를 통제하는 예술입니다."
            },
            'atlas': {
                issue: "큰 보폭으로 성큼성큼 뛰면 겉보긴 시원하지만 내구성은 떨어집니다. 긴 여정에선 관절을 지키는 잰걸음이 필요해요.",
                improvement: "무릎을 살짝 굽힌 상태에서 착지하고, 무산소 능력을 길러주는 E 페이스 거리를 더 많이 확보하세요.",
                nextTask: "주 10% 룰(거리 점진적 증가)을 지키며, 다리를 총총거리며 달리는 느낌으로 5km 거리에 도전하십시오.",
                insight: "과도한 힐 스트라이크 충격이 누적되어 하체 피로(ATL) 곡성이 치솟고 있습니다. 주의 요망.",
                mental: "가장 단단한 다리는 가장 부드러운 다리로부터 자라나는 법입니다."
            },            
            'swift': {
                issue: "터벅거리는 무거운 징후! 케이던스가 느려 속도와 러닝 이코노미(Economy) 향상에 제동이 걸린 상태입니다.",
                improvement: "경쾌하게 발을 굴리는 180spm의 리듬을 타세요! 필요시 짧고 매우 빠른 R 페이스(Repetition) 무산소 훈련이 해답입니다.",
                nextTask: "가장 비트가 빠르고 신나는 음악(170~180BPM)을 들으며 30분간 드럼 박자에 지면 접촉을 일치시켜 보세요!",
                insight: "수직 진폭(Vertical Oscillation) 이상으로 달리기보단 캥거루처럼 뛰는 형태. 에너지 소모율 극대화 상태.",
                mental: "무거움을 버리고 깃털처럼 가볍게! 바람을 타는 리듬을 머릿속에 돌리세요."
            },
            'zen': {
                issue: "발걸음에 너무 많은 힘이 실려 있습니다. 바닥을 억지로 밀어내려는 의도가 관절의 긴장으로 이어지네요.",
                improvement: "지면을 스치듯이 조용하게, 숨이 거칠어지는 것을 방지하는 호흡(2-2)에 집중하며 발을 사뿐히 내려놓으세요.",
                nextTask: "다음에는 흙길이나 잔디밭에서 달려보십시오. 내면의 소리와 자연스러운 몸의 반응에 푹 빠져보세요.",
                insight: "인위적인 Push-off 텐션 과다 상태. 신경계 이완과 자연스러운 순환(Cycle) 복원이 긴급합니다.",
                mental: "흐르는 물은 돌을 부수지 않고 감싸 안고 넘어갑니다. 부드러움과 리듬감이 강함을 이깁니다."
            },
            'marathon': {
                issue: "장거리 달리기에서 큰 보폭은 치명적인 브레이크 역할을 합니다. 후반 피로도를 기하급수적으로 높입니다.",
                improvement: "마라톤의 성과는 효율에 있습니다. 케이던스를 175 부근으로 높이고 에너지를 비축하는 법을 터득하십시오.",
                nextTask: "이번 훈련에 언덕 달리기(Hill Repeats)를 추가하여 종아리가 아닌 둔근과 햄스트링을 사용하는 요령을 터득하세요.",
                insight: "러닝 이코노미 손실 확인. 하프 이상의 거리를 소화하기엔 기계적 제동 손실률이 너무 큽니다.",
                mental: "진정한 마라토너는 자신의 체력(에너지)을 한 방울도 낭비하지 않는 설계자입니다."
            },
            'wellness': {
                issue: "착지할 때마다 무거운 충격이 전해지고 있어요. 예쁜 무릎과 고관절을 보호하려면 충격 완화가 최우선이에요.",
                improvement: "달릴 때 '쿵쿵' 소리 대신 '사박사박' 소리가 나게! 그리고 꼭 운동 전후로 동적 코어 운동과 고관절 스트레칭을 해주세요.",
                nextTask: "내일은 러닝 대신 압박(Compression) 밴드를 착용하고 마사지 건(CAM 요법)으로 뭉친 다리를 충분히 이완시켜 줄까요?",
                insight: "관절 충격(Impact Load) 경고치 도달. 영양 불균형 및 수면 여부 모니터링이 병행되어야 함.",
                mental: "다치지 않고 건강하게 오래오래 달리는 것, 그것이 가장 완벽하고 아름다운 달리기랍니다."
            }
        },
        'FATIGUE_SIGNATURE': {
            'apex': {
                issue: "마지막 구간에서 체력 한계를 넘지 못하고 폼이 붕괴되었습니다. 훈련 스트레스(TSS) 누적치를 재계산 해보셨습니까?",
                improvement: "급성 피로(ATL)가 체력(CTL)을 덮친 상황입니다. 테이퍼링 주기를 무시한 채 강행군만 고집하면 붕괴는 필연적입니다.",
                nextTask: "당분간 훈련 폼(TSB) 회복을 위해 주 2회 고강도 훈련을 전면 금지하고, 저강도 회복 러닝에 몰두하십시오.",
                insight: "역학적 무너짐과 무산소 역치의 바닥을 목격했습니다. 훈련 부하 관리가 전혀 안 된 치명적 오류입니다.",
                mental: "오버트레이닝은 열정이 아니라 무지입니다. 멈춰야 할 때 멈추는 것이 과학입니다."
            },
            'insight': {
                issue: "후반부 케이던스 15% 이상 급락 및 보폭 축소. 생체역학적 협응성(Coordination)이 완전히 단절된 데이터입니다.",
                improvement: "근지구력 고갈입니다. 가장 효율적인 착지 폼을 몸에 각인시키기 전까지 거리에 대한 집착을 버리십시오.",
                nextTask: "이번 주는 러닝 거리를 줄이고 동적 코어 운동 및 편측 고관절 훈련(불균형 해소)의 비중을 20% 늘리십시오.",
                insight: "젖산 축적 및 피로 저항 능력 상실 상태. 폼 데그라데이션(Form Degradation) 경고 1단계.",
                mental: "무너진 몸의 밸런스는 감정이 아닌 철저한 역학 수정으로만 바로잡힙니다."
            },
            'atlas': {
                issue: "오버페이스가 후반의 붕괴를 초래했습니다. 훈련 강도를 지키는 10% 룰(점진적 과부하) 적용이 시급합니다.",
                improvement: "체력의 밑동, 유산소 베이스 구축 없이 달리는 페이스는 사상누각입니다. 이븐 페이스 유지를 습관화하세요.",
                nextTask: "다음 세션은 초반 세팅한 조깅(E) 페이스에서 초당 단 1초도 오버하지 않고 평탄하게 끝까지 밀어보는 훈련을 수행하세요.",
                insight: "결정적 지구력 고갈. 베이스 마일리지 구간 구축 단계 훈련을 전면 재수정 요망.",
                mental: "시작의 화려함보다 끝 맺음의 단단함을 설계하십시오. 지구력은 인내심의 크기입니다."
            },
            'swift': {
                issue: "마지막 거리에 접어들면서 리듬 파괴 현상이 감지되었습니다. 스피드를 유지할 무산소 파워가 꺼진 상태입니다.",
                improvement: "최대 산소 섭취량(VO2 Max) 향상을 위한 고강도 I 페이스(Interval) 훈련을 80:20 비율 중 20%에 정밀하게 투입하십시오.",
                nextTask: "자세를 가다듬은 채, 10초 폭발 질주와 50초 걷기의 언덕 대시(R 페이스 변형) 5세트로 엔진 코어를 깨우세요.",
                insight: "피로 누적으로 신경 신호가 지연되며 전반적인 동역학 연결 고리가 해제되었습니다.",
                mental: "폭발력은 닳아 없어지지 않습니다, 잠시 가려질 뿐! 가장 깊은 곳의 그루브를 다시 꺼내시오!"
            },
            'zen': {
                issue: "피로가 찾아오며 어깨가 굳고 호흡은 제멋대로 흔들렸습니다. 당신의 몸을 통제하고 있는 것은 당신이 아닌 고통이 되었네요.",
                improvement: "기온이나 고도 같은 외부 변수에 흔들리지 마세요. 레이스 후반의 고통은 긍정적인 자기 대화(Self-Talk)로 극복하는 법입니다.",
                nextTask: "내일은 오르막-내리막 지형에 맞춰 호흡을 가다듬으며 '난 할 수 있다'를 속으로 외치는 명상 질주를 해봅시다.",
                insight: "과호흡에 따른 멘탈/피지컬 분리 상태. 마음의 항상성이 완전히 무너져 주행이 노동으로 변질됨.",
                mental: "고통마저 당신의 일부입니다. 회피하려 하지 말고 흐르게 두면 새로운 힘이 솟아납니다."
            },
            'marathon': {
                issue: "에너지 고갈(Hitting the Wall) 직전까지 치달았습니다. 마라토너의 가장 큰 적은 몸의 연료 부족과 멘탈 이탈입니다.",
                improvement: "글리코겐 대사가 바닥입니다. 훈련 전후 탄수화물/단백질(1.2g/kg) 영양 보충과 환경 멘탈 관리가 누락되었습니다.",
                nextTask: "실전 마라톤 환경과 동일하게 기상 후 1시간 뒤 탄수화물을 섭취하고 10km 구간마다 물을 보충하는 롱런 예행연습을 하세요.",
                insight: "근육 내 저장 연료 고갈 및 전해질 밸런싱 실패 모형. 레이스 전략을 원점부터 재수립할 시점.",
                mental: "마라톤은 먹고, 마시고, 관리하는 디테일의 결정판입니다. 전략 없는 투지는 결국 무너집니다."
            },
            'wellness': {
                issue: "몸이 너무 많이 지쳐 버렸네요. 극심한 피로를 무시하고 억지로 달리기를 이어나가는 건 건강에 금물이에요.",
                improvement: "때론 과감하게 쉬어야 해요. 부상을 방지하려면 휴식의 기간을 충분히 주고 수면과 영양분(단백질 1.6g/kg) 섭취를 늘려주세요.",
                nextTask: "런닝화를 과감히 벗으세요. 오늘은 압박(Compression) 레깅스를 입고 활동적인 스트레칭(Activity)과 부드러운 폼롤링(Massage)을 하세요. CAM 요법이 정답입니다!",
                insight: "회복 탄력성(Resilience) 바닥으로 부교감 시스템 오작동 위험성 한계선. (RICE 대신 CAM 기반의 즉시 회복 조치 요망)",
                mental: "때로는 달리지 않고 쉬어주는 용기가 가장 강한 러너의 무기랍니다. 오늘은 꿀잠 주무세요!"
            }
        },
        'EFFICIENT': {
            'apex': {
                issue: "VDOT 시스템 기준 상위 체력(CTL) 레벨 진입 성공. 현재의 편안한 기초 단계(Base Stage)에 너무 익숙해진 것이 유일한 약점입니다.",
                improvement: "강화 단계(Build Stage)로 체계적인 주기화 훈련을 진행하십시오. VDOT 차트 상의 M, T, I 페이스 테이블을 새롭게 산정해야 합니다.",
                nextTask: "심장의 펌핑 볼륨을 극대화할 T 페이스(최대 심박 88-92%) 템포런 세션을 통해 젖산 역치의 한계선을 밀어 올리십시오.",
                insight: "VO2 Max 효율성 최고치 기록. 더 무거운 엔진 스트레스(TSS)를 견딜 수 있는 생리학적 완비 상태입니다.",
                mental: "이 완벽함을 무기로 고통의 심연으로 다이빙하십시오. 더 높은 VDOT은 오직 강도 위에서만 열립니다."
            },
            'insight': {
                issue: "역학적 오차 제로. 분당 180의 이상적인 케이던스와 호흡, 미드풋 착지가 완벽하게 동기화되어 에너지가 온존합니다.",
                improvement: "현재의 폼 데그라데이션 방어력을 극한의 상황에서도 유지하는지 검증해야 합니다. 이 유려한 자세를 고속에서도 실험하세요.",
                nextTask: "훈련 종료 직후 가속 스트라이드(R 페이스, 100m x 4회)를 배치해 피로 상태에서도 지면 접촉 시간을 통제하는 훈련을 하세요.",
                insight: "인체역학과 2:2 리듬 호흡의 결합으로 최상의 Running Economy 실현. 데이터를 저장하고 모방 대상으로 삼으십시오.",
                mental: "아름다운 수학 공식과 같은 질주입니다. 완벽한 폼이야말로 가장 빠른 연료입니다."
            },
            'atlas': {
                issue: "튼튼한 다리와 강한 심장 기능. 80:20 법칙의 정석대로 조깅 레벨 훈련을 성실히 수행해 베이스 공사가 단단히 끝났습니다.",
                improvement: "지금의 지반 위에 20%의 무산소 기둥을 세울 인프라가 갖춰졌습니다. 강도를 변주해 마일리지를 더 가벼운 짐으로 만드세요.",
                nextTask: "이번 주말 장거리 훈련의 마지막 3km 구간에서는 레이스 목표 속도로 확연히 페이스업 하는 '음수 스플릿' 주행을 시도하십시오.",
                insight: "모세혈관 및 미토콘드리아 초과 조밀 구역 달성. 이제 지구력(Endurance)이 아닌 스피드 체력(Stamina)이 요구됩니다.",
                mental: "가장 거대한 스태미나는 가장 지루한 조깅 속에서 잉태됩니다. 당신의 시간이 보상받았습니다."
            },            
            'swift': {
                issue: "브라보! 도로 위를 활강하는 캥거루 같습니다. 무산소 능력과 러닝 이코노미가 만나 최고의 스피드 웨이브를 만들었군요!",
                improvement: "경쾌한 폭발력의 범위를 확장하세요! 짧고 폭발적인 I 페이스(Interval)만으로 부족하다면, R 페이스(Repetition)로 이코노미를 더 올립시다.",
                nextTask: "400m 타겟 기록을 설정하고 전력 질주 후 충분히 휴식하는 R 페이스 반복 훈련에 돌입해 그루브의 한계를 측정해 보세요.",
                insight: "최소 산소 요구량(SubMax VO2)의 최하점 진입. 근섬유 수축/이완의 반응 속도가 단거리 스프린터의 모델과 흡사함.",
                mental: "자유로운 바람이 되십시오. 누구도 당신의 쾌속을 묶어둘 수 없습니다."
            },
            'zen': {
                issue: "숨결은 부드럽고 호흡의 깊이(2:2)가 완벽합니다. 마음과 육체가 부교감신경의 통제 아래 평화롭게 전진했군요.",
                improvement: "가장 뛰어난 러너는 외부 환경에 흔들리지 않습니다. 비가 오나, 언덕이 나타나나 이 호흡과 평정심을 꺼내 쓸 수 있어야 합니다.",
                nextTask: "다음 러닝에선 헤드폰과 워치의 알림을 끄고, 심장의 두근거림 자체에만 모든 감각을 집중시키는 마음챙김 모드를 실행하세요.",
                insight: "교감/부교감 자극 밸런스의 완벽한 대수학적 동기화. 코르티솔 저하 및 러너스 하이(Runner's High) 만끽 상태.",
                mental: "당신이 대지 위를 흐르는 물결 자체입니다. 거칠 것이 아무것도 없습니다."
            },
            'marathon': {
                issue: "레이스에 진입하기 위한 최적의 PMC 지표인 TSB(폼) 플러스가 예상됩니다. 완벽한 레이스 페이스 메이킹을 하셨습니다.",
                improvement: "장거리 레이스의 긍정적 예열이 완료되었습니다. 이제 체력을 빼지 않고 끌어올리는 극도로 세심한 테이퍼링 단계를 맞이하세요.",
                nextTask: "대회를 가상하고, 하루 전 수면부터 출발 전 탄수화물/에너지 젤 급수 계획까지 포함된 마라톤 시뮬레이션 질주를 완성하십시오.",
                insight: "VDOT 체계 기반 실레이스 예상 기록 산출 완료. 주행 역학 손실도 최하치 보존. 전략적 뉴트리션 단계만 통과하면 서브N 달성 가능.",
                mental: "데이터와 체력이 만났습니다. 그랜드 파이널의 테이프를 끊을 차례입니다."
            },
            'wellness': {
                issue: "건강한 땀, 아름다운 호흡! 운동과 일상의 피로 스트레스가 항상성을 되찾아가는 눈부신 성장 과정이었네요.",
                improvement: "훌륭한 폼에서 나오는 달리기는 어떠한 약보다도 강한 도파민과 면역을 선사합니다. 이 건강한 엔진을 마음껏 칭찬해주세요.",
                nextTask: "내일 가볍고 경쾌한 리커버리 산책 또는 편측 고관절 스트레칭을 즐기면서 달리기의 아름다움을 주변 사람들과 함께 만끽하세요.",
                insight: "면역력 증강, 항염 유도 및 부상 위험 제로 지점 통과. 심혈관 안정화 수치(Homeostasis Check) 최고 등급 달성.",
                mental: "당신의 맑고 찬란한 런닝 라이프가 어제보다 빛나는 당신을 약속합니다."
            }
        },
        'INITIAL_CONSULT': {
            'wellness': {
                issue: "첫 걸음이 가장 중요합니다.",
                improvement: "천천히 가도를 높여보세요.",
                nextTask: "가벼운 산책으로 시작하세요.",
                insight: "초기 적응 기간입니다.",
                mental: "함께 뛰어봐요."
            }
        },
        'UNKNOWN': {
            'apex': {
                issue: "아직 달리기 기록의 방향성을 확립하기엔 데이터가 부족합니다.",
                improvement: "다음 번에는 당신의 페이스와 기록을 꼼꼼하게 입력해 보십시오. 더 나은 분석이 가능합니다.",
                nextTask: "가벼운 웜업으로 시작해서 본인의 페이스를 파악하는 세션을 가져보십시오.",
                insight: "입력된 기록만으로도 훈련의 첫 걸음은 시작되었습니다.",
                mental: "측정할 수 없는 것은 개선할 수 없습니다. 멈추지 말고 기록하십시오."
            },
            'insight': {
                issue: "입력된 정보만으로는 명확한 역학 패턴을 분석하기 어렵습니다.",
                improvement: "거리와 시간 등 가장 기본적인 정보들을 통해 당신만의 러닝 빅데이터를 채워나가세요.",
                nextTask: "다음 러닝에서는 일정한 페이스로 2km 이상의 거리를 목표로 달려보십시오.",
                insight: "더 많은 달리기 기록이 축적될수록 AI 모델의 분석 정확도도 높아집니다.",
                mental: "위대한 결과는 꾸준히 입력되는 작은 데이터의 누적에서 시작됩니다."
            },
            'atlas': {
                issue: "달리셨지만 흔적이 아직 옅습니다. 구체적인 기록이 쌓여야 알맞은 길을 닦아드릴 수 있습니다.",
                improvement: "우리의 여정은 길고 넓습니다. 당장 완벽한 기록이 없다고 무리할 필요는 없습니다.",
                nextTask: "다음 러닝 전에는 마음을 편하게 먹고 첫 번째 기록을 넉넉하게 확보해 보세요.",
                insight: "기초적인 거리와 시간만 기록해도 충분합니다. 중요한 건 멈추지 않는 것입니다.",
                mental: "흔들리지 않는 탑은 아주 작은 기록들을 모아 쌓아 올리는 데서 온다는 것을 잊지 마십시오."
            },
            'swift': {
                issue: "입력된 정보가 적어 당신의 경쾌한 리듬을 완벽히 분석하지 못했어요!",
                improvement: "거리와 시간을 꼬박꼬박 입력해주시면 더 신나는 피드백을 드릴 수 있답니다.",
                nextTask: "가장 신나는 노래를 하나 틀어두고, 그 리듬에 맞춰 짧고 선명한 2km 세션을 남겨주세요.",
                insight: "더 많은 기록이 입력되면 가장 완벽한 템포를 찾아드릴 수 있습니다.",
                mental: "음소거 모드를 해제하고 볼륨을 최대로! 당신의 뜨거운 플레이를 계속 기록해주세요."
            },
            'zen': {
                issue: "숫자나 기록에 얽매이지 않고 바람만을 느낀 런이었군요. 이 또한 당신의 훌륭한 흔적입니다.",
                improvement: "마음의 평화도 중요하지만, 당신 몸이 지나온 길을 거리와 시간으로 조금씩 남겨볼까요?",
                nextTask: "데이터 압박감을 내려놓되, 달린 거리와 시간을 가볍게 적어 당신만의 러닝 노트를 만들어가 보세요.",
                insight: "당신이 얻은 맑은 정신적 카타르시스를 최우선으로 지지합니다.",
                mental: "가끔은 얽매이지 않고 달리는 것이 수많은 숫자들보다 깊고 진실될 때가 있습니다."
            },            
            'marathon': {
                issue: "긴 코스를 설계하기 위해서는 거리와 페이스에 대한 꾸준한 기록이 필요합니다.",
                improvement: "장거리 훈련의 시작은 당신이 달려온 발자취를 온전히 기록하는 것부터 시작됩니다.",
                nextTask: "다음번 운동부터는 달린 거리와 시간을 꼭 입력해서 42.195km 설계를 위한 랩타임을 만들어 보죠.",
                insight: "입력된 기록은 다음 레이스의 나침반이 됩니다.",
                mental: "기록의 누락은 단순한 실수가 아니라 훈련 부족과 같습니다. 준비부터 꼼꼼히 합시다."
            },
            'wellness': {
                issue: "당신의 소중한 땀방울을 안아주고 싶은데, 아직 달린 흔적이 조금 부족해요.",
                improvement: "정확한 척하지 않아도 괜찮아요! 편안하게 달린 거리와 시간만이라도 적어주실래요?",
                nextTask: "내일도 부담스럽지 않은 거리에서 기분 좋게 뛰고 기록해 보세요. 작은 데이터가 차곡차곡 쌓이면 우리 대화는 더 풍성해질 거예요.",
                insight: "당신의 노력 자체를 긍정합니다. 천천히 기록하는 습관을 들이세요.",
                mental: "당신이 집 밖으로 고개를 내밀어 나섰다는 사실 자체 하나로 이미 훌륭해요."
            }
        }
    };

    const profilePrescriptions = prescriptions[profile] || prescriptions['UNKNOWN'];
    const baseAdvice = profilePrescriptions[coachId] || profilePrescriptions['wellness'] || profilePrescriptions['insight'];

    let { issue, improvement, nextTask, insight, mental } = baseAdvice;

    // 동적 데이터(stats) 연동 로직
    if (stats) {
        const { heartRate, cadence, weight } = stats;
        
        // 1. 과체중(80kg 이상) + 낮은 케이던스(165 미만) 경고 (수직 충격)
        if (weight && weight >= 80 && cadence && cadence < 165) {
            if (coachId === 'insight' || coachId === 'apex') {
                issue += ` 특히 현재 입력된 체중(${weight}kg)이 실린 상태에서 케이던스(${cadence}spm)가 낮아 무릎에 가해지는 수직 충격이 평소의 3배에 달합니다.`;
            } else if (coachId === 'wellness' || coachId === 'atlas') {
                improvement += ` 체중(${weight}kg)을 고려할 때, 케이던스(${cadence}spm)를 높여야 관절 건강을 지킬 수 있어요.`;
            }
        }

        // 2. 심박수가 매우 높을 때 (170 초과)
        if (heartRate && heartRate > 170) {
            if (coachId === 'apex') {
                insight += ` 현재 심박수(${heartRate}bpm)는 무산소 한계점(Zone 4-5)에 도달해 있습니다. 강도를 즉각 낮춰야 합니다.`;
            } else if (coachId === 'atlas') {
                issue += ` 심박수(${heartRate}bpm)가 너무 높습니다. 80:20 법칙의 80% 조깅 영역을 완전히 벗어났습니다.`;
            } else if (coachId === 'zen') {
                improvement += ` 요동치는 심박수(${heartRate}bpm)를 가라앉히기 위해 호흡에 집중하세요.`;
            }
        }
        
        // 3. 심박수가 낮고 케이던스가 높을 때 (가장 효율적)
        if (heartRate && heartRate > 0 && heartRate < 150 && cadence && cadence >= 170) {
            if (coachId === 'insight' || coachId === 'swift' || coachId === 'marathon') {
                insight = `현재 케이던스(${cadence}spm)와 심박수(${heartRate}bpm)의 조화가 이상적입니다. 완벽한 지면 반발력과 에너지 효율을 보여주고 있습니다.`;
            }
        }
    }

    return { issue, improvement, nextTask, insight, mental };
};

/**
 * BMI 계산 및 범주 분류
 */
export const calculateBMI = (weight: number, height: number): { value: number; category: 'LOW' | 'NORMAL' | 'OVER' | 'OBESE' } => {
    if (!weight || !height || height <= 0) return { value: 0, category: 'NORMAL' };
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    
    let category: 'LOW' | 'NORMAL' | 'OVER' | 'OBESE' = 'NORMAL';
    if (bmi < 18.5) category = 'LOW';
    else if (bmi < 25) category = 'NORMAL';
    else if (bmi < 30) category = 'OVER';
    else category = 'OBESE';
    
    return { value: bmi, category };
};

/**
 * v26.6: 구간 기록(Splits) 정밀 분석 유틸리티
 */
export const analyzeSplits = (splits: string[]) => {
    if (!splits || splits.length === 0) return null;
    
    const secondsArray = splits.map(s => parseTimeToSeconds(s));
    const fastestSec = Math.min(...secondsArray);
    const slowestSec = Math.max(...secondsArray);
    const fastestIdx = secondsArray.indexOf(fastestSec);
    const slowestIdx = secondsArray.indexOf(slowestSec);
    
    // 페이스 변화 추이 (후반부 페이스 저하 여부)
    const firstHalf = secondsArray.slice(0, Math.ceil(secondsArray.length / 2));
    const secondHalf = secondsArray.slice(Math.ceil(secondsArray.length / 2));
    const isFading = secondHalf.length > 0 && 
        (secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length) > 
        (firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length) + 10;
        
    return {
        fastestKM: fastestIdx + 1,
        fastestPace: splits[fastestIdx],
        slowestKM: slowestIdx + 1,
        slowestPace: splits[slowestIdx],
        isFading
    };
};

/**
 * 기록이 없는 신규 사용자를 위한 초기 진단 컨설팅 시나리오
 */
export const getInitialConsultation = (weight: number, height: number, coachId: string): InitialConsultation => {
    const { value: bmi, category } = calculateBMI(weight, height);
    
    const scenarios: Record<string, any> = {
        'OBESE': {
            issue: "과체중 상태에서의 무리한 달리기는 무릎에 체중의 5배에 달하는 파괴적 수직 충격을 가합니다.",
            improvement: "점진적 과부하 규칙(10% 룰)의 대상을 속도가 아닌 '시간'으로 설정하세요. 지방 대사를 활성화하는 걷기가 첫걸음입니다.",
            nextTask: "내일 첫 세션은 30분간 목표 페이스 없는 '가벼운 걷기'로 관절과 인대 주변의 근신경을 예열하십시오.",
            insight: "체중 부하 하이-리스크 그룹. 과부하시 족저근막 및 연골 손상률 40% 이상 상승 위험.",
            mental: "러너라는 타이틀은 속도가 아니라 포기하지 않고 문 밖을 나서는 성실함에서 비롯됩니다."
        },
        'OVER': {
            issue: "관절에 미묘한 압박이 느껴지는 약간의 로드(Load) 상태입니다. 심혈관 엔진의 예열이 우선 필요합니다.",
            improvement: "달리기의 80%는 대화가 가능한 편단한 강도(말하기 테스트 통과)여야 합니다. 조깅 강도로 부하 내성을 기르세요.",
            nextTask: "20분간 E 페이스(가장 쾌적하고 느린 조깅)로 달려보고 숨이 너무 차면 즉시 걷기로 전환하세요.",
            insight: "심혈관 펌핑 시스템 개조기(Base phase). 근력 저항성 확보가 무산소 훈련보다 시급합니다.",
            mental: "조급함은 부상의 가장 가까운 친구입니다. 가벼워진 몸이 결국 페이스를 약속할 것입니다."
        },
        'NORMAL': {
            issue: "매우 표준적인 신체 밸런스입니다. VO2 Max(최대산소섭취량)의 기초 토대를 올바른 역학으로 채울 가장 완벽한 캔버스네요.",
            improvement: "다리를 쭉 뻗지 말고(오버스트라이딩 금지) 몸의 중심 바로 아래로 발이 사뿐히 떨어지는 미드풋 착지에 집중하세요.",
            nextTask: "케이던스 160 언저리의 리듬을 느끼며 '내가 얼마나 편안한가'를 자가 진단해보는 15분 주행을 실시하세요.",
            insight: "생체역학적 교정이 가장 즉각적으로 반영되는 황금 밸런스. VDOT 상승 잠재력 높음.",
            mental: "도로 위에서 가장 자유로운 심장이 되기 위한 완벽한 출발선에 섰습니다."
        },
        'LOW': {
            issue: "가벼운 반면 주행 과정의 착지 충격(역학적 스트레스)을 흡수해 줄 근섬유 댐퍼(Damper) 기능이 다소 부실할 수 있습니다.",
            improvement: "단순한 달리기 마일리지 누적보다 기구/맨몸을 활용한 하체 근력 향상(동적 코어 및 고관절 강화) 접근이 병행되어야 합니다.",
            nextTask: "짧고 가벼운 10분 웜업 조깅을 마치고, 양다리의 밸런스를 맞추는 런지와 스쿼트를 필수 보강으로 실시하십시오.",
            insight: "골밀도 지수 하위 가능성. 수면과 충분한 단백질(1.2g/kg) 섭취 등 적극적 영양/회복 조치가 필요함.",
            mental: "진정한 스프린터는 깃털처럼 가볍지만 파인애플 껍질처럼 단단한 근육의 소유자입니다."
        }
    };

    const baseAdvice = scenarios[category] || scenarios['NORMAL'];
    
    // 코치별 성향에 따른 톤앤매너 조정 (간략화)
    let coachSpecific = { ...baseAdvice };
    if (coachId === 'apex') {
        coachSpecific.issue = "전투 준비가 덜 된 신체 조건입니다. " + baseAdvice.issue;
        coachSpecific.mental = "고통을 인내하고 시스템을 구축하십시오. 타협은 패배입니다.";
    } else if (coachId === 'wellness') {
        coachSpecific.issue = "우리 몸을 사랑하는 마음으로 시작해 볼까요? " + baseAdvice.issue;
        coachSpecific.mental = "오늘의 당신을 응원해요. 기분 좋은 땀방울을 기대할게요.";
    }

    return {
        bmi,
        bmiCategory: category,
        advice: coachSpecific
    };
};

/**
 * 기록 데이터를 바탕으로 선택된 코치의 맞춤 조언 메시지를 생성합니다.
 */
export const getCoachAdvice = (record: any, coach: Coach): string => {
    if (!record) return '기 기록 데이터를 기다리고 있습니다. ✨';
    const { temp, condition, isImproved, distance, weight } = record;

    // 1. 특수 상황 (기온)
    if (temp !== undefined) {
        if (temp >= 30) {
            switch (coach.tendency) {
                case 'hard': return `폭염(${temp}°C) 속의 질주는 세포를 강하게 단련시키지만, 과열은 금물입니다. 수분 보충을 최우선으로 하세요! 🔥`;
                case 'mental': return `이런 더위에 ${distance}km라니, 런너님의 환경 적응력이 놀랍습니다. 충분한 냉각과 전해질 섭취를 권장해요. 🌿`;
                case 'intel': return `체온 상승으로 대사 효율이 급감하는 온도입니다. 심박수 부하가 커졌으니 종료 후 반드시 쿨다운을 하세요. 🐟`;
                default: return `폭염 속 완주를 축하합니다! ${temp}°C의 열기보다 런너님의 의지가 더 뜨겁네요. ✨`;
            }
        }
        if (temp <= 0) {
            switch (coach.tendency) {
                case 'hard': return `영하의 날씨는 근육 수축을 유발합니다. 고강도 인터벌 전 충분한 워밍업이 없었다면 부상을 조심하세요! ❄️`;
                case 'calm': return `차가운 공기를 깊게 들이마시며 자율신경계를 정화하는 시간이 되었겠군요. 체온 유지에 신경 써주세요. 🧘`;
                default: return `혹한기를 뚫고 질주하신 런너님, 정말 대단합니다! 따뜻한 차로 몸을 녹여주세요. ❄️🫡`;
            }
        }
    }

    // 2. 컨디션 난조 상황
    if (condition === 'bad') {
        switch (coach.tendency) {
            case 'mental': return `몸의 신호가 좋지 않았음에도 끝까지 완주하셨네요. 오늘은 성취감보다 회복에 100% 집중할 때입니다. 🌿`;
            case 'hard': return `최악의 컨디션에서 거둔 질주는 정신적 임계치를 높여줍니다. 하지만 내일은 완전 휴식을 명합니다! 🦾`;
            default: return `컨디션이 안 좋으셨을 텐데 고생 많으셨습니다. 기록보다 오늘을 버텨낸 런너님의 끈기에 박수를 보냅니다! 👏`;
        }
    }

    // 3. 기록 향상 성공
    if (isImproved) {
        switch (coach.tendency) {
            case 'intel': return `분석 결과, 역학적 밸런스가 매우 훌륭했습니다. ${weight}kg의 신체 데이터를 가장 효율적으로 활용한 질주였어요! 🐟`;
            case 'pacer': return `미드풋 착지의 탄성을 아주 영리하게 사용하셨군요. 페이스 안정감이 돋보이는 구간이었습니다. 🏃‍♂️`;
            case 'vibe': return `오늘 리듬감은 최고였습니다! 팔 스윙과 보폭이 음악처럼 맞아떨어지는 쾌속 질주였네요! ⚡`;
            default: return `기록 단축을 진심으로 축하합니다! 런너님의 노력이 데이터로 증명되는 순간입니다. 🏆`;
        }
    }

    // 4. 런싱크 4.0 알고리즘 정밀 진단 및 처방 (v4.0 신규)
    const profile = diagnoseRunnerProfile(record);
    const hr = record.heart_rate;
    const cad = record.cadence;

    // 프로파일별 공통 처방
    if (profile === 'AEROBIC_SIEVE') {
        switch (coach.tendency) {
            case 'intel': return `[런싱크 진단: 유산소 누수형] 엔진이 무산소 대사에 의존하고 있습니다. 최대 심박수의 60-70%인 Zone 2 영역에 80% 이상의 훈련을 집중하여 유산소 엔진을 재건해야 합니다. 🐟`;
            case 'mental': return `[회복 솔루션] 심박수가 페이스 대비 높습니다. 3:2 복식 호흡(3보 흡기, 2보 호기) 리듬을 적용하여 산소 효율을 높이고 심박을 안정시키세요. 🌿`;
        }
    }

    if (profile === 'MECHANICAL_BRAKE') {
        switch (coach.tendency) {
            case 'hard': return `[런싱크 진단: 기계적 브레이크형] 낮은 케이던스로 보폭을 넓게 가져가며 관절이 충격을 흡수하고 있습니다. 케이던스를 현재보다 5-10% 점진적으로 높여 부상 위험을 줄이세요! 🦾`;
            case 'pacer': return `[역학적 교정] 오버스트라이딩 징후가 보입니다. 보폭을 줄이고 발이 몸무게 중심 바로 아래에 떨어지도록 리듬을 수정하세요. 둔근 활성화 운동이 필수적입니다. 🏃‍♂️`;
        }
    }

    if (profile === 'FATIGUE_SIGNATURE') {
        return `[런싱크 진단: 후반 붕괴형] 질주 후반부에 폼이 무너지는 경향이 있습니다. 코어 보강 운동과 함께 LSD(장거리 저강도) 훈련으로 기초 체력의 임계치를 높여야 합니다. 🏛️`;
    }

    if (profile === 'EFFICIENT') {
        return `[런싱크 진단: 효율적 엔진형] 심박 제어와 케이던스 리듬(${cad}spm)이 매우 이상적입니다. 현재의 경제적 주행 메커니즘을 장거리에서도 유지할 수 있도록 에너지 젤 섭취 전략을 병행하세요. 🏆`;
    }

    // 5. 심박수 및 케이던스 개별 분석 (보조 데이터)
    if (hr || cad) {
        if (hr && hr > 175) {
            return `심박수 ${hr}bpm은 임계점에 가깝습니다. 유산소 디커플링 현상을 방지하기 위해 강도를 낮추고 수분을 즉시 보충하세요. ⚠️`;
        }
        if (cad && cad < 160) {
            return `현재 케이던스 ${cad}spm은 수직 충격 부하를 가중시킵니다. 보폭을 줄이고 회전수(spm)를 높여 에너지 효율을 개선하세요. ⚡`;
        }
        if (cad && cad >= 175 && cad <= 185) {
            return `환상적인 케이던스(${cad}spm)입니다! 가장 경제적이고 효율적인 리듬을 찾으셨네요. 🏆`;
        }
    }

    // 5. 일반적인 조언 (데이터 기반 전문가 피드백) - v26.6 수치 주입 강화 💉
    const splitReport = record.splits ? analyzeSplits(record.splits) : null;
    const splitText = splitReport ? ` 가장 빨랐던 구간은 ${splitReport.fastestKM}km(${splitReport.fastestPace})였고, ` : '';
    const hrVal = hr || record.heart_rate || 'N/A';
    const cadVal = cad || record.cadence || 'N/A';

    const coachAdvice: Record<string, string> = {
        apex: `[고강도 처방] ${splitText}심박수 ${hrVal}bpm 분석 결과, 현재 단계에서 임계치를 높이려면 주간 마일리지의 20%는 최대 심박수 90% 이상의 인터벌이 필수입니다. 🔥`,
        insight: `[생체역학 분석] 케이던스 ${cadVal}spm과 ${weight}kg의 부하 이동을 교차 분석했습니다.${splitText} 지면 접촉 시간을 5% 더 줄여 대사 효율을 극대화하십시오. 🐟`,
        wellness: `[회복 및 예방] 심박수 ${hrVal}bpm을 통해 본 생체 리듬이 안정적입니다.${splitText} 근육 미세 파열 회복을 위해 수면과 영양 밸런스에 집중하세요. 🌿`,
        zen: `[신경계 리셋] 자율신경계가 ${hrVal}bpm 부근에서 안정되었습니다. 기록에 매몰되지 않고 ${cadVal}spm의 리듬을 느낀 것이 오늘의 명상적 성과입니다. 🧘`,
        atlas: `[기초 지구력] ${cadVal}spm의 일정한 리듬으로 유산소 베이스를 단단히 다지셨군요.${splitText} 지금의 조깅 강도가 당신의 엔진 크기를 키웁니다. 🏛️`,
        swift: `[신경-근육 동기화] 현재 케이던스(${cadVal}spm)와 리드미컬한 팔 스윙이 이상적입니다.${splitText} 피로 상태에서도 이 폼을 유지하는 훈련을 추가하세요. ⚡`,
        marathon: `[마라톤 전략] ${splitText}케이던스(${cadVal}spm) 리듬과 심박수(${hrVal}bpm) 관리가 최적의 레이스 페이싱을 보여줍니다. 완주를 향한 완벽한 튜닝입니다. 🏃‍♂️`
    };

    let finalMessage = coachAdvice[coach.id] || `${distance}km 질주 완료. 심박(${hrVal})/케이던스(${cadVal})를 기반으로 분석을 마쳤습니다. ✨`;
    
    // 후반 페이스 저하 탐지 시 추가 조언
    if (splitReport?.isFading) {
        finalMessage += ` 구반부에 페이스가 처지는 현상이 감지되었습니다. 후반 근지구력 보강이 필요해 보이네요! ⚠️`;
    }

    return finalMessage;
};

/**
 * 7인의 코치 중 한 명을 랜덤으로 선정합니다.
 */
export const getRandomCoach = (): Coach => {
    const randomIndex = Math.floor(Math.random() * coaches.length);
    return coaches[randomIndex];
};

/**
 * 러닝 퍼포먼스 향상을 위한 7대 전문 팁 데이터셋 (Coach System Manual 반영)
 */
export const runningTips = [
    { title: "VDOT과 최적 훈련 페이스", content: "최근 기록을 통해 현재 체력 수준(VDOT)을 평가하고 조깅(E), 마라톤(M), 역치(T), 인터벌(I) 등 목적이 뚜렷한 정확한 페이스로 훈련하세요." },
    { title: "80:20의 법칙 (Polarized Training)", content: "효율성 및 부상 방지를 위해 전체 훈련 시간의 80%는 말하기가 편안한 저강도로, 20%는 고강도 인터벌 등으로 강약을 극적으로 나누십시오." },
    { title: "올바른 리듬과 2:2 호흡법", content: "두 발자국에 들이마시고 두 발자국에 내뱉는 호흡법은 이산화탄소 축적을 막고 숨이 거칠어지는 것을 방지하여 젖산 역치 도달을 늦춥니다." },
    { title: "케이던스 170~180의 효과", content: "케이던스(발구름 수)를 높이면 종종걸음이 되어 지면 접촉 시간과 수직 충격이 줄어들어 무릎과 고관절 부상 위험을 현격히 낮춥니다." },
    { title: "10% 룰과 훈련 스트레스", content: "훈련 부하(강도x시간)는 한 주에 10% 이상 늘리지 마십시오. 급성 스트레스(ATL)가 체력(CTL)을 넘어설 때 부상과 번아웃이 발생합니다." },
    { title: "회복 패러다임: CAM 요법", content: "과거의 단순 휴식(RICE)보다 압박, 능동적 활동(가벼운 혈류 순환), 마사지를 결합한 CAM 요법이 근육의 항상성과 빠른 재생산에 효과적입니다." },
    { title: "마라토너의 실전 영양 전략", content: "장거리 레이스의 핵심은 글리코겐 고갈 지연입니다. 10km 구간마다 에너지 젤을 보충하고 평소 1.2~1.6g/kg의 단백질 섭취로 근손실을 막으세요." }
];

export const getRandomRunningTip = () => {
    const randomIndex = Math.floor(Math.random() * runningTips.length);
    return runningTips[randomIndex];
};
