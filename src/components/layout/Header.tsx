
import React from 'react';
import { PlusCircle, User } from 'lucide-react';

interface HeaderProps {
    points: number;
    onOpenManualForm: () => void;
    onOpenProfile: () => void;
    onSignOut: () => void;
}

const Header: React.FC<HeaderProps> = ({
    points,
    onOpenManualForm,
    onOpenProfile,
    onSignOut
}) => {


    return (
        <header className="global-nav" style={{ 
            height: '64px', 
            padding: '0 2rem',
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(30px)',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            {/* ── 좌측: 로고 ── */}
            <h1 onClick={() => window.location.reload()} style={{ 
                fontSize: '1.1rem', 
                fontWeight: '300', 
                margin: 0, 
                cursor: 'pointer',
                fontFamily: 'Inter, -apple-system, sans-serif',
                letterSpacing: '3px',
                color: 'white',
                opacity: 0.9
            }}>
                RUN MAGIC
            </h1>

            {/* ── 우측: 액션 그룹 ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                
                {/* 포인트 표시 (텍스트 중심) */}
                <div onClick={onOpenProfile} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    cursor: 'pointer',
                    opacity: 0.6,
                    transition: 'opacity 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
                onMouseOut={(e) => e.currentTarget.style.opacity = '0.6'}
                >
                    <span style={{ fontSize: '0.8rem', fontWeight: '400', color: 'white', fontFamily: 'Inter, sans-serif' }}>
                        {points.toLocaleString()} <span style={{ fontSize: '0.7rem', opacity: 0.5, marginLeft: '1px' }}>PTS</span>
                    </span>
                </div>

                {/* 기록 입력 (라인 아이콘) */}
                <button
                    onClick={onOpenManualForm}
                    style={{
                        background: 'none',
                        border: 'none',
                        padding: '0',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        opacity: 0.6,
                        transition: 'opacity 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
                    onMouseOut={(e) => e.currentTarget.style.opacity = '0.6'}
                >
                    <PlusCircle size={20} strokeWidth={1.5} />
                </button>

                {/* 프로필 (매우 단순한 서클 + 아이콘) */}
                <div 
                    onClick={onOpenProfile}
                    style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'opacity 0.2s',
                        opacity: 0.6
                    }}
                    onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
                    onMouseOut={(e) => e.currentTarget.style.opacity = '0.6'}
                >
                    <User size={20} strokeWidth={1.2} color="white" />
                </div>

                {/* 로그아웃 (텍스트만) */}
                <button onClick={onSignOut} className="hide-mobile" style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: 'white', 
                    padding: '0',
                    cursor: 'pointer',
                    fontSize: '0.7rem',
                    fontWeight: '300',
                    letterSpacing: '1px',
                    opacity: 0.3,
                    transition: 'opacity 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.opacity = '0.7'}
                onMouseOut={(e) => e.currentTarget.style.opacity = '0.3'}
                >
                    SIGN OUT
                </button>
            </div>
        </header>
    );
};

export default Header;
