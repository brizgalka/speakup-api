"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const PassPhrase = process.env.RSA_PassPhrase;
const Bits = Number(process.env.RSA_Bits);
class RSA_Manager {
    static encryptWithRSA(input, publicKey) {
        const buffer = Buffer.from(input, 'utf-8');
        const encrypted = (0, crypto_1.publicEncrypt)(publicKey, buffer);
        return encrypted.toString("base64");
    }
    static decryptWithRSA(input, privatekey) {
        const buffer = Buffer.from(input, 'base64');
        const decrypted = (0, crypto_1.privateDecrypt)({
            key: privatekey,
            passphrase: PassPhrase,
        }, buffer);
        return decrypted.toString("utf8");
    }
    static generateKey() {
        return (0, crypto_1.generateKeyPairSync)('rsa', {
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
    static privateKeyToString(privateKey) {
        return privateKey.split("\n").slice(1, 17).join();
    }
    static publicKeyToString(publicKey) {
        return publicKey.split("\n").slice(1, 5).join();
    }
}
exports.default = RSA_Manager;
//# sourceMappingURL=RSA_Manager.js.map