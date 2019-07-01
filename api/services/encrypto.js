const crypto = require('crypto');

// Refer this link for ==> https://nodejs.org/api/crypto.html#crypto_crypto

const { CRYPTO_PASSWORD, CRYPTO_SALT } = process.env;

const key = crypto.scryptSync(CRYPTO_PASSWORD, CRYPTO_SALT, 24);
const iv = Buffer.alloc(16, 0);

const crypt = plainText => {
    const cipher = crypto.createCipheriv('aes-192-cbc', key, iv);
    let encrypted = cipher.update(plainText, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    // console.log(encrypted);
    return encrypted;
}

const dcrypt = cipherText => {
    const decipher = crypto.createDecipheriv('aes-192-cbc', key, iv);
    let decrypted = decipher.update(cipherText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    // console.log(decrypted);
    return decrypted;
}

module.exports = { crypt, dcrypt };
