
import { useState, useEffect } from 'react';
import { formatSecondsToTime } from '../utils/calculations';

export const useRunTimer = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [timer, setTimer] = useState(0);
    const [distance, setDistance] = useState(35.4); // Initial distance from original App.tsx

    useEffect(() => {
        let interval: any;
        if (isRecording) {
            interval = setInterval(() => {
                setTimer((prev) => prev + 1);
                setDistance((prev) => parseFloat((prev + 0.001).toFixed(3)));
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isRecording]);

    const handleStartRun = () => {
        setIsRecording(!isRecording);
        if (!isRecording) {
            setTimer(0);
        }
    };

    return {
        isRecording,
        timer,
        formattedTime: formatSecondsToTime(timer),
        distance,
        handleStartRun,
        setIsRecording,
        setTimer,
        setDistance
    };
};
