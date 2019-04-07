import bcrypt from 'bcryptjs';

/**
 * @class PasswordManager
 */
class PasswordManager {
    /**
     * @description Helper method to hash passwords
     * @static
     * @param {string} password
     * @returns {string} A string representing the hashed password
     * @memberof PasswordManager
     */
    static hashPassword(password) {
        return bcrypt.hash(password, 10);
    }

    /**
     * @description Helper method to decrypt hashed passwords
     * @param {string} password
     * @param {string} hashedPassword
     * @returns {string} The original password
     * @memberof PasswordManager
     */
    static verifyPassword(password, hashedPassword) {
        return bcrypt.compareSync(password, hashedPassword);
    }
}

export default PasswordManager;