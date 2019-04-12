import response from '../helper/response/index';
import users from '../model/users';
import TokenManager from '../helper/tokenManager';
import PasswordManager from '../helper/passwordManager';

/**
 * Class representing UserController
 * @class UserController
 */
class UserController {
  static async register(req, res) {
    /**
         * @description Create a user account
         * @param {object} req - The request object
         * @param {object} res - The response object
         * @return {object} JSON representing data object
         * @memberof register
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
        id, token, firstName, email, lastName,
      });
    }
  }

  /**
         * @description Signin user account
         * @param {object} req - The request object
         * @param {object} res - The response object
         * @return {object} JSON representing data object
         * @memberof signin
         */
  static signin(req, res) {
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
      const token = TokenManager.sign(userDetails);
      // eslint-disable-next-line dot-notation
      userDetails['token'] = token;
      response(res, 200, 'Successfully logged in', {
        id, token, firstName, email, lastName,
      });
    } else {
      response(res, 400, 'Invalid Password or Email');
    }
  }
}
export default UserController;
