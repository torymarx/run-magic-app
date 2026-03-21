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

/**
 * 런싱크 4.0 알고리즘 기반 러너 프로파일 진단
 */
export const diagnoseRunnerProfile = (record: any): RunnerProfile => {
    if (!record) return 'UNKNOWN';
    
    const hr = record.heart_rate || record.hr;
    const cad = record.cadence || record.cad;
    const weight = record.weight;
    
    // pace_seconds가 없으면 pace 스트링을 파싱하여 시도
    let pace = record.pace_seconds;
    if (!pace && record.pace) {
        if (typeof record.pace === 'number') {
            pace = record.pace;
        } else if (typeof record.pace === 'string') {
            pace = parseTimeToSeconds(record.pace);
        }
    }
    
    if (!hr || !cad || !pace) return 'UNKNOWN';

    // 1. 기계적 브레이크형 (Mechanical Brake): 페이스는 준수하나 케이던스가 지나치게 낮은 유형
    // 페이스가 6분 미만(360초)이면서 케이던스가 160 미만인 경우
    if (pace < 360 && cad < 160) return 'MECHANICAL_BRAKE';

    // 2. 유산소 누수형 (Aerobic Sieve): 몸무게에 비해 페이스는 낮지만 심박수가 높은 유형
    // 체중이 80kg 이상이면서 페이스는 느린데(7분+) 심박이 높은 경우 더 강력하게 의심
    if (pace > 420 && hr > 155) {
        if (weight && weight > 80) return 'AEROBIC_SIEVE';
        if (hr > 165) return 'AEROBIC_SIEVE';
    }

    // 3. 후반 붕괴형 (Fatigue Signature) 
    // 실제로는 시계열 데이터가 필요하나, 여기서는 '상태가 나쁨'인데 기록이 중간 정도인 경우로 간주 (단순화)
    if (record.condition === 'bad' && pace > 360 && hr > 165) return 'FATIGUE_SIGNATURE';

    // 4. 효율적 러너 (Efficient)
    if (cad >= 170 && hr <= 150) return 'EFFICIENT';

    return 'UNKNOWN';
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
export const getDetailedPrescription = (profile: RunnerProfile, coachId: string) => {
    const prescriptions: Record<RunnerProfile, Record<string, { issue: string; improvement: string; nextTask: string; insight: string; mental: string; }>> = {
        'AEROBIC_SIEVE': {
            'apex': {
                issue: "엔진 배기량이 부족하여 심박 제어에 실패하고 있습니다. 에너지를 도로에 뿌리고 다니는 셈입니다.",
                improvement: "호흡이 터질 때까지 밀어붙이는 게 정답이 아닙니다. 낮은 심박에서 견디는 인내심부터 기르세요.",
                nextTask: "내일은 페이스 7분 밑으로 절대 내려가지 말고, 60분간 심장을 길들이는 인내의 질주를 하세요.",
                insight: "유산소 대사 구간에서의 심박수 변동성이 15%를 초과했습니다. 고장난 엔진으로 과속하는 형태입니다.",
                mental: "승리는 흔들리지 않는 심박수에서 시작됩니다. 고통보다 인내를 배우십시오."
            },
            'insight': {
                issue: "유산소 대사 효율이 낮아 젖산 역치에 너무 빨리 도달합니다. 에너지 효율성이 저하된 상태입니다.",
                improvement: "미토콘드리아 밀도를 높이기 위해 최대 심박수의 65% 영역에서 운동 경제성을 확보해야 합니다.",
                nextTask: "Zone 2 영역에 데이터 비중 90%를 할당하는 저강도 지속주 분석 세션을 권장합니다.",
                insight: "호기성 에너지 대사 비율이 40% 미만으로 떨어지는 임계점이 너무 빨리 도래합니다. 기초 베이스 공사가 시급합니다.",
                mental: "데이터는 거짓말을 하지 않습니다. 철저한 분석만이 다음 단계로 가는 유일한 열쇠입니다."
            },
            'atlas': {
                issue: "스포츠 심장으로 가는 기초 마일리지가 부족합니다. 페이스를 올릴 준비가 덜 된 상태입니다.",
                improvement: "서두르지 마세요. 우리 몸의 혈관과 미토콘드리아는 낮은 심박에서 가장 크고 튼튼하게 자라납니다.",
                nextTask: "기록과 속도를 끄고, 심박수가 안정적으로 유지되는 선에서 40분 이상 가볍게 뛰어보세요.",
                insight: "심혈관 시스템의 내구성이 주행 부하를 감당하지 못하고 있습니다. 베이스 빌딩(Base Building) 기간이 필요합니다.",
                mental: "가장 위대한 건축물은 가장 깊고 넓은 기초 위에서 완성됩니다."
            },
            'swift': {
                issue: "심박이 오르면서 발걸음 리듬이 엉키고 있습니다. 페이스보다 중요한 리듬감을 잃어버렸네요!",
                improvement: "호흡 1번에 발걸음 2번! (1:2 리듬) 가벼운 템포에 맞춰 호흡과 스텝을 완벽하게 동기화하세요.",
                nextTask: "내일은 가장 좋아하는 음악의 비트(160BPM)에 맞춰 심박을 통제하며 30분간 템포런을 해보세요.",
                insight: "과호흡으로 인해 신체 리듬과 운동 에너지 파동(Wave)이 불일치 현상을 일으키고 있습니다.",
                mental: "당신의 몸은 훌륭한 악기입니다. 오늘은 그 현을 너무 팽팽하게 당겼네요."
            },
            'zen': {
                issue: "숨소리가 거칠고 맥박이 날카롭습니다. 몸 안의 평화가 깨진 채 억지로 앞으로 나아가고 계시군요.",
                improvement: "코로 깊게 들이마시고 입으로 길게 내뱉으세요. 호흡이 차분해지면 심장도 평온을 되찾습니다.",
                nextTask: "다음 러닝은 '달리기명상'입니다. 속도를 잊고 들숨과 날숨이 몸을 채웠다 비우는 감각에만 집중하세요.",
                insight: "교감신경이 과항진된 상태입니다. 호흡의 길이를 늘려 부교감신경을 활성화해야 합니다.",
                mental: "바람막이 안의 고요함을 찾으세요. 진정한 질주는 내면의 평화에서 비롯됩니다."
            },
            'marathon': {
                issue: "장거리를 버티기엔 유산소 베이스가 아쉽습니다. 풀코스의 벽을 넘으려면 심장부터 더 크고 강하게 만드셔야 합니다.",
                improvement: "마라톤은 '천천히 달릴 줄 아는 용기'에서 시작됩니다. 조급함을 버리고 완전히 편안한 페이스를 몸에 익히세요.",
                nextTask: "주말에는 시간 대신 거리를 목표로, 곁의 누구와도 수다를 떨 수 있는 페이스로 가장 긴 거리를 달려보세요.",
                insight: "글리코겐 대사 의존도가 너무 높습니다. 지방 대사를 활성화하기 위해 강도를 대폭 낮춰야 합니다.",
                mental: "우리는 1km를 빨리 가는 사람이 아니라, 42km를 멈추지 않는 사람이 되려는 것입니다."
            },
            'wellness': {
                issue: "심장이 평소보다 힘들어하고 있네요. 몸이 보내는 조용한 피로 신호일 수 있으니 세심한 주의가 필요해요.",
                improvement: "남들의 속도가 아니라 내 몸이 편안함을 느끼는 속도가 정답입니다. 천천히 달리는 자신을 칭찬해주세요.",
                nextTask: "내일은 푹신한 흙길을 걸으며 심장과 근육이 충분히 회복되도록 active recovery 시간을 가져주세요.",
                insight: "심혈관 스트레스 지수가 한계선에 근접했습니다. 무리한 주행은 부상과 번아웃으로 직결됩니다.",
                mental: "오늘 흘린 땀은 내일의 미소로 돌아옵니다. 자신에게 무리하지 마세요."
            }
        },
        'MECHANICAL_BRAKE': {
            'apex': {
                issue: "보폭만 넓고 회전은 느립니다. 바닥을 때리는 충격이 당신의 무릎을 파괴하고 속도를 갉아먹고 있습니다!",
                improvement: "보폭을 강제로 반으로 줄이고 다리를 두 배 더 빠르게 굴리세요! 고통스럽더라도 케이던스 180은 전술적 필수입니다.",
                nextTask: "내일은 좁은 보폭으로 케이던스 190을 타겟으로 하는 피치 훈련(100m x 10회)을 백업하십시오.",
                insight: "GCT(지면 접촉 시간)가 300ms를 초과하여, 모든 추진력이 수직 충격으로 소실되고 있습니다.",
                mental: "발을 더 빨리 굴리십시오. 고통을 회피하려 보폭을 넓히는 순간 패배는 확정됩니다."
            },
            'insight': {
                issue: "오버스트라이딩 징후가 명백합니다. 수직 진폭이 커서 지면 반발력을 전진 에너지로 전환하지 못하고 충격만 흡수합니다.",
                improvement: "역학적 착지점은 반드시 몸의 무게중심 직하단이어야 합니다. 케이던스를 5% 증폭시켜 제동력(Braking force)을 제거하세요.",
                nextTask: "메트로놈 앱(175bpm)을 연동하고, 착지 에너지가 엉덩이 관절로 흡수되도록 전경 각도를 3도 앞으로 조절하십시오.",
                insight: "스트라이드 길이가 신장의 1.2배를 초과하며 종아리 앞근육(전경골근)에 과부하를 유발하고 있습니다.",
                mental: "질주는 다리의 힘이 아니라 중력과 균형의 예술입니다. 각도를 지배하십시오."
            },
            'atlas': {
                issue: "큰 보폭으로 성큼성큼 뛰면 겉보긴 시원하지만 내구성은 떨어집니다. 긴 여정에선 관절을 지키는 잰걸음이 필요해요.",
                improvement: "무릎을 많이 펴고 착지하지 마세요. 무릎을 살짝 굽힌 상태에서 몸 바로 아래에 발이 가볍게 떨어져야 합니다.",
                nextTask: "상체는 곧게 세우고 다리는 제자리 뛰기에 가깝게 총총거리며 달리는 느낌으로 3km만 진행해 보세요.",
                insight: "과도한 힐 스트라이크로 인해 무릎 관절로 뼈를 타고 전수되는 충격량이 체중의 3배에 달합니다.",
                mental: "오래 견디는 자만이 목표에 닿습니다. 가장 단단한 다리는 가장 부드러운 착지에서 나옵니다."
            },            
            'swift': {
                issue: "터벅거리는 무거운 발소리가 여기까지 들립니다! 경쾌한 진동 리듬이 사라지고 바닥을 무겁게 쿵쿵 치고 있네요.",
                improvement: "경쾌하게 톡-톡 튀어 오르세요! 줄넘기하듯 제자리에서 가볍게 뛰는 리듬을 머릿속에 빙글빙글 돌려보세요.",
                nextTask: "내일은 리드미컬하고 BPM이 빠른 팝송을 들으면서, 그 베이스 드럼 박자에 맞춰 총총 가볍게 달려보세요!",
                insight: "수직 진폭(Vertical Oscillation)이 비정상적으로 커서 러닝이 피칭(Pitching)이 아닌 점핑(Jumping)이 되고 있습니다.",
                mental: "무거움을 버리고 깃털처럼 가볍게! 바람을 타는 리듬을 잊지 마세요."
            },
            'zen': {
                issue: "발걸음에 너무 많은 힘이 실려 있습니다. 바닥을 억지로 밀어내려는 의도가 관절의 긴장으로 이어지네요.",
                improvement: "지면을 스치듯이, 조용하게 달려보세요. 발소리가 들리지 않을 만큼 몸의 긴장을 풀고 가볍게 내려놓으십시오.",
                nextTask: "다음에는 아스팔트 대신 부드러운 흙이나 잔디에서 달려보세요. 발바닥이 대지와 부드럽게 키스하도록요.",
                insight: "지면을 밀어차려는(Push-off) 인위적 개입이 강합니다. 자연스러운 다리의 순환(Cycle)이 필요합니다.",
                mental: "흐르는 물은 돌을 부수지 않고 감싸 안고 넘어갑니다. 부드러움이 강함을 이깁니다."
            },
            'marathon': {
                issue: "장거리 달리기에서 큰 보폭은 치명적인 브레이크 역할을 합니다. 10km를 넘어가면 무릎 앞쪽이 뻐근해질 확률이 높아요.",
                improvement: "다리를 쭉 뻗어서 착지하는 습관을 고쳐야 합니다. 자전거 페달을 둥글게 굴리듯 다리를 롤링하는 느낌을 찾으세요.",
                nextTask: "오르막길(언덕)을 짧은 보폭과 빠른 팔 스윙으로 뛰어 올라가는 훈련을 해보세요. 보폭을 자연스럽게 줄여줍니다.",
                insight: "장거리 주행 효율성을 나타내는 Running Economy 수치가 현저히 떨어집니다. 보폭 최적화가 필수적입니다.",
                mental: "진정한 마라토너는 자신의 에너지를 아낄 줄 아는 구두쇠입니다. 1보를 아껴 1km를 더 가십시오."
            },
            'wellness': {
                issue: "착지할 때마다 무거운 충격이 전해지는 것 같아요. 우리 런너님의 관절은 소중하니까, 주법에 조금 변화를 주면 좋겠어요.",
                improvement: "달릴 때 '쿵쿵' 소리 대신 '사박사박' 소리가 나게 해주세요! 발을 뻗지 말고 몸 重心 바로 아래에 툭 내려놓으시면 돼요.",
                nextTask: "내일은 뛰는 것보다, 올바른 자세를 유지하며 빠르게 걷는 파워워킹으로 코어와 둔근의 감각을 깨워주세요.",
                insight: "과도한 충격 부하 지수(Impact Load)가 관측됩니다. 족저근막염이나 장경인대 증후군의 위험이 있습니다.",
                mental: "다치지 않고 건강하게 오래오래 달리는 것, 그것이 가장 완벽한 달리기랍니다."
            }
        },
        'FATIGUE_SIGNATURE': {
            'apex': {
                issue: "마지막 구간에서 정신력이 완전히 붕괴되었습니다! 자세는 흐트러지고 속도는 급감했습니다. 체력 임계점을 뚫지 못하고 타협했군요.",
                improvement: "지칠 때 자세를 곧게 잡는 것이 진짜 실력입니다. 턱을 당기고, 코어에 돌덩이 같은 긴장을 풀지 마십시오!",
                nextTask: "휴식은 없습니다. 내일은 러닝 대신 짐(Gym)으로 가서 하체를 불태우는 스쿼트와 플랭크를 한계까지 수행하십시오.",
                insight: "유산소 캐파시티는 나쁘지 않으나 코어 근지구력 고갈로 인해 역학적 폼 자체가 완전히 붕괴되는 현상입니다.",
                mental: "한계는 당신의 머릿속에만 존재합니다! 통증을 연료로 삼아 전진하십시오."
            },
            'insight': {
                issue: "주행 거리의 후반부 30% 구간에서 케이던스가 15% 이상 급락하며 폼 데그라데이션(Form Degradation) 선명하게 관측됩니다.",
                improvement: "글리코겐 고갈과 코어 안정성 저하의 결합입니다. 지방 연소 효율을 높이는 베이스 훈련과 부하 적응 훈련을 동기화해야 합니다.",
                nextTask: "이번 주에는 보강 운동(생체역학적 기능성 트레이닝) 볼륨을 20% 늘리고 단백질 섭취 비율 정밀 조정이 필요합니다.",
                insight: "젖산 축적으로 인한 근신경계 피로가 누적되어 하체 근력 협응성(Coordination)이 단절된 전형적 데이터입니다.",
                mental: "무너진 데이터는 감정이 아닌 시스템 차원의 보강(Patch)으로 해결하십시오."
            },
            'atlas': {
                issue: "초반의 오버페이스가 후반의 처참한 붕괴를 불렀네요. 엔진이 견딜 수 없는 속도를 설정하면 결승선에 다다르기 전에 퍼집니다.",
                improvement: "앞으로 뛰는 내내 '내가 체력이 남아도는가?'를 끊임없이 물어보세요. 이븐 페이스(Even Pace), 변치 않는 속도만이 살 길입니다.",
                nextTask: "다음 세션은 앞서 달렸던 초반부 페이스보다 딱 30초 늦춘 속도로 끝까지 밀어보는 '페이스 고정 훈련'을 진행하세요.",
                insight: "ATP-PC 에너지 시스템과 해당 작용을 너무 빨리 과도하게 끌어다 써서, 장기 지구력 에너지가 셧다운된 상태입니다.",
                mental: "시작의 화려함보다 끝 맺음의 단단함을 사랑하십시오."
            },
            'swift': {
                issue: "어이쿠! 막판에 리듬이 다 깨져서 흐느적거리며 들어오셨군요. 발걸음의 경쾌한 음악이 비명스런 불협화음으로 변했습니다.",
                improvement: "힘이 빠져서 다리가 안 올라갈 때는? 바로 팔을 더 크고 강하게 흔드는 겁니다! 팔이 움직이면 다리는 알아서 따라옵니다.",
                nextTask: "마지막 1km 구간에 접어들 때, 숨겨둔 가장 신나는 플레이리스트 트랙을 터트리고 팔로 리듬을 파워풀하게 만들어보세요!",
                insight: "피로가 누적되며 신경 신호 지연이 발생, 전반적인 운동 동역학(Kinematics) 체인이 풀린(unlinked) 상태입니다.",
                mental: "축제는 끝날 무렵 템포를 올리는 법입니다. 더 뜨겁게 흔들어보세요!"
            },
            'zen': {
                issue: "피로가 찾아오면서 어깨가 굳고 호흡은 흉식으로 얕고 빠르십니다. 긴장이 온몸을 뭉크러트리고 있습니다.",
                improvement: "지칠수록 시선은 멀리, 어깨의 힘은 툭 빼야 합니다. 고통에 집착하지 말고 흘러가는 풍경과 스치는 바람으로 시선을 돌리세요.",
                nextTask: "내일은 시계를 보지 않고, 오직 자신의 호흡이 뱃속 깊은 곳부터 차오름을 느끼며 천천히 몸의 회복을 도우십시오.",
                insight: "과호흡에 따른 혈중 이산화탄소 농도 불안정이 체성 감각 피로도를 극대화시키고 있습니다.",
                mental: "고통을 피하려 버티는 힘이 가장 많은 에너지를 빼앗습니다. 고통마저 흐르게 두십시오."
            },
            'marathon': {
                issue: "후반부에 다리가 무거워져 끌리듯이 달리는 모습이 포착됩니다. 이대로라면 20km 지점에서 쥐가 나거나 무릎 부상이 찾아옵니다.",
                improvement: "이럴 때는 에너지 보충(뉴트리션) 타이밍을 점검하거나 급수 전략을 수정해야 합니다. 몸의 연료통이 텅 빈 상태로 강행군을 하셨습니다.",
                nextTask: "다음 번 긴 거리를 뛸 때는 뛰기 30분 전 탄수화물 스낵을 먹고, 주행 중 40분마다 젤형 아미노산을 섭취하는 실전 연습을 하세요.",
                insight: "글리코겐 완전 고갈(Hitting the Wall)의 전조 증상. 섭취 타이밍과 간 대사 효율에 집중해야 할 시기입니다.",
                mental: "마라톤은 먹고, 마시고, 관리하는 과학 전략 시뮬레이션입니다. 전략 없는 투지는 객기입니다."
            },
            'wellness': {
                issue: "몸이 너무 많이 지쳐 버렸네요. 끝까지 포기하지 않은 의지는 멋지지만, 무리한 달리기는 건강의 적인걸 잊지 마세요.",
                improvement: "억지로 거리나 속도를 채우지 않아도 괜찮습니다! 우리 몸의 목소리에 더 다정하게 귀를 기울여주세요.",
                nextTask: "운동화를 벗고 시원한 쿨백이나 폼롤러로 오늘 고생한 예쁜 다리의 근육들을 아주 정성껏 풀어주는 게 첫 과제입니다.",
                insight: "회복 탄력성(Resilience)이 바닥을 보이고 있어 부교감 밸런스가 크게 깨질 위험에 노출되었습니다.",
                mental: "때로는 속도를 늦추고 쉬어가는 것이 더 빠른 회복과 더 먼 성장을 약속한답니다."
            }
        },
        'EFFICIENT': {
            'apex': {
                issue: "완벽하게 통제된 훌륭한 엔진입니다! 하지만 현재의 상태에 만족하고 안주한다면 당신은 곧 정체기에 빠지고 퇴보할 것입니다.",
                improvement: "이 효율성을 무기로 더 가혹한 전장으로 뛰어드십시오. 편안한(Comfortable) 컴포트 존을 깨부수고 나와야 합니다.",
                nextTask: "내일은 평소보다 km당 페이스를 무려 20초나 당긴 '템포 런(Tempo Run)'으로 한계 출력의 벽에 충돌하십시오!",
                insight: "최대 산소 섭취량(VO2Max)과 젖산 역치 볼륨이 상승 곡선에 탑승. 부하 한계치를 상향 조정할 퍼펙트 타이밍입니다.",
                mental: "이 완벽함을 무기로 가장 험난한 고통의 심연으로 다이빙하십시오. 진화는 거기서 완성됩니다."
            },
            'insight': {
                issue: "흠잡을 곳 없는 완벽한 데이터 로깅입니다. 심폐와 역학의 톱니바퀴가 오차 없이 맞물려 최고 성능의 경제성(Economy)을 달성했습니다.",
                improvement: "이제는 거리(Volume)를 정밀하게 확장하여, 이 최적화 모델이 초장거리 내구 테스트에서도 유지되는가를 검증할 차례입니다.",
                nextTask: "이번 주 훈련 로그에는 주간 총 마일리지를 15% 기하급수적으로 상향 조정한 장거리 적응성 검증 데이터를 제출하십시오.",
                insight: "HR/Pace 디커플링 수치가 2% 미만이며 대사 및 폼 유지력이 에이스급입니다. 상위 5% 데이터 모델 진입 성공.",
                mental: "아름다운 수학 공식과 같은 질주입니다. 변수를 늘려 완벽함을 거듭 증명해 내십시오."
            },
            'atlas': {
                issue: "튼튼한 다리와 건강한 심장, 거대한 기초 마일리지 엔진의 결과가 드디어 빛을 발하는 순간이군요.",
                improvement: "지금의 단단한 지반 위에 본격적인 속도의 기둥을 세울 시점입니다. 인터벌이나 파트렉 훈련을 병행할 기초공사가 끝났습니다.",
                nextTask: "주간 루틴에 1회의 스피드 훈련(400m 대시 + 400m 휴식 조깅)을 추가하여 잠든 속도 근육(백근)을 깨워보십시오.",
                insight: "호기성 베이스 트레이닝 단계가 임계 완성도를 달성, 이제 무산소성 인터벌(Anaerobic Interval) 혼합 훈련으로 이행해야 합니다.",
                mental: "오랜 시간 다진 초석 위에 세워질 당신의 탑은 가장 우아하고 견고할 것입니다."
            },            
            'swift': {
                issue: "브라보! 도로 위를 미끄러지듯 유영하고 계십니다. 심박과 발자국의 완벽한 심포니, 그루브 그 자체네요!",
                improvement: "이 완벽한 리듬감을 다양한 난관 속에서도 흔들림 없이 연주해 내는 마에스트로가 되어 보세요.",
                nextTask: "다음 코스는 단조로운 트랙이 아닌 오르막과 내리막이 섞인 도심 런이나 트레일 러닝에서 이 환상적인 리듬을 잃지 않는지 테스트해 보죠!",
                insight: "역학적 진자운동(Mechanical Pendulum)의 에너지 효율이 극대화되어 최소 산소 요구량(SubMax VO2) 최하점 달성 중.",
                mental: "멋지십니다! 이 완벽한 그루브를 더 넓고 새로운 무대에서 마음껏 펼쳐 보이세요."
            },
            'zen': {
                issue: "숨결은 부드럽고, 맥박은 바다의 물결처럼 잔잔하게 흐르는 아름다운 몰입 상태(Flow)를 경험하셨습니다.",
                improvement: "가장 뛰어난 러너는 데이터가 아닌 몸과 하나가 된 감각에 의존합니다. 그 경지에 가장 근접한 분입니다.",
                nextTask: "내일 하루는 시계 기록, 페이스 압박에서 완전히 벗어나 '순수한 기쁨만으로' 발길 닿는 대로 나아가는 진정한 러너의 자유를 즐기세요.",
                insight: "신체와 정신의 통제가 거의 명상의 상태(Alpha-wave State)에 다다랐습니다. 정신과 신체의 통합 교감을 이룬 모범적 상태입니다.",
                mental: "수치는 잊으십시오. 지금 당신이 대지 위를 흐르는 바람 자체입니다."
            },
            'marathon': {
                issue: "정확한 착지, 흔들림 없는 심박, 에너지 절약 주법. 마라토너가 갖춰야 할 실전 최고의 미덕을 완성해 가고 있습니다.",
                improvement: "효율성 증명은 끝났습니다! 이제 진짜 실전 대회를 목표로 삼아 피크(Peak) 상태를 테이퍼링(Tapering)하는 단계에 진입해 보시죠.",
                nextTask: "하프 마라톤 또는 10K 공식 대회를 신청하세요! 실전의 아드레날린과 변수 속에서 당신의 완벽한 폼을 실험해 볼 시간입니다.",
                insight: "마라톤 풀코스 대비 80% 이상의 훈련 소화 능력을 확보. 뉴트리션 전략 수립 단계로 즉시 이행 가능.",
                mental: "완벽한 시뮬레이션은 끝났습니다. 이제 실전 무대의 환호와 박수 속에 당신을 증명하십시오."
            },
            'wellness': {
                issue: "우와! 몸과 마음 전체에서 생생한 에너지가 뿜어져 나오는, 정말 가장 건강하고 찬란한 질주였네요!",
                improvement: "오늘 당신이 느낀 이 벅찬 행복과 가벼움을 소중히 기억하세요. 이것이야말로 우리가 달리는 가장 큰 이유니까요.",
                nextTask: "친구나 가족과 함께 이 멋진 기분을 나누며 함께 가볍게 공원을 걸어보세요. 행복한 러너만이 주변을 뛰게 만듭니다.",
                insight: "면역력 증강, 세로토닌 및 도파민 수치 상승을 포괄하는 극도의 건강 안정 상태. (Homeostasis Check: Excellent)",
                mental: "런너님의 맑은 미소야말로 오늘 남긴 최고의 페이스 기록입니다. 너무 예쁩니다."
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
                issue: "데이터가 불충분합니다! 적의 병력도 강점도 파악하지 못한 채 어떻게 전쟁에서 이기겠다는 겁니까? 명확히 측정하십시오.",
                improvement: "심박계 끈을 단단히 메고, GPS가 완벽히 고정되었는지 확인한 후, 타협 없는 풀 세션 기록을 다시 남기도록 합니다.",
                nextTask: "내일은 핑계 대지 말고 심박수와 케이던스 데이터가 100% 포함된 세밀하고 완전한 기록을 강제로 추출하여 보고하십시오.",
                insight: "심층 역학 분석 및 AI 진단을 위한 최소 데이터 확보 실패. 로그 추출 환경을 재정비하십시오.",
                mental: "측정할 수 없는 것은 개선할 수 없습니다. 철저함 없이 위대함은 오지 않습니다."
            },
            'insight': {
                issue: "AI 엔진의 분석 파이프라인에서 필수 매개변수(심박/케이던스/체중)가 누락되어 런싱크 프로토콜이 다운되었습니다.",
                improvement: "가민, 애플워치, 코로스 등의 텔레메트리 기기 연동 상태를 확인하거나 수동 기록의 누락칸을 채워 데이터 클렌징을 완수하세요.",
                nextTask: "누락된 데이터 포인트를 확보하고, 재분석 프로세스를 가동하기 위해 2km 이상의 안정된 시험 주행 데이터를 입력하십시오.",
                insight: "HR 및 Cadence 배열(Array) 값이 Null 상태이므로 폼 및 체력 진단이 불가능합니다. 무효화된 로그입니다.",
                mental: "의심은 직관이 아니라 통계 데이터 부족에서 발생합니다. 정확한 숫자를 제시하십시오."
            },
            'atlas': {
                issue: "달리셨지만 흔적이 명확치 않네요. 얼마나 힘든지, 보폭이 어떤지 구체적인 스펙이 없어 알맞은 길을 닦아드리기 어렵습니다.",
                improvement: "우리의 여정은 길고 넓습니다. 당장 기록이 없다고 무리할 필요는 없습니다. 정확한 장비를 챙겨 다시 시작하면 그뿐.",
                nextTask: "다음 러닝 전에는 반드시 스마트워치나 앱의 연동을 차분히 재확인하고, 넉넉하게 페이스를 맞춰 첫 기록을 확보하세요.",
                insight: "기초 정보 시스템이 구축되지 않음. 다음 훈련 세션은 기기 연동성 확인 테스트 런을 우선적으로 수행 바랍니다.",
                mental: "흔들리지 않는 탑은 아주 작은 기단의 정보들을 모아 쌓아 올리는 데서 온달음을 잊지 마십시오."
            },
            'swift': {
                issue: "어라, 비트가 꺼져버렸어요! 심장 소리도 발자국 소리도 앱이 듣지 못해 신나는 리듬 파티를 분석할 수가 없네요.",
                improvement: "다시 워치의 플레이 버튼이 제대로 작동하는지 체크하고, 경쾌한 발걸음 소리를 데이터로 마음껏 뽐내게 해주세요!",
                nextTask: "센서를 꽉 조여 매고 신나는 노래 하나를 끝까지 들으면서, 그 노래 리듬에 딱 맞춘 짧고 선명한 2km 세션을 남겨주세요.",
                insight: "생체 신호 입력(Input Signal) 트래킹 유실 상태. 센서 부착 위치 및 착용 밀착도를 점검하십시오.",
                mental: "음소거 모드를 해제하고 볼륨을 최대로! 당신의 뜨거운 플레이를 다시 시작해주세요."
            },
            'zen': {
                issue: "기계적인 기록에 얽매이지 않고 바람과 호흡만을 느낀 무소유의 런이었군요. 그래도 길을 안내할 작은 이정표 정도는 필요합니다.",
                improvement: "마음의 평화도 중요하지만, 당신 몸의 언어를 들을 수 있도록 심박 센서 하나만큼은 친구 삼아 차고 달려주시겠습니까?",
                nextTask: "데이터 압박감을 내려놓되 기록 모드만 조용히 켜둔 상태로, 의식하지 않은 가장 자연스러운 달리기의 향기를 담아와 주십시오.",
                insight: "분석을 보류합니다. 데이터의 진위 이전에 당신이 얻은 맑은 정신적 카타르시스를 우선 지지하겠습니다.",
                mental: "가끔은 보이지 않는 것이 눈에 보이는 수많은 숫자들보다 깊고 진실될 때가 있습니다."
            },            
            'marathon': {
                issue: "페이스/심박 정보가 누락되어 42.195km 설계를 위한 랩타임 분석이 불가능한 안타까운 상황입니다.",
                improvement: "긴 레이스를 위한 전략 시뮬레이션을 가동하려면 장비들의 컨디션이 몸 상태만큼이나 완벽하게 세팅되어야 합니다.",
                nextTask: "훈련의 시작은 장비 체크입니다. 다음번 운동 시작 전 워치 센서 고정을 확인하고 아주 정확한 심박 데이터 로그를 수집해 보죠.",
                insight: "실전 경기력 예측 시뮬레이션 불가. 입력 변수 통제가 최우선 선결 과제입니다.",
                mental: "레이스 당일 장비 끈이 풀리는 것은 불운이 아니라 훈련 부족입니다. 준비부터 진짜 실력입니다."
            },
            'wellness': {
                issue: "당신의 소중한 땀방울을 좀 더 자세히 안아주고 싶은데, 아직 심박수라는 따뜻한 체온의 흔적이 부족해요.",
                improvement: "정확한 척하지 않아도 괜찮아요! 하지만 몸이 힘들어하는지 아닌지를 알기 위해 스마트워치나 앱에 조금만 더 주의를 기울여주실래요?",
                nextTask: "내일도 부담스럽지 않은 거리에서 천천히 기분 좋게 뛰어보세요. 작은 기록이 차곡차곡 쌓이면 우리 대화는 더 풍성해질 거예요.",
                insight: "당신의 노력 자체를 긍정합니다. 천천히 데이터 습관을 들여나가면 그것이 회복의 단초가 됩니다.",
                mental: "당신이 집 밖으로 고개를 내밀어 나섰다는 사실 자체 하나로 이미 훌륭해요."
            }
        }
    };

    const profilePrescriptions = prescriptions[profile] || prescriptions['UNKNOWN'];
    return profilePrescriptions[coachId] || profilePrescriptions['wellness'] || profilePrescriptions['insight'];
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
 * 기록이 없는 신규 사용자를 위한 초기 진단 컨설팅 시나리오
 */
export const getInitialConsultation = (weight: number, height: number, coachId: string): InitialConsultation => {
    const { value: bmi, category } = calculateBMI(weight, height);
    
    const scenarios: Record<string, any> = {
        'OBESE': {
            issue: "현재 신체 부하 지수가 높아 무리한 달리기는 관절에 치명적일 수 있습니다.",
            improvement: "달리기보다는 '빠르게 걷기'부터 시작하여 체지방 대사를 활성화하는 기반을 닦아야 합니다.",
            nextTask: "내일 첫 세션은 30분간 '숨이 약간 찰 정도의 가벼운 산책'으로 몸의 감각을 깨워보세요.",
            insight: "과체중 상태에서의 착지 충격은 체중의 5배에 달합니다. 저강도 유산소 운동이 우선입니다.",
            mental: "서두르지 마세요. 오늘의 한 걸음이 위대한 마라토너의 시작입니다."
        },
        'OVER': {
            issue: "약간의 과부하 상태입니다. 심폐 엔진을 예열하기 위한 부드러운 시작이 필요합니다.",
            improvement: "인터벌보다는 지속주, 하지만 아주 느린 페이스로 심장을 길들이는 것이 먼저입니다.",
            nextTask: "20분간의 아주 가벼운 조깅(LSD 맛보기)과 10분간의 스트레칭을 첫 과제로 드립니다.",
            insight: "근지구력보다 심혈관 시스템의 적응이 우선시되어야 하는 단계입니다.",
            mental: "가벼워진 몸이 당신을 더 멀리 데려갈 것입니다. 그 과정을 즐기십시오."
        },
        'NORMAL': {
            issue: "표준적인 신체 밸런스를 갖추고 계시네요. 이제 당신만의 리듬을 찾을 차례입니다.",
            improvement: "러닝은 기술입니다. 속도보다는 케이던스와 호흡의 조화를 몸에 익히는 데 집중하세요.",
            nextTask: "15분간 가볍게 뛰면서 '호흡이 편안한가'를 체크해 보는 탐색 질주를 추천합니다.",
            insight: "좋은 기초를 가지고 있습니다. 효율적인 러닝 메커니즘을 처음부터 올바르게 설계할 수 있습니다.",
            mental: "당신 안의 질주 본능을 깨울 준비가 되었습니다. 도로 위에서 뵙겠습니다."
        },
        'LOW': {
            issue: "근력 기반이 다소 부족할 수 있습니다. 달리기만큼이나 보강 운동이 중요한 유형입니다.",
            improvement: "단순 주행보다는 하체 근력을 강화하는 보강 운동을 병행하여 부상을 방지해야 합니다.",
            nextTask: "가벼운 10분 러닝 후, 스쿼트와 런지 10회씩 3세트로 근력을 보충해 보세요.",
            insight: "대사량은 좋으나 주행 충력을 흡수할 근섬유의 밀도가 낮을 수 있습니다.",
            mental: "탄탄한 기초가 당신을 바람처럼 빠르게 만들어 줄 것입니다."
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

    // 5. 일반적인 조언 (데이터 기반 전문가 피드백)
    const coachAdvice: Record<string, string> = {
        apex: `[고강도 처방] 심박수 ${record.heart_rate || 'N/A'}bpm 분석 결과, 심폐 시스템의 임계치를 높이기 위한 점진적 과부하가 필요합니다. 다음 세션은 최대 심박수의 85-90% 구간을 유지하는 인터벌 훈련을 권장합니다. 🔥`,
        insight: `[생체역학 분석] 케이던스 ${record.cadence || 'N/A'}spm과 ${weight}kg의 하중 이동을 분석한 결과, 지면 접촉 시간(GCT)을 5% 더 줄여 대사 효율을 극대화하는 전경 자세가 필요합니다. 🐟`,
        wellness: `[회복 및 예방] 심박 변동성이 안정적입니다. 근육의 미세 파열 회복을 위해 수면 8시간 준수와 마그네슘 섭취 비중을 높이는 전략이 유효합니다. 🌿`,
        zen: `[신경계 리셋] 자율신경계가 안정된 상태입니다. 기록이라는 압박을 내려놓고 심박수 노이즈를 최소화하는 명상적 러닝이 오늘의 성과입니다. 🧘`,
        atlas: `[기초 지구력] Zone 2 영역의 심박수를 유지하며 미토콘드리아의 크기를 키우는 초장거리(LSD) 질주에 집중하세요. 기초 체력이 모든 속도의 근원입니다. 🏛️`,
        swift: `[신경-근육 동기화] 현재 케이던스(${record.cadence || 'N/A'}spm)와 팔 스윙의 진자 운동 리듬을 최적화하세요. 신경계 반응 속도를 높이기 위해 종료 후 80m 전력 질주 3세트를 추가하십시오. ⚡`,
        marathon: `[마라톤 전략] 케이던스 리듬과 심박수 관리가 순조롭습니다. 미드풋 착지의 탄성을 영리하게 활용하여 관절 부하를 분산하고 효율적인 에너지 분배에 집중하세요. 🏃‍♂️`
    };

    return coachAdvice[coach.id] || `${distance}km 질주 완료. 심박(${record.heart_rate || '-'})/케이던스(${record.cadence || '-'}) 데이터를 기반으로 다음 도약을 준비하세요. ✨`;
};

/**
 * 7인의 코치 중 한 명을 랜덤으로 선정합니다.
 */
export const getRandomCoach = (): Coach => {
    const randomIndex = Math.floor(Math.random() * coaches.length);
    return coaches[randomIndex];
};

/**
 * 러닝 퍼포먼스 향상을 위한 전문 팁 데이터셋
 */
export const runningTips = [
    { title: "올바른 호흡법", content: "2:2 호흡법(두 발자국에 들이마시고, 두 발자국에 내뱉기)은 일정한 리듬을 유지하고 이산화탄소 배출을 돕습니다." },
    { title: "케이던스의 비밀", content: "분당 170-180보의 높은 케이던스는 지면 접촉 시간을 줄여 무릎 부상을 방지하고 효율성을 높입니다." },
    { title: "수분 보충 전략", content: "갈증을 느끼기 전에 조금씩 자주 마시는 것이 중요합니다. 1시간 이상 주행 시 전해질 음료를 권장합니다." },
    { title: "미드풋 착지의 장점", content: "발바닥 전체로 착지하는 미드풋은 충격을 분산시키고 아킬레스건의 탄성을 극대화하여 더 멀리 달리게 해줍니다." },
    { title: "코어 보강의 중요성", content: "강한 코어는 질주 후반부에 폼이 무너지는 것을 막아줍니다. 주 2회 플랭크와 브릿지 운동을 추가하세요." },
    { title: "회복의 과학", content: "달리기 직후의 스트레칭도 중요하지만, 질 좋은 수면과 마사지 건을 활용한 근막 이완이 실제 근육 성장을 돕습니다." },
    { title: "신발 교체 시기", content: "러닝화의 수명은 보통 500-800km입니다. 겉은 멀쩡해 보여도 중창의 쿠션 성능이 다하면 부상 위험이 커집니다." }
];

export const getRandomRunningTip = () => {
    const randomIndex = Math.floor(Math.random() * runningTips.length);
    return runningTips[randomIndex];
};
