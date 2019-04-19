import accounts from '../model/accounts';
import response from '../helper/response/index';
import AccountGenerator from '../helper/accountGenerator/accountGenerator';

class AccountController {
  static createAccount(req, res) {
    /**
    * @static
    * @description Allow a user to create bank account
    * @param {object} req - Request object
    * @param {object} res - Response object
    * @returns {object} Json
    * @memberof AccountController
    */
    const {
      email, firstName, lastName,
    } = req.customer;
    const { type, id } = req.body;
    if (type) {
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
      // accounts = [...accounts, newAccount];
      accounts.push(newAccount);
      const { balance } = newAccount;
      return response(res, 201, 'Successfully created a new bank account', {
        accountNumber, firstName, lastName, createdOn, email, type, openingBalance: balance,
      });
    }
    return response(res, 400, 'Enter a valid account type', null);
  }


  static updateAccountStatus(req, res) {
    /**
    * @static
    * @description Allow Admin/Staff to activate or deactivate an account
    * @param {object} req - Request object
    * @param {object} res - Response object
    * @returns {object} Json
    * @memberof AccountController
    */
    const { accountDetails, accountStatus } = req;
    const { status } = req.body;

    if (accountStatus === status) {
      return response(res, 304, 'Not modified', accountDetails);
    }


    const accountIndex = accounts.indexOf(accountDetails);
    accountDetails.status = status;
    accounts[accountIndex] = accountDetails;
    const { accountNumber } = accountDetails;
    return response(res, 200, 'Successfully updated an account status', { accountNumber, status });
  }

  static deleteAccount(req, res) {
    /**
    * @static
    * @description Allow Admin/Staff to delete an account
    * @param {object} req - Request object
    * @param {object} res - Response object
    * @returns {object} Json
    * @memberof AccountController
    */
    const { accountDetails, accountExist } = req;
    if (accountExist === 0) {
      return response(res, 404, 'Account not found');
    }
    // eslint-disable-next-line max-len
    const index = accounts.findIndex(account => account.accountNumber === Number(accountDetails.accountNumber));
    accounts.splice(index, 1);
    return response(res, 200, 'Account successfully deleted');
  }
}
export default AccountController;
