const crypto = require('crypto');

module.exports = class Cryptor {

    static genSalt(length = 32) {
        const symbols = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890"
        var result = "";
        for (let i = 0; i < length; i++) 
        {
            result += symbols.charAt(Math.floor(Math.random() * symbols.length));
        }
        return result
    }

    static hashPassword(password, salt = this.genSalt(process.env.SALT_LENGTH || 32)) {
        const hash = crypto
            .createHmac('sha512', salt)
            .update(password)
            .digest('hex');
        return {
            "hash": hash,
            "salt": salt
        };
    }
}