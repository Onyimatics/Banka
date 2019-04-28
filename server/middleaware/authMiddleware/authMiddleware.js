/* eslint-disable prefer-destructuring */
import TokenManager from '../../helper/tokenManager/index';
import response from '../../helper/response/index';
import pool from '../../db/config';
/**
 * @class AuthMiddleware
 * @description class contains function for implementing Authentication middleware
 */
class AuthMiddleware {
  /**
     * @static checkIfUserIsAuthenticated
     * @description a middleware function checking if a user is authenticated
     * @param {object} req HTTP request object
     * @param {object} res HTTP response object
     * @param {function} next next middleware function
     * @returns {object} returns error message if user is not authenticated
     */
  // eslint-disable-next-line consistent-return
  static async checkIfUserIsAuthenticated(req, res, next) {
    try {
      const { authorization } = req.headers;
      if (!authorization) {
        return response(res, 401, 'You are not signed in.');
      }
      const token = authorization;
      const decoded = await TokenManager.verify(token);
      if (decoded) {
        req.userDetails = decoded;
        return next();
      }
    } catch (error) {
      const { name } = error;
      if (name === 'TokenExpiredError' || name === 'JsonWebTokenError' || name === 'TypeError') {
        return response(res, 401, 'You are not signed in.');
      }
      return response(res, 500, 'An error occured on the server');
    }
  }

  static async checkUserById(req, res, next) {
    /**
     * @static checkUserById
     * @description a middleware function checking if a user is authenticated
     * @param {object} req HTTP request object
     * @param {object} res HTTP response object
     * @param {function} next next middleware function
     * @returns {object} returns error message if user is not authenticated
     */
    try {
      const userDetails = await pool.query('select * from users where id = $1', [req.userDetails.id]);
      if (!userDetails.rows[0]) {
        return response(res, 404, 'User account not found');
      }
      req.customer = userDetails.rows[0];
    } catch (error) {
      return response(res, 500, 'Server error');
    }
    return next();
  }
}

export default AuthMiddleware;
