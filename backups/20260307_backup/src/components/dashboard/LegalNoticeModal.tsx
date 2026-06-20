
import React from 'react';
import { X, Shield, Scale, FileText, ExternalLink } from 'lucide-react';

interface LegalNoticeModalProps {
    onClose: () => void;
}

const LegalNoticeModal: React.FC<LegalNoticeModalProps> = ({ onClose }) => {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            zIndex: 2000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '1rem',
            backdropFilter: 'blur(10px)'
        }}>
            <div className="glass-card" style={{
                width: '100%',
                maxWidth: '700px',
                maxHeight: '85vh',
                overflowY: 'auto',
                position: 'relative',
                animation: 'slideUp 0.3s ease-out',
                padding: '2.5rem'
            }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1.5rem',
                        right: '1.5rem',
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                        opacity: 0.5
                    }}
                >
                    <X size={24} />
                </button>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div className="neon-border-blue" style={{
                        width: '60px', height: '60px', borderRadius: '50%',
                        display: 'flex', justifyContent: 'center', alignItems: 'center',
                        margin: '0 auto 1rem', background: 'rgba(0,209,255,0.1)'
                    }}>
                        <Shield size={30} className="neon-text-blue" />
                    </div>
                    <h2 className="neon-text-blue" style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>법적 고지 및 운영 정책</h2>
                    <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>Run-Magic 서비스 이용을 위한 공식 안내문입니다.</p>
                </div>

                <div style={{ display: 'grid', gap: '2rem' }}>
                    {/* Section 1: Developer Info */}
                    <section style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <Scale size={18} className="neon-text-green" /> 서비스 제공자 정보
                        </h3>
                        <div style={{ fontSize: '0.9rem', lineHeight: '1.6', opacity: 0.8 }}>
                            <p><strong>개발사:</strong> Naku Lab Studio (나쿠 랩 스튜디오)</p>
                            <p><strong>서비스 명칭:</strong> Run-Magic (런매직)</p>
                            <p><strong>목적:</strong> AI 기반 러닝 분석 및 코칭 서비스 제공</p>
                        </div>
                    </section>

                    {/* Section 2: Terms of Service Summary */}
                    <section>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <FileText size={18} className="neon-text-blue" /> 이용약관 요약
                        </h3>
                        <div style={{ fontSize: '0.85rem', lineHeight: '1.7', opacity: 0.7 }}>
                            <ul style={{ paddingLeft: '1.2rem' }}>
                                <li>본 서비스는 러닝 데이터 기록 및 분석을 위한 목적으로만 사용되어야 합니다.</li>
                                <li>사용자는 자신의 건강 상태를 고려하여 서비스를 이용해야 하며, 과도한 운동으로 인한 부상에 대해 개발사는 책임을 지지 않습니다.</li>
                                <li>서비스 내 제공되는 AI 코칭은 참고용이며, 전문적인 의료 진단을 대체할 수 없습니다.</li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 3: Privacy Policy Summary */}
                    <section>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <Shield size={18} className="neon-text-purple" /> 개인정보처리방침 요약
                        </h3>
                        <div style={{ fontSize: '0.85rem', lineHeight: '1.7', opacity: 0.7 }}>
                            <ul style={{ paddingLeft: '1.2rem' }}>
                                <li>수집된 러닝 기록 및 프로필 정보는 서비스 제공 및 개인별 분석 리포트 생성에만 사용됩니다.</li>
                                <li>모든 데이터는 Supabase 구름 요새(Cloud)를 통해 안전하게 암호화되어 관리됩니다.</li>
                                <li>사용자는 언제든지 자신의 계정을 삭제하거나 데이터 내보내기를 요청할 수 있습니다.</li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 4: Copyright */}
                    <div style={{ textAlign: 'center', marginTop: '1rem', padding: '1rem', borderTop: '0.5px solid rgba(255,255,255,0.1)', opacity: 0.5, fontSize: '0.8rem' }}>
                        <p>© 2026 Naku Lab Studio. All rights reserved.</p>
                        <p style={{ marginTop: '0.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                            Designed with Aura Visual System <ExternalLink size={10} />
                        </p>
                    </div>
                </div>

                <div style={{ marginTop: '2.5rem' }}>
                    <button
                        onClick={onClose}
                        className="glass-button"
                        style={{ width: '100%', padding: '1rem', background: 'var(--electric-blue)', color: 'black', fontWeight: 'bold' }}
                    >
                        내용을 확인했습니다
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LegalNoticeModal;
