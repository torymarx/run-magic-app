
import React, { useState } from 'react';
import { User, Scale, Ruler, Target, Edit3, Save, X } from 'lucide-react';
import { UserProfile } from '../../hooks/useProfileManager';

interface ProfileSectionProps {
    profile: UserProfile;
    onUpdate: (updates: Partial<UserProfile>) => void;
    isLoading: boolean;
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

const ProfileSection: React.FC<ProfileSectionProps> = ({ profile, onUpdate, onClose }) => {
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
                position: 'relative',
                overflow: 'hidden',
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
                                <h2 className="neon-text-blue" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{profile.name} {profile.name === '런너님' ? '' : '런너님'}</h2>
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
                            <p style={{ fontSize: '0.9rem', opacity: 0.8, margin: 0 }}>나에게 맞는 코다리 캐릭터 선택:</p>
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

                {/* 영자 실장의 한마디 */}
                <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(189,0,255,0.05)', borderRadius: '12px', borderLeft: '4px solid var(--vibrant-purple)' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--vibrant-purple)', fontWeight: 'bold' }}>✨ 영자 실장의 분석 :</p>
                    <p style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: '0.3rem' }}>
                        {profile.weight && profile.height ?
                            `체질량 지수(BMI) 기반으로 볼 때, 현재 매우 건강한 질주 베이스를 갖추고 계십니다. 런너님의 ${profile.weight}kg 무게는 질주 시 지면 반발력을 극대화하기에 최적입니다.` :
                            "런너님의 상세 정보를 입력해 주시면 더욱 정밀한 영자 분석 리포트를 제공해 드릴 수 있습니다."}
                    </p>
                </div>
            </section>
        </div>
    );
};

export default ProfileSection;
