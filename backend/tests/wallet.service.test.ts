import { validateMnemonic, deriveAddressFromMnemonic } from '../src/services/wallet.service';

// Well-known BIP39 test vectors
const VALID_MNEMONIC_12 =
    'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
// Expected BIP84 m/84'/0'/0'/0/0 address for the above mnemonic
const EXPECTED_ADDRESS_12 = 'bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu';

const VALID_MNEMONIC_24 =
    'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon ' +
    'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon art';

const INVALID_MNEMONIC_WRONG_WORD = 'notaword abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
const INVALID_MNEMONIC_WRONG_CHECKSUM = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon';

describe('validateMnemonic', () => {
    it('returns true for a valid 12-word mnemonic', () => {
        expect(validateMnemonic(VALID_MNEMONIC_12)).toBe(true);
    });

    it('returns true for a valid 24-word mnemonic', () => {
        expect(validateMnemonic(VALID_MNEMONIC_24)).toBe(true);
    });

    it('returns false for a mnemonic with an invalid word', () => {
        expect(validateMnemonic(INVALID_MNEMONIC_WRONG_WORD)).toBe(false);
    });

    it('returns false for a mnemonic with a wrong checksum', () => {
        expect(validateMnemonic(INVALID_MNEMONIC_WRONG_CHECKSUM)).toBe(false);
    });

    it('returns false for an empty string', () => {
        expect(validateMnemonic('')).toBe(false);
    });

    it('is case-insensitive (mixed case input is normalised)', () => {
        expect(validateMnemonic(VALID_MNEMONIC_12.toUpperCase())).toBe(true);
    });

    it('trims leading/trailing whitespace', () => {
        expect(validateMnemonic('  ' + VALID_MNEMONIC_12 + '  ')).toBe(true);
    });
});

describe('deriveAddressFromMnemonic', () => {
    it('derives the correct BIP84 address for the all-abandon mnemonic', async () => {
        const address = await deriveAddressFromMnemonic(VALID_MNEMONIC_12);
        expect(address).toBe(EXPECTED_ADDRESS_12);
    });

    it('returns a bech32 address starting with bc1', async () => {
        const address = await deriveAddressFromMnemonic(VALID_MNEMONIC_12);
        expect(address).toMatch(/^bc1/);
    });

    it('returns the same address on repeated calls (deterministic)', async () => {
        const address1 = await deriveAddressFromMnemonic(VALID_MNEMONIC_12);
        const address2 = await deriveAddressFromMnemonic(VALID_MNEMONIC_12);
        expect(address1).toBe(address2);
    });

    it('throws for an invalid mnemonic', async () => {
        await expect(deriveAddressFromMnemonic(INVALID_MNEMONIC_WRONG_CHECKSUM)).rejects.toThrow(
            'Invalid mnemonic phrase'
        );
    });

    it('throws for an empty string', async () => {
        await expect(deriveAddressFromMnemonic('')).rejects.toThrow('Invalid mnemonic phrase');
    });
});
