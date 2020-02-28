import * as cryptography from '@liskhq/lisk-cryptography'
import { BaseTransaction, utils, TransferTransaction } from '@liskhq/lisk-transactions'
import { signTransaction, prepareTransaction } from './';

const transactionHash = '0x8';
const privateKey = Buffer.from('privateKey');
const networkIdentifier = 'e48feb88db5b5cf5ad71d93cdcd1d879b6d5ed187a36b0002cc34e0ef9883255';
const tx = new TransferTransaction({ networkIdentifier, senderPublicKey: 'efaf1d977897cb60d7db9d30e8fd668dee070ac0db1fb8d184c06152a8b75f8d' });

describe('Sign', () => {
    describe('signTransaction', () => {
        beforeAll(() => {
            cryptography.hash = jest.fn(() => transactionHash)
            cryptography.signDataWithPrivateKey = jest.fn();
        })
        it('should call lisk-cryptography hash method', () => {
            signTransaction(tx, privateKey);
            expect(cryptography.hash).toBeCalled();
        });

        it('should call lisk-cryptography signDataWithPrivateKey', () => {
            signTransaction(tx, privateKey);
            expect(cryptography.signDataWithPrivateKey).toBeCalledWith(transactionHash, privateKey)
        });
    });

    describe('prepareTransaction', () => {
        const signature = '9fc2b85879b6423893841343c1d8905f3b9118b7db96bbb589df771c35ce0d05ce446951ee827c76ed1a85951af40018a007a1663f1a43a50129a0e32f26cb03';
        const id = '123';
        beforeAll(() => {
            (signTransaction as any) = jest.fn(() => signature);
            utils.getId = jest.fn(() => id);
        });
        afterAll(() => {
            (signTransaction as any).mockRestore();
        })
        it('should call signTransaction', () => {
            prepareTransaction(tx, privateKey);
            expect(signTransaction).toBeCalledWith(tx, privateKey);
        });

        it('should call lisk-cryptography getId method', () => {
            prepareTransaction(tx, privateKey);
            expect(utils.getId).toBeCalledWith(tx.getBytes());
        });

        it('should return transaction with signature and id fields', () => {
            expect(prepareTransaction(tx, privateKey)).toEqual(Object.assign(tx, {_signature: signature, _id: id }));
        })
    });
});
