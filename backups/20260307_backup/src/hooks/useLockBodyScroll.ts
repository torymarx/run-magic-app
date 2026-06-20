import { useEffect } from 'react';

/**
 * 모달이 마운트될 때 body 스크롤을 방지하고, 
 * 언마운트될 때 원래 상태로 복구하는 커스텀 훅입니다.
 */
export const useLockBodyScroll = () => {
    useEffect(() => {
        // 현재 overflow 스타일 저장
        const originalStyle = window.getComputedStyle(document.body).overflow;
        const originalHtmlStyle = window.getComputedStyle(document.documentElement).overflow;

        // 스크롤 방지 설정
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';

        // 언마운트 시 복구
        return () => {
            document.body.style.overflow = originalStyle;
            document.documentElement.style.overflow = originalHtmlStyle;
        };
    }, []);
};
