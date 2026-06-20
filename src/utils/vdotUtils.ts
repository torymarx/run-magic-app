/**
 * Run-Sync 4.0 - VDOT (Jack Daniels' Running Index) Utils
 * 
 * VDOT formula references:
 * VO2 = -4.60 + 0.182258 * velocity + 0.000104 * velocity^2
 * %VO2max = 0.8 + 0.1894393 * e^(-0.0115 * time) + 0.2989558 * e^(-0.209 * time)
 * VDOT = VO2 / %VO2max
 * 
 * where velocity is in meters per minute and time is in minutes.
 */

/**
 * Calculates VDOT from distance and time.
 * @param distanceInKm Distance in kilometers.
 * @param timeInMinutes Time in minutes.
 * @returns Calculated VDOT value.
 */
export const calculateVDOT = (distanceInKm: number, timeInMinutes: number): number => {
    if (distanceInKm <= 0 || timeInMinutes <= 0) return 0;

    const velocity = (distanceInKm * 1000) / timeInMinutes; // m/min
    
    // VO2 required for the given velocity
    const vo2 = -4.60 + 0.182258 * velocity + 0.000104 * Math.pow(velocity, 2);
    
    // Percentage of VO2max that can be maintained for the given time
    const pctMax = 0.8 + 0.1894393 * Math.exp(-0.0115 * timeInMinutes) + 0.2989558 * Math.exp(-0.209 * timeInMinutes);
    
    return vo2 / pctMax;
};

/**
 * Velocity at a given percentage of VO2max.
 * This is the inverse of the VO2 formula used above.
 * solved using quadratic formula: v = (-b + sqrt(b^2 - 4a(c-vo2))) / 2a
 */
const velocityFromVO2 = (vo2: number): number => {
    const a = 0.000104;
    const b = 0.182258;
    const c = -4.60;
    
    return (-b + Math.sqrt(Math.pow(b, 2) - 4 * a * (c - vo2))) / (2 * a);
};

export interface RecommendedPaces {
    easy: string;      // 59-74% VO2max
    marathon: string;  // 75-84% VO2max
    threshold: string; // 88% VO2max
    interval: string;  // 95-100% VO2max
    repetition: string; // ~105-110% VO2max
}

const formatSecondsToPace = (secondsPerKm: number): string => {
    const mins = Math.floor(secondsPerKm / 60);
    const secs = Math.round(secondsPerKm % 60);
    return `${mins}'${secs.toString().padStart(2, '0')}"`;
};

/**
 * Gets recommended paces for various training types based on VDOT.
 * @param vdot The runner's VDOT score.
 * @returns Object containing formatted pace strings.
 */
export const getRecommendedPaces = (vdot: number): RecommendedPaces => {
    if (vdot <= 0) {
        return { easy: "0'00\"", marathon: "0'00\"", threshold: "0'00\"", interval: "0'00\"", repetition: "0'00\"" };
    }

    // VO2 values for each intensity
    const easyVO2 = vdot * 0.70;      // Target approx 70%
    const marathonVO2 = vdot * 0.80;  // Target approx 80%
    const thresholdVO2 = vdot * 0.88; // Target exactly 88%
    const intervalVO2 = vdot * 0.97;  // Target approx 97.5%
    const repetitionVO2 = vdot * 1.06; // Target approx 106%

    const paces: RecommendedPaces = {
        easy: formatSecondsToPace(60 / (velocityFromVO2(easyVO2) / 1000)),
        marathon: formatSecondsToPace(60 / (velocityFromVO2(marathonVO2) / 1000)),
        threshold: formatSecondsToPace(60 / (velocityFromVO2(thresholdVO2) / 1000)),
        interval: formatSecondsToPace(60 / (velocityFromVO2(intervalVO2) / 1000)),
        repetition: formatSecondsToPace(60 / (velocityFromVO2(repetitionVO2) / 1000))
    };

    return paces;
};

/**
 * Maps VDOT to a relative intensity label for a given pace.
 */
export const getIntensityLabel = (vdot: number, paceSec: number): string => {
    if (vdot <= 0 || paceSec <= 0) return "분석 중";
    
    const velocity = 60000 / paceSec; // m/min
    const requiredVO2 = -4.60 + 0.182258 * velocity + 0.000104 * Math.pow(velocity, 2);
    const intensity = requiredVO2 / vdot;
    
    if (intensity < 0.60) return "리커버리 (매우 낮음)";
    if (intensity < 0.75) return "이지 (유산소 기초)";
    if (intensity < 0.85) return "마라톤 (지속주)";
    if (intensity < 0.92) return "역치 (T-페이스)";
    if (intensity < 1.02) return "인터벌 (I-페이스)";
    return "레피티션 (최대 속도)";
};
