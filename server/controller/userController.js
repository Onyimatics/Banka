import response from '../helper/response/index';
import users from '../model/users';
import TokenManager from '../helper/tokenManager';
import PasswordManager from '../helper/passwordManager';

class UserController {
  /**
   * @class
   * @description UserController
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} Json
   */
  static async register(req, res) {
    /**
   * @static
   * @description Allow a user to signup
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} Json
   * @memberof UserControllers
   */
    const {
      firstName, lastName, email, password,
    } = req.body;
    const hashPassword = await PasswordManager.hashPassword(password);
    const userDetails = users.find(user => user.email === email);
    if (userDetails) {
      response(res, 409, 'Email already in use');
    } else {
      const newUser = {
        id: users.length + 1,
        firstName,
        lastName,
        email,
        password: hashPassword,
        type: 'client',
        isAdmin: false,
      };
      const token = TokenManager.sign(newUser);
      newUser.token = token;
      users.push(newUser);
      const { id } = newUser;
      response(res, 201, 'Successfully created a new user account', {
        id, firstName, lastName, email, token,
      });
    }
  }

  // login controller
  static signin(req, res) {
    /**
     * @static
     * @description Allow a user to signin
     * @param {object} req - Request object
     * @param {object} res - Response object
     * @returns {object} Json
     * @memberof UserControllers
     */
    const { email, password } = req.body;

    const userDetails = users.find(user => user.email === email);
    if (!userDetails) {
      response(res, 400, 'Invalid Password or Email');
    }
    const {
      id, firstName, lastName, password: hashPassword,
    } = userDetails;

    const isPasswordValid = PasswordManager.verifyPassword(password, hashPassword);

    if (isPasswordValid) {
      const token = TokenManager.sign({ id });
      // eslint-disable-next-line dot-notation
      // userDetails['token'] = token;
      response(res, 200, 'Successfully signed in', {
        id, firstName, lastName, email, token,
      });
    } else {
      response(res, 400, 'Invalid Password or Email');
    }
  }
}
export default UserController;
