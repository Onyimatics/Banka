/* eslint-disable prefer-destructuring */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable no-unused-expressions */
import response from '../../helper/response/index';
import RegularExpression from './regularExpressions';
import pool from '../../db/config';

class AccountValidation {
  /**
     * @static
     * @description a validation function
     * @param {object} req HTTP request object
     * @param {object} res HTTP response object
     * @param {function} next next middleware function
     * @returns {function} returns error message
     */
  static async checkIfAccountExist(req, res, next) {
    const { accountNumber } = req.params;
    try {
      const { rows } = await pool.query('select * from accounts where accountnumber = $1', [Number(accountNumber)]);
      req.accountDetails = rows[0];
      return next();
    } catch (error) {
      return response(res, 404, 'Account Not Found');
    }
  }

  static async staffChecker(req, res, next) {
    const { type } = req.userDetails;
    (type === 'staff') ? next() : response(res, 401, 'Unauthorized');
  }

  static async adminChecker(req, res, next) {
    const { isAdmin } = req.userDetails;
    !isAdmin ? next() : response(res, 401, 'Unauthorized');
  }

  static async type(req, res, next) {
    const { type } = req.body;
    const validate = RegularExpression.validate();
    if (!validate.accountType.test(type)) {
      return response(res, 400, 'Enter a valid account type');
    }
    return next();
  }

  static async checkAmount(req, res, next) {
    const { amount } = req.body;
    if (!amount || amount < 0) {
      return response(res, 400, 'Enter a valid amount greater than zero');
    }
    return next();
  }
}


export default AccountValidation;
