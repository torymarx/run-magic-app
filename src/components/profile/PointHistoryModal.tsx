import React, { useState, useEffect } from 'react';
import { X, Trophy, Calendar, ArrowUpRight, Wallet, History, ChevronRight } from 'lucide-react';
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
                console.error("Failed to fetch point history:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [userId]);

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'MEDAL': return <Trophy size={16} className="text-yellow-400" />;
            case 'RUN': return <ChevronRight size={16} className="text-blue-400" />;
            case 'ATTENDANCE': return <Calendar size={16} className="text-green-400" />;
            default: return <History size={16} className="text-gray-400" />;
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            zIndex: 1100,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '1rem',
            backdropFilter: 'blur(10px)'
        }}>
            <div className="profile-glass-card" style={{
                width: '100%',
                maxWidth: '550px',
                height: '80vh',
                display: 'flex',
                flexDirection: 'column',
                background: 'rgba(15, 20, 25, 0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '32px',
                overflow: 'hidden',
                animation: 'slideUp 0.4s ease-out'
            }}>
                {/* Header: Bank Book Style */}
                <div style={{
                    padding: '1.5rem 2rem',
                    background: 'linear-gradient(135deg, var(--electric-blue) 0%, #005f73 100%)',
                    color: 'black',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '900', letterSpacing: '-0.5px' }}>
                            마법 통장 (Point Ledger)
                        </h2>
                        <div style={{ fontSize: '0.8rem', opacity: 0.8, fontWeight: 'bold' }}>
                            RUN-MAGIC SPIRITUAL ASSETS
                        </div>
                    </div>
                    <button onClick={onClose} style={{
                        background: 'rgba(0,0,0,0.1)',
                        border: 'none',
                        cursor: 'pointer',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <X size={20} color="black" />
                    </button>
                </div>

                {/* Summary Row */}
                <div style={{
                    padding: '1.5rem 2rem',
                    background: 'rgba(255,255,255,0.03)',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            background: 'rgba(0, 209, 255, 0.1)',
                            borderRadius: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Wallet className="neon-text-blue" size={24} />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>현재 잔액 (Current Balance)</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--electric-blue)' }}>
                                {totalPoints.toLocaleString()} <span style={{ fontSize: '0.9rem' }}>XP</span>
                            </div>
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>총 거래수</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{transactions.length}건</div>
                    </div>
                </div>

                {/* Transaction List */}
                <div className="custom-scrollbar" style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '1rem 0'
                }}>
                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem', opacity: 0.5 }}>
                            데이터를 분석 중입니다...
                        </div>
                    ) : transactions.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '4rem 2rem', opacity: 0.4 }}>
                            <History size={48} style={{ marginBottom: '1rem' }} />
                            <p>아직 기록된 마법 거래가 없습니다.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {transactions.map((tx) => (
                                <div key={tx.id} style={{
                                    padding: '1rem 2rem',
                                    borderBottom: '1px solid rgba(255,255,255,0.03)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '15px',
                                    transition: 'background 0.2s',
                                    cursor: 'default'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    <div style={{
                                        width: '36px',
                                        height: '36px',
                                        background: 'rgba(255,255,255,0.05)',
                                        borderRadius: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {getTypeIcon(tx.type)}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '2px' }}>
                                            {tx.description}
                                        </div>
                                        <div style={{ fontSize: '0.7rem', opacity: 0.4, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Calendar size={10} /> {new Date(tx.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ 
                                            fontSize: '1.1rem', 
                                            fontWeight: '900', 
                                            color: tx.amount > 0 ? 'var(--neon-green)' : '#ff4b2b',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            justifyContent: 'flex-end'
                                        }}>
                                            {tx.amount > 0 ? '+' : ''}{tx.amount}
                                            <ArrowUpRight size={14} />
                                        </div>
                                        <div style={{ fontSize: '0.65rem', opacity: 0.3 }}>{tx.type}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div style={{
                    padding: '1rem 2rem',
                    background: 'rgba(0,0,0,0.2)',
                    fontSize: '0.7rem',
                    textAlign: 'center',
                    opacity: 0.4,
                    borderTop: '1px solid rgba(255,255,255,0.05)'
                }}>
                    모든 포인트는 마법진의 증명(Proof of Spirit)에 의해 기록됩니다.
                </div>
            </div>
        </div>
    );
};

export default PointHistoryModal;
