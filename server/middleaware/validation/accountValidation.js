/* eslint-disable max-len */
import accounts from '../../model/accounts';
// import transactions from '../../model/transactions';
import response from '../../helper/response/index';

class AccountValidation {
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
    const { type } = req.user;
    // eslint-disable-next-line no-unused-expressions
    (type === 'staff') ? next() : response(res, 401, 'Unauthorised', null);
  }

  static async adminChecker(req, res, next) {
    const { isAdmin } = req.user;
    // eslint-disable-next-line no-unused-expressions
    (isAdmin === true) ? next() : response(res, 401, 'Unauthorised', null);
  }
}


export default AccountValidation;
