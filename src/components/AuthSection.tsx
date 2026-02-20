import React, { useState } from 'react';
import { Mail, Lock, Sparkles, ShieldCheck } from 'lucide-react';
import AuroraBackground from './layout/AuroraBackground';

interface AuthSectionProps {
    onSignIn: (email: string, password: string) => Promise<{ data: any; error: any }>;
    onSignUp: (email: string, password: string) => Promise<{ data: any; error: any }>;
    loading: boolean;
}

const AuthSection: React.FC<AuthSectionProps> = ({ onSignIn, onSignUp, loading }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);

        if (!email || !password) {
            setErrorMsg("이메일과 비밀번호를 입력해 주세요. 🫡");
            return;
        }

        if (!isLogin && password.length < 6) {
            setErrorMsg("비밀번호는 최소 6자 이상이어야 합니다. 🛡️");
            return;
        }

        console.log(`[Auth] Attempting ${isLogin ? 'Login' : 'SignUp'} for:`, email);
        const { data, error } = isLogin
            ? await onSignIn(email, password)
            : await onSignUp(email, password);

        if (error) {
            console.error(`[Auth] ${isLogin ? 'Login' : 'SignUp'} Error:`, error);
            let userFriendlyMsg = error.message || "연결 중 오류가 발생했습니다.";

            if (error.message === "Failed to fetch") {
                userFriendlyMsg = "서버에 연결할 수 없습니다. 📡\nVercel 대시보드에 환경 변수(URL/Key)가 정확히 등록되었는지 확인해 주세요!";
            }

            setErrorMsg(userFriendlyMsg);
        } else {
            console.log(`[Auth] ${isLogin ? 'Login' : 'SignUp'} Success!`);
            if (!isLogin && !data?.session) {
                // 회원가입 성공했으나 세션이 없는 경우 (이메일 인증 대기)
                alert("회원가입 성공! 📧\n입력하신 이메일함에서 인증 링크를 클릭해 주세요.\n인증 후 로그인이 가능합니다.");
                setIsLogin(true); // 로그인 화면으로 전환
            }
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 1000, padding: '1rem'
        }}>
            <AuroraBackground />

            <div className="glass-card" style={{
                width: '100%', maxWidth: '450px', padding: '2.5rem',
                border: '1px solid rgba(0, 209, 255, 0.2)',
                boxShadow: '0 0 40px rgba(0, 209, 255, 0.1)',
                textAlign: 'center'
            }}>
                <div style={{ marginBottom: '2rem' }}>
                    <div style={{
                        width: '60px', height: '60px', background: 'var(--vibrant-purple)',
                        borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center',
                        margin: '0 auto 1rem', boxShadow: '0 0 20px rgba(189, 0, 255, 0.4)'
                    }}>
                        <Sparkles size={30} color="white" />
                    </div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', letterSpacing: '-0.5px' }} className="neon-text-blue">
                        Run-Magic V2
                    </h1>
                    <p style={{ opacity: 0.7, fontSize: '0.9rem', marginTop: '0.5rem' }}>
                        {isLogin ? "런너님의 위대한 질주를 계속하세요 ✨" : "새로운 질주의 시작, 런매직에 합류하세요 🚀"}
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    <div style={{ position: 'relative' }}>
                        <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                        <input
                            type="email"
                            placeholder="이메일 주소"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="neon-input"
                            style={{ paddingLeft: '40px', width: '100%' }}
                            required
                        />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                        <input
                            type="password"
                            placeholder="비밀번호"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="neon-input"
                            style={{ paddingLeft: '40px', width: '100%' }}
                            required
                        />
                    </div>

                    {errorMsg && (
                        <p style={{ color: '#ff4b4b', fontSize: '0.85rem', textAlign: 'left', padding: '0 5px' }}>
                            ⚠️ {errorMsg}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="glass-button"
                        style={{
                            background: isLogin ? 'var(--vibrant-purple)' : 'var(--neon-green)',
                            color: isLogin ? 'white' : 'black',
                            padding: '1rem', fontWeight: 'bold', fontSize: '1rem',
                            marginTop: '0.5rem'
                        }}
                    >
                        {loading ? "질주 준비 중..." : (isLogin ? "질주 시작 (로그인)" : "합류하기 (회원가입)")}
                    </button>
                </form>

                <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <p style={{ fontSize: '0.9rem', opacity: 0.6 }}>
                        {isLogin ? "처음 오셨나요?" : "이미 계정이 있으신가요?"}
                        <button
                            onClick={() => { setIsLogin(!isLogin); setErrorMsg(null); }}
                            style={{
                                background: 'none', border: 'none', color: 'var(--electric-blue)',
                                fontWeight: 'bold', marginLeft: '0.5rem', cursor: 'pointer',
                                textDecoration: 'underline'
                            }}
                        >
                            {isLogin ? "회원가입하기" : "로그인하기"}
                        </button>
                    </p>
                </div>

                <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', opacity: 0.4, fontSize: '0.75rem' }}>
                    <ShieldCheck size={14} />
                    <span>Supabase 정식 보안 데이터베이스 연동됨</span>
                </div>
            </div>
        </div>
    );
};

export default AuthSection;
