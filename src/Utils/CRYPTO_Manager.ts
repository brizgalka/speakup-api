import crypto from "crypto"

const algorithm = String(process.env.crypto_algorithm)

interface EncryptObject {
    iv: string,
    content: string
}

const genSecret = (size: number): string => {
    return crypto.randomBytes(size).toString("hex")
}

const encrypt = (text: string,  secretKey: string): EncryptObject => {
    const iv = crypto.randomBytes(16)

    const cipher = crypto.createCipheriv(algorithm, secretKey, iv)

    const encrypted = Buffer.concat([cipher.update(text), cipher.final()])

    return {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    }
}

const decrypt = (hash: EncryptObject, secretKey: string): string => {
    const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'))

    const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()])

    return decrpyted.toString()
}

export {
    encrypt,
    decrypt,
    genSecret
}