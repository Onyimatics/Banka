import jwt from 'jsonwebtoken';
import env from 'dotenv';

env.config();

const secret = process.env.JWT_SECRET;

/**
 *
 *
 * @class TokenManager
 */
class TokenManager {
    /**
     *
     * @description Encodes a passed token and returns a jwt token
     * @static
     * @param {*} payload
     * @param {string} [ttl='2h']
     * @returns {string} Jwt token
     * @memberof Tokenize
     */
    static sign(payload, ttl = '1d') {
        return jwt.sign(payload, secret, { expiresIn: ttl });
    }

    /**
     *
     * @description Verifies a passed token and returns a decoded payload
     * @static
     * @param {string} token
     * @returns {object} Payload
     * @memberof Tokenize
     */
    static verify(token) {
        return jwt.verify(token, secret);
    }
}

export default TokenManager;