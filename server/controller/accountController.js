import accounts from '../model/accounts';
import response from '../helper/response/index';
import AccountGenerator from '../helper/accountGenerator/accountGenerator';
import RegularExpression from '../middleaware/validation/regularExpressions';

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
    const validate = RegularExpression.validate();
    if (validate.accountType.test(type)) {
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

  static async fetchAllAccounts(req, res) {
    /**
    * @static
    * @description Allow Admin/Staff view all accounts
    * @param {object} req - Request object
    * @param {object} res - Response object
    * @returns {object} Json
    * @memberof AccountController
    */
    await response(res, 200, 'All Accounts fetched Successfully', accounts);
  }

  static async fetchAccountByAccountNumber(req, res) {
    /**
    * @static
    * @description Allow Admin/Staff view a specific account
    * @param {object} req - Request object
    * @param {object} res - Response object
    * @returns {object} Json
    * @memberof AccountController
    */
    const { type } = req.user;
    if (type) {
      const { accountDetails, accountExist } = req;
      if (accountExist === 0) {
        response(res, 404, 'Account not found', accountDetails);
      } else {
        await response(res, 200, 'Account details Successfully Retrieved', accountDetails);
      }
    }
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
      return response(res, 304, 'Not Modified', accountDetails);
    }
    const validate = RegularExpression.validate();
    if (!validate.status.test(status)) {
      return response(res, 400, 'Invalid Account status', null);
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
      return response(res, 400, 'Account not found');
    }
    // eslint-disable-next-line max-len
    const index = accounts.findIndex(account => account.accountNumber === Number(accountDetails.accountNumber));
    accounts.splice(index, 1);
    return response(res, 200, 'Account successfully deleted');
  }
}
export default AccountController;
