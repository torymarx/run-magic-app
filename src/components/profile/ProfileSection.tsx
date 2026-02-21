
import React, { useState } from 'react';
import { User, Scale, Ruler, Target, Edit3, Save, X, ShieldCheck, RefreshCw } from 'lucide-react';
import { UserProfile } from '../../hooks/useProfileManager';

interface ProfileSectionProps {
    profile: UserProfile;
    onUpdate: (updates: Partial<UserProfile>) => Promise<void> | void;
    onForceSaveTest: () => Promise<void> | void;
    isLoading: boolean;
    syncStatus?: { status: string, time: string, message: string }; // v13.2
    recordCount?: number; // v13.2
    onRefreshData?: () => void; // v13.3
    onClose: () => void;
}

const KODARI_CHARACTERS: Record<string, any[]> = {
    male: [
        { id: 1, name: '신참 질주자', emoji: '🐣', description: '질주 꿈나무' },
        { id: 2, name: '열혈 러너', emoji: '🔥', description: '열정의 러너' },
        { id: 3, name: '강철 근육', emoji: '💪', description: '무한 체력' },
        { id: 4, name: '광속 스프린터', emoji: '⚡', description: '속도의 지배자' },
        { id: 5, name: '질주 마스터', emoji: '👑', description: '질주의 신' }
    ],
    female: [
        { id: 1, name: '꿈나무 러너', emoji: '🐣', description: '질주 꿈나무' },
        { id: 2, name: '빛나는 질주자', emoji: '✨', description: '빛나는 질주자' },
        { id: 3, name: '웰니스 퀸', emoji: '🌿', description: '웰니스 퀸' },
        { id: 4, name: '표범의 속도', emoji: '🐆', description: '표범의 속도' },
        { id: 5, name: '질주의 여왕', emoji: '👑', description: '질주의 여왕' }
    ]
};

const ProfileSection: React.FC<ProfileSectionProps> = ({ profile, onUpdate, onForceSaveTest, syncStatus, recordCount, onRefreshData, onClose }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<Partial<UserProfile>>(profile);

    const handleSave = () => {
        onUpdate(editData);
        setIsEditing(false);
    };

    const currentGender = (profile.gender === 'female' ? 'female' : 'male');
    const currentCharacterList = KODARI_CHARACTERS[currentGender];
    const currentCharacter = currentCharacterList.find(c => c.id === (profile.characterId || 1)) || currentCharacterList[0];

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            zIndex: 100,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '1rem'
        }}>
            <section className="glass-card" style={{
                padding: '2rem',
                width: '100%',
                maxWidth: '800px',
                maxHeight: '90vh', // 저해상도 대응: 최대 높이 제한
                overflowY: 'auto', // 저해상도 대응: 스크롤바 허용
                overscrollBehavior: 'contain',
                position: 'relative',
                overflowX: 'hidden',
                animation: 'slideUp 0.3s ease-out'
            }}>
                {/* Background Decorative Element */}
                <div style={{ position: 'absolute', top: '-10%', right: '-5%', opacity: 0.05, pointerEvents: 'none' }}>
                    <User size={300} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div className="neon-border-blue" style={{ width: '60px', height: '60px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(0,209,255,0.1)', fontSize: '2rem' }}>
                            {currentCharacter.emoji}
                        </div>
                        <div>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editData.name}
                                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                    className="neon-input"
                                    style={{ fontSize: '1.5rem', fontWeight: 'bold', width: '200px', marginBottom: '4px' }}
                                    placeholder="성함을 입력하세요"
                                />
                            ) : (
                                <h2 className="neon-text-blue" style={{ fontSize: '1.6rem', fontWeight: 'bold', fontFamily: 'Outfit, sans-serif' }}>{profile.name} {profile.name === '런너님' ? '' : '런너님'}</h2>
                            )}
                            <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>{currentCharacter.name} ({currentCharacter.description}) 모드로 질주 중</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                        {!isEditing ? (
                            <button onClick={() => setIsEditing(true)} className="glass-button" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Edit3 size={16} /> 정보 수정
                            </button>
                        ) : (
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={handleSave} className="glass-button" style={{ background: 'var(--neon-green)', color: 'black', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Save size={16} /> 저장
                                </button>
                                <button onClick={() => setIsEditing(false)} className="glass-button" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <X size={16} /> 취소
                                </button>
                            </div>
                        )}
                        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', opacity: 0.5, padding: '5px' }}>
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {isEditing && (
                    <div style={{ marginBottom: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <p style={{ fontSize: '0.9rem', opacity: 0.8, margin: 0 }}>나에게 맞는 고유 캐릭터(DNA) 선택:</p>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                    onClick={() => setEditData({ ...editData, gender: 'male' })}
                                    style={{
                                        padding: '0.3rem 0.8rem',
                                        borderRadius: '20px',
                                        fontSize: '0.8rem',
                                        cursor: 'pointer',
                                        background: editData.gender === 'male' ? 'rgba(0,209,255,0.2)' : 'transparent',
                                        border: editData.gender === 'male' ? '1px solid var(--electric-blue)' : '1px solid rgba(255,255,255,0.1)',
                                        color: editData.gender === 'male' ? 'var(--electric-blue)' : 'white'
                                    }}
                                >
                                    남성
                                </button>
                                <button
                                    onClick={() => setEditData({ ...editData, gender: 'female' })}
                                    style={{
                                        padding: '0.3rem 0.8rem',
                                        borderRadius: '20px',
                                        fontSize: '0.8rem',
                                        cursor: 'pointer',
                                        background: editData.gender === 'female' ? 'rgba(189,0,255,0.2)' : 'transparent',
                                        border: editData.gender === 'female' ? '1px solid var(--vibrant-purple)' : '1px solid rgba(255,255,255,0.1)',
                                        color: editData.gender === 'female' ? 'var(--vibrant-purple)' : 'white'
                                    }}
                                >
                                    여성
                                </button>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.8rem' }}>
                            {KODARI_CHARACTERS[editData.gender === 'female' ? 'female' : 'male'].map(char => (
                                <div
                                    key={char.id}
                                    onClick={() => setEditData({ ...editData, characterId: char.id })}
                                    style={{
                                        cursor: 'pointer',
                                        padding: '0.8rem',
                                        borderRadius: '12px',
                                        textAlign: 'center',
                                        background: editData.characterId === char.id ? 'rgba(0,209,255,0.1)' : 'transparent',
                                        border: editData.characterId === char.id ? '1px solid var(--electric-blue)' : '1px solid rgba(255,255,255,0.1)',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>{char.emoji}</div>
                                    <div style={{ fontSize: '0.7rem', opacity: editData.characterId === char.id ? 1 : 0.6 }}>{char.name}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    {/* Weight Card */}
                    <div className="glass-card" style={{ padding: '1.2rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem', opacity: 0.7 }}>
                            <Scale size={18} className="neon-text-green" />
                            <span style={{ fontSize: '0.9rem' }}>체중</span>
                        </div>
                        {isEditing ? (
                            <input
                                type="number"
                                step="0.1"
                                value={editData.weight}
                                onChange={(e) => setEditData({ ...editData, weight: parseFloat(e.target.value) })}
                                className="neon-input"
                                style={{ width: '100%', fontSize: '1.2rem' }}
                            />
                        ) : (
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{profile.weight}<span style={{ fontSize: '0.9rem', opacity: 0.5, marginLeft: '0.3rem' }}>kg</span></div>
                        )}
                    </div>

                    {/* Height Card */}
                    <div className="glass-card" style={{ padding: '1.2rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem', opacity: 0.7 }}>
                            <Ruler size={18} className="neon-text-blue" />
                            <span style={{ fontSize: '0.9rem' }}>신장</span>
                        </div>
                        {isEditing ? (
                            <input
                                type="number"
                                value={editData.height}
                                onChange={(e) => setEditData({ ...editData, height: parseFloat(e.target.value) })}
                                className="neon-input"
                                style={{ width: '100%', fontSize: '1.2rem' }}
                            />
                        ) : (
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{profile.height}<span style={{ fontSize: '0.9rem', opacity: 0.5, marginLeft: '0.3rem' }}>cm</span></div>
                        )}
                    </div>

                    {/* Goal Card */}
                    <div className="glass-card" style={{ gridColumn: 'span 2', padding: '1.2rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem', opacity: 0.7 }}>
                            <Target size={18} className="neon-text-purple" />
                            <span style={{ fontSize: '0.9rem' }}>런너님의 질주 목표</span>
                        </div>
                        {isEditing ? (
                            <textarea
                                value={editData.goal}
                                onChange={(e) => setEditData({ ...editData, goal: e.target.value })}
                                className="neon-input"
                                style={{ width: '100%', height: '60px', resize: 'none' }}
                            />
                        ) : (
                            <div style={{ fontSize: '1.1rem', fontStyle: 'italic', color: 'var(--electric-blue)' }}>"{profile.goal}"</div>
                        )}
                    </div>
                </div>

                <div style={{ marginTop: '1.5rem', padding: '1.2rem', background: 'rgba(189,0,255,0.05)', borderRadius: '16px', borderLeft: '4px solid var(--vibrant-purple)', boxShadow: 'var(--inner-light)' }}>
                    <p style={{ fontSize: '0.95rem', color: 'var(--vibrant-purple)', fontWeight: 'bold', fontFamily: 'Outfit, sans-serif' }}>✨ 영자 실장의 분석 :</p>
                    <p style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: '0.3rem' }}>
                        {profile.weight && profile.height ?
                            `체질량 지수(BMI) 기반으로 볼 때, 현재 매우 건강한 질주 베이스를 갖추고 계십니다. 런너님의 ${profile.weight}kg 무게는 질주 시 지면 반발력을 극대화하기에 최적입니다.` :
                            "런너님의 상세 정보를 입력해 주시면 더욱 정밀한 영자 분석 리포트를 제공해 드릴 수 있습니다."}
                    </p>
                </div>

                {/* 시스템 연동 테스트 버튼 (v12.0) */}
                <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                    <button
                        onClick={onForceSaveTest}
                        className="glass-button"
                        style={{
                            width: '100%',
                            padding: '1rem',
                            background: 'rgba(0, 209, 255, 0.1)',
                            border: '1px dashed var(--electric-blue)',
                            color: 'var(--electric-blue)',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.8rem',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0, 209, 255, 0.2)'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0, 209, 255, 0.1)'}
                    >
                        <ShieldCheck size={20} /> 시스템 연동 테스트 (정보 강제 입력 확인)
                    </button>
                </div>

                {/* 계정 관리 섹션 (신규) */}
                <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: 'rgba(0,209,255,0.03)', borderRadius: '12px', border: '1px solid rgba(0,209,255,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                        <ShieldCheck size={20} className="neon-text-blue" />
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0, fontFamily: 'Outfit, sans-serif' }}>런매직 공식 인증 계정</h3>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '10px' }}>
                        <div>
                            <p style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: '2px' }}>연결된 이메일</p>
                            <p style={{ fontSize: '1rem', color: 'var(--electric-blue)', fontWeight: 'bold' }}>{profile.id.includes('@') ? profile.id : "정식 로그인 상태 🫡"}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: '2px' }}>데이터베이스 상태</p>
                            <p style={{ fontSize: '0.9rem', color: 'var(--neon-green)' }}>● 구름 요새 연결됨</p>
                        </div>
                    </div>

                    {/* v13.4: Cloud Diagnostic HUD (영자실장 정밀 진단기 - Premium) */}
                    <div style={{
                        marginTop: '1.5rem',
                        padding: '1.5rem',
                        background: 'rgba(0, 10, 20, 0.6)',
                        borderRadius: '20px',
                        border: '1px solid rgba(0, 209, 255, 0.3)',
                        boxShadow: '0 0 20px rgba(0, 209, 255, 0.1)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {/* Decorative Gradient Glow */}
                        <div style={{
                            position: 'absolute',
                            top: '-20%',
                            left: '-20%',
                            width: '60%',
                            height: '60%',
                            background: 'radial-gradient(circle, rgba(0, 209, 255, 0.15) 0%, transparent 70%)',
                            pointerEvents: 'none'
                        }} />

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                            <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--electric-blue)', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold', fontFamily: 'Outfit, sans-serif' }}>
                                <ShieldCheck size={18} /> 클라우드 연동 정밀 진단
                            </h4>
                            {onRefreshData && (
                                <button
                                    onClick={() => {
                                        const btn = document.getElementById('refresh-icon');
                                        if (btn) btn.classList.add('spin-animation');
                                        onRefreshData();
                                        setTimeout(() => {
                                            if (btn) btn.classList.remove('spin-animation');
                                        }, 1000);
                                    }}
                                    className="glass-button"
                                    style={{
                                        padding: '6px 12px',
                                        fontSize: '0.75rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        background: 'rgba(0, 209, 255, 0.1)',
                                        border: '1px solid rgba(0, 209, 255, 0.3)',
                                        borderRadius: '10px'
                                    }}
                                >
                                    <RefreshCw id="refresh-icon" size={14} /> 강제 새로고침
                                </button>
                            )}
                        </div>

                        <div style={{ display: 'grid', gap: '1rem', fontSize: '0.85rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <span style={{ opacity: 0.5 }}>기기 식별 UUID</span>
                                <span style={{ fontFamily: 'monospace', color: 'var(--neon-green)', letterSpacing: '1px' }}>
                                    {profile.id.substring(0, 8)}...{profile.id.substring(profile.id.length - 4)}
                                </span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <span style={{ opacity: 0.5 }}>보관된 기록</span>
                                <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--electric-blue)' }}>
                                    {recordCount || 0} <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>sessions</span>
                                </span>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginTop: '0.4rem' }}>
                                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.8rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <p style={{ fontSize: '0.7rem', opacity: 0.4, marginBottom: '4px' }}>통신 상태</p>
                                    <p style={{
                                        color: syncStatus?.status?.includes('SUCCESS') ? 'var(--neon-green)' : (syncStatus?.status === 'IDLE' ? 'white' : '#FF4B4B'),
                                        fontWeight: 'bold',
                                        fontSize: '0.9rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '5px'
                                    }}>
                                        <div style={{
                                            width: '6px',
                                            height: '6px',
                                            borderRadius: '50%',
                                            background: syncStatus?.status?.includes('SUCCESS') ? 'var(--neon-green)' : (syncStatus?.status === 'IDLE' ? '#ccc' : '#FF4B4B'),
                                            boxShadow: syncStatus?.status?.includes('SUCCESS') ? '0 0 8px var(--neon-green)' : 'none'
                                        }} />
                                        {syncStatus?.status || 'STANDBY'}
                                    </p>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.8rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <p style={{ fontSize: '0.7rem', opacity: 0.4, marginBottom: '4px' }}>마지막 동기화</p>
                                    <p style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{syncStatus?.time || '-'}</p>
                                </div>
                            </div>

                            <div style={{
                                fontSize: '0.75rem',
                                opacity: 0.5,
                                padding: '0.8rem',
                                background: 'rgba(0,0,0,0.3)',
                                borderRadius: '10px',
                                border: '1px solid rgba(255,255,255,0.03)',
                                lineHeight: '1.4'
                            }}>
                                <span style={{ color: 'var(--electric-blue)', fontWeight: 'bold' }}>📡 시스템 메시지:</span> {syncStatus?.message || '대기 중...'}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ProfileSection;
