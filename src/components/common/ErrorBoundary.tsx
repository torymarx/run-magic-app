import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    padding: '2rem',
                    textAlign: 'center',
                    background: 'rgba(10, 10, 12, 0.95)',
                    color: 'white',
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontFamily: 'sans-serif'
                }}>
                    <img
                        src="https://raw.githubusercontent.com/wonseokjung/solopreneur-ai-agents/main/agents/kodari/assets/kodari_panic.png"
                        alt="당황한 코다리"
                        style={{ width: '150px', marginBottom: '1.5rem' }}
                    />
                    <h1 style={{ color: '#00D1FF' }}>충성! 긴급 상황 발생!</h1>
                    <p style={{ opacity: 0.8, marginBottom: '2rem' }}>
                        런너님, 죄송합니다! 앱 엔진에 일시적인 정지 오류가 발생했습니다.<br />
                        이 코다리 부장이 즉시 보고서를 작성하고 복구를 시도하고 있습니다.
                    </p>
                    <div style={{
                        background: 'rgba(255, 75, 75, 0.1)',
                        padding: '1rem',
                        borderRadius: '8px',
                        border: '1px solid #FF4B4B',
                        marginBottom: '2rem',
                        fontSize: '0.8rem',
                        textAlign: 'left',
                        maxWidth: '500px'
                    }}>
                        <code>{this.state.error?.toString()}</code>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            padding: '0.8rem 2rem',
                            background: 'linear-gradient(135deg, #00D1FF, #00FF85)',
                            border: 'none',
                            borderRadius: '30px',
                            color: 'black',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            fontSize: '1rem'
                        }}
                    >
                        시스템 재가동 (새로고침)
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
