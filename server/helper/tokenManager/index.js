import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

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
     * @param {string} [ttl='365 days']
     * @returns {string} Jwt token
     * @memberof Tokenize
     */
  static sign(payload, ttl = '365 days') {
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
    const payload = jwt.verify(token, secret, (err, decoded) => decoded);
    delete payload.password;
    return payload;
  }
}

export default TokenManager;
