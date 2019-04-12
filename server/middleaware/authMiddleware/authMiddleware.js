import TokenManager from '../../helper/tokenManager/index';
import response from '../../helper/response/index';
import users from '../../model/users';
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
        return response(res, 401, 'You are not logged in.');
      }
      const token = authorization;
      const decoded = await TokenManager.verify(token);
      if (decoded) {
        req.user = decoded;
        return next();
      }
    } catch (error) {
      const { name } = error;
      if (name === 'TokenExpiredError' || name === 'JsonWebTokenError' || name === 'TypeError') {
        return response(res, 401, 'You need to login.');
      }
      return response(res, 500, 'An error occured on the server', null);
    }
  }

  static async checkUserById(req, res, next) {
    const { id } = req.body;
    const userDetails = users.find(user => user.id === Number(id));
    if (!userDetails) {
      return response(res, 404, 'User account not found', null);
    }
    delete userDetails.password;
    req.customer = userDetails;
    return next();
  }
}

export default AuthMiddleware;
