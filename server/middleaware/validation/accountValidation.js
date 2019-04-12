/* eslint-disable max-len */
import accounts from '../../model/accounts';
import transactions from '../../model/transactions';
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

  static async accountStatusChecker(req, res, next) {
    const { accountDetails, accountExist } = req;
    if (accountExist === 0) {
      return response(res, 400, 'Account not found', null);
    }
    req.accountStatus = accountDetails.status;
    return next();
  }

  static async checkIfTransactiontExist(req, res, next) {
    let transactionExist = 0;
    const { transactionId } = req.params;
    const transactionDetails = transactions.find(transaction => transaction.id === Number(transactionId));
    transactionExist = (transactionDetails) ? (transactionExist = 1) : 0;
    req.transactionDetails = transactionDetails;
    req.transactionExist = transactionExist;
    return next();
  }
}


export default AccountValidation;
