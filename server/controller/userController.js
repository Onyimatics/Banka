// eslint-disable-next-line dot-notation
import response from '../helper/response/index';
import TokenManager from '../helper/tokenManager';
import PasswordManager from '../helper/passwordManager';
import pool from '../db/config';

/**
   * @class
   * @description UserController
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} Json
   */
class UserController {
  /**
   * @static
   * @description Allow a user to signup
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} Json
   * @memberof UserControllers
   */
  static async register(req, res) {
    const {
      firstName, lastName, email, password,
    } = req.body; let newUser;
    try {
      const hashPassword = await PasswordManager.hashPassword(password);
      const userDetails = await pool.query('select * from users where email = $1', [email]);
      if (userDetails.rows[0]) {
        return response(res, 409, 'Email already in use');
      }
      newUser = await pool.query(`insert into users (firstName, lastName, email, password, type, isAdmin) 
      values ($1, $2, $3, $4, $5, $6) returning id`, [
        firstName, lastName, email, hashPassword, 'client', 'false',
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

  /**
   * @static
   * @description Allow a user to signup
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} Json
   * @memberof UserControllers
   */
  static async signupAdminStaff(req, res) {
    const {
      firstName, lastName, email, password, isAdmin,
    } = req.body; let newUser;
    try {
      const hashPassword = await PasswordManager.hashPassword(password);
      const userDetails = await pool.query('select * from users where email = $1', [email]);
      if (userDetails.rows[0]) {
        return response(res, 409, 'Email already in use');
      }
      newUser = await pool.query(`insert into users (firstName, lastName, email, password, type, isAdmin) 
      values ($1, $2, $3, $4, $5, $6) returning id`, [
        firstName, lastName, email, hashPassword, 'staff', isAdmin]);
    } catch (error) {
      return response(res, 500, 'Server error');
    } const { id } = newUser.rows[0];
    return response(res, 201, 'Successfully created a new account for Admin or Staff', {
      id, firstName, lastName, email,
    });
  }

  // login controller
  static async signin(req, res) {
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
      id, firstname, lastname, type, isadmin,
    } = userDetails.rows[0];
    if (isPasswordValid) {
      const token = TokenManager.sign({ id, type, isadmin });
      return response(res, 200, 'Successfully signed in', {
        id, firstName: firstname, lastName: lastname, email, token,
      });
    }
    return response(res, 400, 'Invalid Password or Email');
  }

  static async getAllUserAccounts(req, res) {
    try {
      const { params: { email } } = req;
      const accounts = await pool.query(`SELECT email, accounts.* FROM users 
      JOIN accounts on users.id = accounts.OWNER WHERE users.email = $1`, [email]);
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
      return response(res, 200, 'Ok', data);
    } catch (error) {
      return response(res, 500, 'Server error');
    }
  }
}

export default UserController;
