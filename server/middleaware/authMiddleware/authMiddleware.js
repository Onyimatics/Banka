import TokenManager from '../../helper/tokenManager/index';
import response from '../../helper/response/index';

/**
 * @class AuthMiddleware
 * @description class contains function for implementing Authentication middleware
 */
class AuthMiddleware {
  /**
     * @static
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
      // console.log(req.headers);
      const token = authorization;
      const decoded = await TokenManager.verify(token);
      if (decoded) {
        req.user = decoded;
        
        return next();
      }
    } catch (error) {
      const { name } = error;
      // eslint-disable-next-line no-constant-condition
      if (name === 'TokenExpiredError' || name === 'JsonWebTokenError' || 'typeError') {
        return response(res, 401, 'You are not signed in.');
      }
      return response(res, 500, 'An error occured on the server.');
    }
  }
}

export default AuthMiddleware;
