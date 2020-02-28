import { signTransaction, getPublicKey } from './index';
import { prepareTransaction } from './sign';
import { derivePath } from './utils';
import * as eded25519 from 'ed25519-hd-key';
import { TransferTransaction } from '@liskhq/lisk-transactions'

const path = "m/44'/134'/0'/0'/0'";
const hexSeed = '06bae687f0250ab9533be2ac9717ae2a802d69c97d547c2e862e66e05453b165cf3e06a649c826a6db3b702644dc1c9154ad3b4188b8c15848d83a87c1c48eca';
const networkIdentifier = 'e48feb88db5b5cf5ad71d93cdcd1d879b6d5ed187a36b0002cc34e0ef9883255';
const tx = new TransferTransaction({ networkIdentifier });

describe('Main module', () => {
    describe('signTransaction', () => {
        beforeEach(() => {
            prepareTransaction = jest.fn(() => tx);
        });
        afterEach(() => {
            prepareTransaction.mockRestore();
        });

        it('should add senderPublicKey field to transaction if it not exist', () => {
            const signedTransaction = signTransaction(hexSeed, path, tx);
            expect(signedTransaction.senderPublicKey).toBeDefined();
        });

        it('should convert ed25519 32 byte -> NaCL 64 byte private key', () => {
            const { key } = derivePath(path, hexSeed);
            const publicKey = eded25519.getPublicKey(key, false);
            signTransaction(hexSeed, path, tx);
            expect(prepareTransaction).toBeCalledWith(
                Object.assign(tx, { _senderPublicKey: publicKey.toString('hex')}),
                Buffer.concat([key, publicKey])
            );
        });
    });
    describe('getPublicKey', () => {
        beforeAll(() => {
            (eded25519.getPublicKey as any) = jest.fn();
        });
        afterAll(() => {
            (eded25519.getPublicKey as any).mockRestore();
        });

        it('should call eded25519 getPublicKey method', () => {
            getPublicKey(path, hexSeed);
            expect(eded25519.getPublicKey).toBeCalled();
        });
    });
});
