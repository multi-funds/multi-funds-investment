import * as bip39 from 'bip39';
import * as bitcoin from 'bitcoinjs-lib';
import { BIP32Factory } from 'bip32';
import * as ecc from 'tiny-secp256k1';

const bip32 = BIP32Factory(ecc);

/**
 * Validates a BIP39 mnemonic recovery phrase.
 * @param mnemonic - Space-separated 12 or 24-word mnemonic phrase
 * @returns true if valid, false otherwise
 */
export function validateMnemonic(mnemonic: string): boolean {
    return bip39.validateMnemonic(mnemonic.trim().toLowerCase());
}

/**
 * Derives a Bitcoin mainnet address from a BIP39 mnemonic phrase
 * using BIP84 derivation path (native SegWit / bech32 addresses).
 *
 * Derivation path: m/84'/0'/0'/0/0
 *
 * @param mnemonic - The 12 or 24-word BIP39 mnemonic
 * @returns The derived Bitcoin address (bech32 format)
 */
export async function deriveAddressFromMnemonic(mnemonic: string): Promise<string> {
    const normalised = mnemonic.trim().toLowerCase();
    if (!bip39.validateMnemonic(normalised)) {
        throw new Error('Invalid mnemonic phrase');
    }

    const seed = await bip39.mnemonicToSeed(normalised);
    const root = bip32.fromSeed(seed, bitcoin.networks.bitcoin);

    // BIP84: m/84'/0'/0'/0/0 (native SegWit – P2WPKH)
    const child = root.derivePath("m/84'/0'/0'/0/0");
    const { address } = bitcoin.payments.p2wpkh({
        pubkey: Buffer.from(child.publicKey),
        network: bitcoin.networks.bitcoin,
    });

    if (!address) {
        throw new Error('Failed to derive wallet address');
    }
    return address;
}
