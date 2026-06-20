import React, { useState, useEffect } from 'react';
import { X, Trophy, Calendar, ArrowUpRight, Zap, Activity, ChevronRight } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

interface Transaction {
    id: number;
    amount: number;
    type: string;
    description: string;
    reference_id: string;
    created_at: string;
}

interface PointHistoryModalProps {
    userId: string;
    onClose: () => void;
    totalPoints: number;
}

const TYPE_MAP: Record<string, { label: string; color: string; bg: string }> = {
    RUN:        { label: '러닝',   color: '#00D1FF', bg: 'rgba(0,209,255,0.12)' },
    MEDAL:      { label: '메달',   color: '#FFD700', bg: 'rgba(255,215,0,0.12)' },
    DAILY_QUEST:{ label: '퀘스트', color: '#39FF14', bg: 'rgba(57,255,20,0.12)' },
    ATTENDANCE: { label: '출석',   color: '#BD00FF', bg: 'rgba(189,0,255,0.12)' },
};

const getTypeIcon = (type: string) => {
    switch (type) {
        case 'MEDAL':       return <Trophy size={15} />;
        case 'RUN':         return <Activity size={15} />;
        case 'DAILY_QUEST': return <ChevronRight size={15} />;
        case 'ATTENDANCE':  return <Calendar size={15} />;
        default:            return <Zap size={15} />;
    }
};

const PointHistoryModal: React.FC<PointHistoryModalProps> = ({ userId, onClose, totalPoints }) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!userId) return;
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('point_transactions')
                    .select('*')
                    .eq('user_id', userId)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setTransactions(data || []);
            } catch (err) {
                console.error('Failed to fetch point history:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [userId]);

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.75)',
            zIndex: 1100,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '1rem',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '520px',
                height: '82vh',
                display: 'flex',
                flexDirection: 'column',
                background: 'rgba(18, 18, 20, 0.96)',
                border: '0.5px solid rgba(255,255,255,0.1)',
                borderRadius: '28px',
                overflow: 'hidden',
                boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
                animation: 'slideUp 0.3s ease-out'
            }}>

                {/* ── 헤더 ── */}
                <div style={{
                    padding: '1.4rem 1.6rem',
                    borderBottom: '0.5px solid rgba(255,255,255,0.07)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div>
                        <div style={{ fontSize: '0.7rem', opacity: 0.4, fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '2px' }}>
                            Run-Magic
                        </div>
                        <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700', letterSpacing: '-0.5px', color: 'white' }}>
                            누적 포인트 상세
                        </h2>
                    </div>
                    <button onClick={onClose} style={{
                        background: 'rgba(255,255,255,0.07)',
                        border: 'none',
                        cursor: 'pointer',
                        width: '34px', height: '34px',
                        borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white',
                        transition: 'background 0.2s'
                    }}>
                        <X size={16} />
                    </button>
                </div>

                {/* ── 요약 카드 ── */}
                <div style={{
                    padding: '1.2rem 1.6rem',
                    borderBottom: '0.5px solid rgba(255,255,255,0.07)',
                    display: 'flex',
                    gap: '1rem'
                }}>
                    {/* 현재 포인트 */}
                    <div style={{
                        flex: 1,
                        background: 'rgba(0,209,255,0.07)',
                        border: '0.5px solid rgba(0,209,255,0.2)',
                        borderRadius: '18px',
                        padding: '1rem 1.2rem'
                    }}>
                        <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)', fontWeight: '600', marginBottom: '6px' }}>
                            현재 포인트
                        </div>
                        <div style={{ fontSize: '1.7rem', fontWeight: '800', color: '#00D1FF', letterSpacing: '-0.5px', lineHeight: 1 }}>
                            {totalPoints.toLocaleString()}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>
                            Run Points
                        </div>
                    </div>

                    {/* 포인트 입력수 */}
                    <div style={{
                        flex: 1,
                        background: 'rgba(57,255,20,0.05)',
                        border: '0.5px solid rgba(57,255,20,0.15)',
                        borderRadius: '18px',
                        padding: '1rem 1.2rem'
                    }}>
                        <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)', fontWeight: '600', marginBottom: '6px' }}>
                            포인트 입력수
                        </div>
                        <div style={{ fontSize: '1.7rem', fontWeight: '800', color: '#39FF14', letterSpacing: '-0.5px', lineHeight: 1 }}>
                            {loading ? '—' : transactions.length}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>
                            건의 기록
                        </div>
                    </div>
                </div>

                {/* ── 거래 목록 ── */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem 0' }}>
                    {loading ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '0.8rem', opacity: 0.4 }}>
                            <Zap size={28} />
                            <span style={{ fontSize: '0.9rem' }}>포인트 내역을 불러오는 중...</span>
                        </div>
                    ) : transactions.length === 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '0.8rem', opacity: 0.3 }}>
                            <Activity size={36} />
                            <p style={{ fontSize: '0.9rem', margin: 0 }}>포인트 내역이 없습니다.</p>
                        </div>
                    ) : (
                        <div>
                            {transactions.map((tx) => {
                                const meta = TYPE_MAP[tx.type] || { label: tx.type, color: '#aaa', bg: 'rgba(255,255,255,0.05)' };
                                return (
                                    <div key={tx.id} style={{
                                        padding: '0.9rem 1.6rem',
                                        borderBottom: '0.5px solid rgba(255,255,255,0.04)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        transition: 'background 0.15s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.025)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                    >
                                        {/* 타입 아이콘 */}
                                        <div style={{
                                            width: '36px', height: '36px',
                                            background: meta.bg,
                                            borderRadius: '12px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: meta.color,
                                            flexShrink: 0
                                        }}>
                                            {getTypeIcon(tx.type)}
                                        </div>

                                        {/* 설명 */}
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{
                                                fontSize: '0.87rem',
                                                fontWeight: '600',
                                                color: 'rgba(255,255,255,0.88)',
                                                marginBottom: '3px',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}>
                                                {tx.description}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <span style={{
                                                    fontSize: '0.62rem',
                                                    background: meta.bg,
                                                    color: meta.color,
                                                    padding: '1px 6px',
                                                    borderRadius: '6px',
                                                    fontWeight: '700'
                                                }}>
                                                    {meta.label}
                                                </span>
                                                <span style={{ fontSize: '0.68rem', opacity: 0.3 }}>
                                                    {new Date(tx.created_at).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                                                </span>
                                            </div>
                                        </div>

                                        {/* 포인트 */}
                                        <div style={{
                                            fontSize: '1rem',
                                            fontWeight: '800',
                                            color: tx.amount > 0 ? '#39FF14' : '#ff4b2b',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '2px',
                                            flexShrink: 0
                                        }}>
                                            {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()}
                                            {tx.amount > 0 && <ArrowUpRight size={13} />}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* ── 푸터 ── */}
                <div style={{
                    padding: '0.9rem 1.6rem',
                    borderTop: '0.5px solid rgba(255,255,255,0.05)',
                    background: 'rgba(0,0,0,0.15)',
                    fontSize: '0.68rem',
                    textAlign: 'center',
                    color: 'rgba(255,255,255,0.2)'
                }}>
                    포인트는 러닝·메달·퀘스트 완료 시 자동으로 누적됩니다.
                </div>
            </div>
        </div>
    );
};

export default PointHistoryModal;
