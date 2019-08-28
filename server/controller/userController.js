// eslint-disable-next-line dot-notation
import response from '../helper/response/index';
import TokenManager from '../helper/tokenManager';
import PasswordManager from '../helper/passwordManager';
import pool from '../db/config';

/**
 * @class UserController
 * @description UserController
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @returns {object} Json
 */
class UserController {
  /**
   * @static register
   * @description Allow a user to signup
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} Json
   * @memberof UserControllers
   */
  static async register(req, res) {
    const {
      firstName, lastName, email, password,
    } = req.body;
    let newUser;
    try {
      const hashPassword = await PasswordManager.hashPassword(password);
      const userDetails = await pool.query(
        'select * from users where email = $1',
        [email],
      );
      if (userDetails.rows[0]) {
        return response(res, 409, 'Email already in use');
      }
      newUser = await pool.query(
        `insert into users (firstName, lastName, email, password, type, isAdmin) 
      values ($1, $2, $3, $4, $5, $6) returning id`,
        [firstName, lastName, email, hashPassword, 'client', 'false'],
      );
    } catch (error) {
      return response(res, 500, 'Server error');
    }
    const { id } = newUser.rows[0];
    const token = TokenManager.sign({
      id,
      type: 'client',
      isAdmin: false,
      email,
      firstName,
      lastName,
    });
    return response(res, 201, 'Successfully created a new user account', {
      id,
      firstName,
      lastName,
      email,
      token,
    });
  }

  /**
   * @static signupAdminStaff
   * @description Allows an Admin to signup another Admin or Staff
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} Json
   * @memberof UserControllers
   */
  static async signupAdminStaff(req, res) {
    const {
      firstName, lastName, email, password, isAdmin,
    } = req.body;
    let newUser;
    try {
      const hashPassword = await PasswordManager.hashPassword(password);
      const userDetails = await pool.query(
        'select * from users where email = $1',
        [email],
      );
      if (userDetails.rows[0]) {
        return response(res, 409, 'Email already in use');
      }
      newUser = await pool.query(
        `insert into users (firstName, lastName, email, password, type, isAdmin) 
      values ($1, $2, $3, $4, $5, $6) returning id`,
        [firstName, lastName, email, hashPassword, 'staff', isAdmin],
      );
    } catch (error) {
      return response(res, 500, 'Server error');
    }
    const { id } = newUser.rows[0];
    const token = TokenManager.sign({ id, type: 'staff', isAdmin });
    return response(res, 201, 'Account Successfully Created.', {
      id,
      firstName,
      lastName,
      email,
      isAdmin,
      token,
    });
  }

  /**
   * @static signin
   * @description Allows a user to sign in
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} Json
   * @memberof UserControllers
   */
  static async signin(req, res) {
    const { email, password } = req.body;
    let userDetails;
    let isPasswordValid;
    try {
      userDetails = await pool.query('select * from users where email = $1', [
        email,
      ]);
      if (!userDetails.rows[0]) {
        return response(res, 400, "User doesn't exist");
      }
      isPasswordValid = PasswordManager.verifyPassword(
        password,
        userDetails.rows[0].password,
      );
      if (!isPasswordValid) {
        return response(res, 400, 'Incorrect Password or Email');
      }
    } catch (error) {
      return response(res, 500, 'Server error');
    }
    const {
      id, firstname, lastname, type, isadmin,
    } = userDetails.rows[0];
    if (isPasswordValid) {
      const token = TokenManager.sign({
        id, type, isadmin, email, firstname, lastname,
      });
      return response(res, 200, 'Successfully signed in', {
        id,
        firstName: firstname,
        lastName: lastname,
        email,
        token,
        type,
        isadmin,
      });
    }
    return response(res, 400, 'Invalid Password or Email');
  }

  /**
   * @static getAllUserAccounts
   * @description Allows Admin/Staff to get all User's accounts
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} Json
   * @memberof UserControllers
   */
  static async getAllUserAccounts(req, res) {
    let accounts;
    try {
      const {
        params: { email },
        userDetails,
      } = req;
      if (userDetails.type === 'staff') {
        accounts = await pool.query(
          `SELECT email, accounts.* FROM users 
        JOIN accounts on users.id = accounts.OWNER WHERE users.email = $1`,
          [email],
        );
      } else {
        accounts = await pool.query(
          `SELECT accounts.* FROM users INNER JOIN accounts ON users.id = accounts.owner
         WHERE users.email = $1 AND accounts.owner = $2`,
          [email, userDetails.id],
        );
      }
      if (!accounts.rows[0]) {
        return response(res, 404, 'Accounts Not Found');
      }
      const data = accounts.rows.map((account) => {
        const {
          createdon, accountnumber, type, status, balance,
        } = account;
        return {
          createdOn: createdon,
          accountNumber: accountnumber,
          type,
          status,
          Balance: balance,
        };
      });
      return response(
        res,
        200,
        'All User Accounts Successfully Retrieved',
        data,
      );
    } catch (error) {
      return response(res, 500, 'Server error');
    }
  }
}

export default UserController;
