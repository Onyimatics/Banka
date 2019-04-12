import accounts from '../model/accounts';
import response from '../helper/response/index';
import AccountGenerator from '../helper/accountGenerator/accountGenerator';

/**
 * Class representing AccountController
 * @class AccountController
 */
class AccountController {
  /**
         * @description Create a bank account
         * @param {object} req - The request object
         * @param {object} res - The response object
         * @return {object} JSON representing data object
         * @memberof createAccount
         */
  static createAccount(req, res) {
    const {
      email, firstName, lastName, id,
    } = req.user;
    const { type } = req.body;
    if (type === 'savings' || type === 'current') {
      const accountNumber = AccountGenerator.accountGenerator();
      const newAccount = {
        id: accounts.length + 1,
        accountNumber,
        createdOn: new Date(),
        owner: id,
        type,
        status: 'draft',
        balance: 0,
      };

      const createdOn = new Date().getTime();
      accounts.push(newAccount);
      const { balance } = newAccount;
      return response(res, 201, 'Successfully created a new bank account', {
        accountNumber, firstName, lastName, createdOn, email, type, openingBalance: balance,
      });
    }
    return response(res, 400, 'Enter a valid account type');
  }
}
export default AccountController;
