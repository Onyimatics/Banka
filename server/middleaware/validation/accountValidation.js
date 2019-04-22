/* eslint-disable max-len */
/* eslint-disable no-unused-expressions */
import accounts from '../../model/accounts';
import users from '../../model/users';
import response from '../../helper/response/index';
import RegularExpression from './regularExpressions';

class AccountValidation {
  /**
     * @static
     * @description a validation function
     * @param {object} req HTTP request object
     * @param {object} res HTTP response object
     * @param {function} next next middleware function
     * @returns {object} returns error message
     */
  static async checkIfAccountExist(req, res, next) {
    let accountExist = 0;
    const { accountNumber } = req.params;
    const accountDetails = accounts.find(account => account.accountNumber === Number(accountNumber));
    accountExist = (accountDetails) ? (accountExist = 1) : 0;
    req.accountDetails = accountDetails;
    req.accountExist = accountExist;
    return next();
  }

  static async staffChecker(req, res, next) {
    const { id } = req.user;
    const theUser = users.find(user => user.id === id);
    (theUser.type === 'staff') ? next() : response(res, 401, 'Unauthorised');
  }

  static async accountStatusChecker(req, res, next) {
    const { accountDetails, accountExist } = req;
    if (accountExist === 0) {
      return response(res, 400, 'Account not found');
    }
    req.accountStatus = accountDetails.status;
    return next();
  }

  static async status(req, res, next) {
    const { status } = req.body;
    const validate = RegularExpression.validate();
    if (!validate.status.test(status)) {
      return response(res, 400, 'Invalid Account status');
    }
    return next();
  }

  static async type(req, res, next) {
    const { type } = req.body;
    const validate = RegularExpression.validate();
    if (!validate.accountType.test(type)) {
      return response(res, 400, 'Enter a valid account type');
    }
    return next();
  }
}


export default AccountValidation;
