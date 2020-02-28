import {
  signDataWithPrivateKey,
  hexToBuffer,
  hash
} from "@liskhq/lisk-cryptography";
import { BaseTransaction, utils } from "@liskhq/lisk-transactions";

export const signTransaction = (
  transaction: BaseTransaction,
  privateKey: Buffer
): string => {
  const transactionWithNetworkIdentifierBytes = Buffer.concat([
    hexToBuffer(transaction["_networkIdentifier"]),
    transaction.getBytes()
  ]);
  return signDataWithPrivateKey(
    hash(transactionWithNetworkIdentifierBytes),
    privateKey
  );
};

export const prepareTransaction = (
  transaction: BaseTransaction,
  privateKey: Buffer
): BaseTransaction => {
  transaction["_signature"] = signTransaction(transaction, privateKey);
  transaction["_id"] = utils.getId(transaction.getBytes());
  return transaction;
};
