'use client';

import React, { useState } from 'react';

/**
 * WalletRecoveryPage
 *
 * Allows a user to import their existing Bitcoin wallet using a BIP39
 * recovery phrase (12 or 24 words). The phrase is validated on the
 * backend, which derives the deterministic wallet address and returns
 * the confirmed balance.
 */
const WalletRecoveryPage = () => {
    const [mnemonic, setMnemonic] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [wallet, setWallet] = useState<{ address: string; balance: number } | null>(null);

    const handleRecover = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setWallet(null);

        const words = mnemonic.trim().split(/\s+/);
        if (words.length !== 12 && words.length !== 24) {
            setError('Recovery phrase must be exactly 12 or 24 words.');
            return;
        }

        setLoading(true);
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            const response = await fetch('/api/wallet/recover', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({ mnemonic: mnemonic.trim().toLowerCase() }),
            });

            const data = await response.json();
            if (!data.success) {
                setError(data.error || 'Recovery failed. Please check your phrase and try again.');
            } else {
                setWallet(data.wallet);
            }
        } catch {
            setError('Network error. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 480, margin: '40px auto', padding: '0 16px' }}>
            <h1>Recover Wallet</h1>
            <p>
                Enter your 12 or 24-word BIP39 recovery phrase to restore your wallet and confirm
                your balance.
            </p>
            <form onSubmit={handleRecover}>
                <div style={{ marginBottom: 16 }}>
                    <label htmlFor="mnemonic" style={{ display: 'block', marginBottom: 4 }}>
                        Recovery Phrase
                    </label>
                    <textarea
                        id="mnemonic"
                        value={mnemonic}
                        onChange={(e) => setMnemonic(e.target.value)}
                        placeholder="word1 word2 word3 … word12"
                        rows={4}
                        required
                        style={{ width: '100%', padding: 8, fontFamily: 'monospace' }}
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit" disabled={loading} style={{ padding: '10px 24px' }}>
                    {loading ? 'Recovering…' : 'Recover Wallet'}
                </button>
            </form>

            {wallet && (
                <div
                    style={{
                        marginTop: 24,
                        padding: 16,
                        border: '1px solid #4caf50',
                        borderRadius: 4,
                        background: '#f0fff4',
                    }}
                    data-testid="wallet-result"
                >
                    <h2 style={{ color: '#2e7d32' }}>Wallet Recovered</h2>
                    <p>
                        <strong>Address:</strong>
                        <br />
                        <code style={{ wordBreak: 'break-all' }}>{wallet.address}</code>
                    </p>
                    <p>
                        <strong>Balance:</strong> {wallet.balance.toFixed(8)} BTC
                    </p>
                </div>
            )}
        </div>
    );
};

export default WalletRecoveryPage;
