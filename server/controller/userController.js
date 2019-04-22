import response from '../helper/response/index';
// import users from '../model/users';
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
    const token = TokenManager.sign({ id, type: 'client', isAdmin: false });
    return response(res, 201, 'Successfully created a new user account', {
      id, firstName, lastName, email, token,
    });
  }

  // login controller
  static async signin(req, res) {
    /**
     * @static
     * @description Allow a user to signin
     * @param {object} req - Request object
     * @param {object} res - Response object
     * @returns {object} Json
     * @memberof UserControllers
     */
    const { email, password } = req.body;
    let userDetails; let isPasswordValid;
    try {
      userDetails = await pool.query('select * from users where email = $1', [email]);
      if (!userDetails.rows[0]) {
        return response(res, 400, 'Invalid Password or Email');
      }
      isPasswordValid = PasswordManager.verifyPassword(password, userDetails.rows[0].password);
    } catch (error) {
      return response(res, 500, 'Server error');
    }

    const {
      id, firstName, lastName, type, isAdmin,
    } = userDetails.rows[0];

    if (isPasswordValid) {
      const token = TokenManager.sign({ id, type, isAdmin });
      // eslint-disable-next-line dot-notation
      // userDetails['token'] = token;
      return response(res, 200, 'Successfully signed in', {
        id, firstName, lastName, email, token,
      });
    }

    return response(res, 400, 'Invalid Password or Email');
  }
}
export default UserController;
