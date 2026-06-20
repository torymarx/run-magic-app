import React from 'react';
import { Map as MapIcon } from 'lucide-react';

interface SyncOverlayProps {
    isVisible: boolean;
}

/**
 * 데이터 동기화 중임을 알리는 전체 화면 오버레이 🛡️
 */
export const SyncOverlay: React.FC<SyncOverlayProps> = ({ isVisible }) => {
    if (!isVisible) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.7)', zIndex: 9999,
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
            backdropFilter: 'blur(5px)'
        }}>
            <div className="pulse" style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--electric-blue)', marginBottom: '1.5rem' }} />
            <p className="neon-text-blue" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>데이터를 구름 요새에 안전하게 보관 중... 🛡️</p>
            <p style={{ marginTop: '0.5rem', opacity: 0.7 }}>잠시만 기다려 주세요. 금방 끝납니다!</p>
        </div>
    );
};

interface GPSOverlayProps {
    isRecording: boolean;
}

/**
 * 실시간 GPS 경로 추적 중임을 시각화하는 카드 내부 오버레이 ✨
 */
export const GPSOverlay: React.FC<GPSOverlayProps> = ({ isRecording }) => {
    if (!isRecording) return null;

    return (
        <div className="glass-card" style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
            background: 'rgba(10, 10, 12, 0.8)', zIndex: 10
        }}>
            <MapIcon size={48} className="neon-text-blue" style={{ marginBottom: '1rem' }} />
            <p className="neon-text-blue" style={{ fontWeight: 'bold' }}>GPS 경로 실시간 추적 중...</p>
            <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', opacity: 0.6 }}>런너님의 동선을 감각적으로 그리고 있어요 ✨</p>
        </div>
    );
};
