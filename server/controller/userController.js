import response from '../helper/response/index';
import users from '../model/users';
import TokenManager from '../helper/tokenManager';
import PasswordManager from '../helper/passwordManager';
import pool from '../db/config';

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
    let newUser;
    try {
      const hashPassword = await PasswordManager.hashPassword(password);
      const userDetails = await pool.query('select * from users where email = $1', [email]);

      if (userDetails.rows[0]) {
        return response(res, 409, 'Email already in use');
      }
      newUser = await pool.query('insert into users (firstName, lastName, email, password, type, isAdmin) values ($1, $2, $3, $4, $5, $6) returning id', [
        firstName,
        lastName,
        email,
        hashPassword,
        'client',
        'false',
      ]);
    } catch (error) {
      return response(res, 500, 'Server error');
    }
    const { id } = newUser.rows[0];
    const token = TokenManager.sign({ id });
    return response(res, 201, 'Successfully created a new user account', {
      id, firstName, lastName, email, token,
    });
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
