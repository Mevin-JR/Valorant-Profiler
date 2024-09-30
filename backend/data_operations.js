const bcrypt = require('bcrypt');

const saltRounds = 10;

async function hashPassword(rawPassword) {
    try {
        const hashedPassword = await bcrypt.hash(rawPassword, saltRounds);
        return hashedPassword;
    } catch (err) {
        console.log('Error hashing password:', err);
    }
}

async function verifyPassword(targetPassword, hashedPassword) {
    try {
        const match = await bcrypt.compare(targetPassword, hashedPassword);
        return match;
    } catch (err) {
        console.log('Error verifying password:',err);
    }
}

module.exports = { hashPassword, verifyPassword }