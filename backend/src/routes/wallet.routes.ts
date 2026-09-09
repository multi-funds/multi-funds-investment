import { Router, Request, Response } from 'express';
import { Pool } from 'pg';
import { validateMnemonic, deriveAddressFromMnemonic } from '../services/wallet.service';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';

const router = Router();
const pool = new Pool();

/**
 * POST /wallet/recover
 *
 * Recovers a wallet using a BIP39 mnemonic recovery phrase.
 * Validates the phrase, derives the Bitcoin address, then looks up
 * (or creates) the associated wallet record and returns the balance.
 *
 * Body: { mnemonic: string }
 * Auth: Bearer JWT required
 */
router.post('/recover', authenticate, async (req: AuthRequest, res: Response) => {
    const { mnemonic } = req.body;

    if (!mnemonic) {
        return res.status(400).json({ success: false, error: 'Recovery phrase is required' });
    }

    if (!validateMnemonic(mnemonic)) {
        return res.status(400).json({ success: false, error: 'Invalid recovery phrase. Please provide a valid 12 or 24-word BIP39 mnemonic.' });
    }

    try {
        const walletAddress = await deriveAddressFromMnemonic(mnemonic);
        const userId = req.user!.id;

        // Look up or create the wallet for this user/address combination
        const existing = await pool.query(
            'SELECT id, balance, wallet_address FROM wallets WHERE user_id = $1',
            [userId]
        );

        let balance: number;
        if (existing.rows.length > 0) {
            const wallet = existing.rows[0];
            // Update the wallet address if it changed (new recovery phrase imported)
            if (wallet.wallet_address !== walletAddress) {
                await pool.query(
                    'UPDATE wallets SET wallet_address = $1, updated_at = NOW() WHERE user_id = $2',
                    [walletAddress, userId]
                );
            }
            balance = parseFloat(wallet.balance);
        } else {
            // Create a new wallet record linked to the recovered address
            const result = await pool.query(
                'INSERT INTO wallets (user_id, wallet_address, balance) VALUES ($1, $2, 0) RETURNING id, balance',
                [userId, walletAddress]
            );
            balance = parseFloat(result.rows[0].balance);
        }

        return res.json({
            success: true,
            wallet: {
                address: walletAddress,
                balance,
            },
        });
    } catch (error: any) {
        console.error('[wallet/recover] Error:', error);
        return res.status(500).json({ success: false, error: 'Wallet recovery failed. Please try again.' });
    }
 *
 * Returns the current balance for the authenticated user's wallet.
 * Auth: Bearer JWT required
 */
router.get('/balance', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const result = await pool.query(
            'SELECT balance, wallet_address FROM wallets WHERE user_id = $1',
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Wallet not found for this user' });
        }

        const { balance, wallet_address } = result.rows[0];
        return res.json({
            success: true,
            wallet: {
                address: wallet_address,
                balance: parseFloat(balance),
            },
        });
    } catch (error: any) {
        console.error('[wallet/balance] Error:', error);
        return res.status(500).json({ success: false, error: 'Failed to retrieve wallet balance. Please try again.' });
    }
});

export default router;
