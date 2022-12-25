import {generateKeyPairSync, publicEncrypt, privateDecrypt, KeyLike, KeyPairSyncResult} from 'crypto'

const PassPhrase = process.env.RSA_PassPhrase
const Bits = Number(process.env.RSA_Bits);

export default class RSA_Manager {

    static encryptWithRSA(input: string, publicKey: KeyLike): string {
        const buffer = Buffer.from(input, 'utf-8');
        const encrypted = publicEncrypt(publicKey, buffer);
        return encrypted.toString("base64");
    }

    static decryptWithRSA(input: string, privatekey: KeyLike): string {
        const buffer = Buffer.from(input, 'base64');
        const decrypted = privateDecrypt(
            {
                key: privatekey,
                passphrase: PassPhrase,
            },
            buffer,
        )
        return decrypted.toString("utf8");
    }

    static generateKey(): KeyPairSyncResult<string, string> {
        return generateKeyPairSync('rsa', {
            modulusLength: Bits,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
                cipher: 'aes-256-cbc',
                passphrase: PassPhrase
            }
        });
    }

    static privateKeyToString(privateKey: string): string {
        return privateKey.split("\n").slice(1,17).join()
    }

    static publicKeyToString(publicKey: string): string {
        return publicKey.split("\n").slice(1,5).join()
    }
}