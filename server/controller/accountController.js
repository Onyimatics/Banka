import accounts from '../model/accounts';
import response from '../helper/response/index';
import AccountGenerator from '../helper/accountGenerator/accountGenerator';

class AccountController {
  static createAccount(req, res) {
    const {
      email, firstName, lastName,
    } = req.customer;
    const { type, id } = req.body;
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

  static async fetchAllAccounts(req, res) {
    await response(res, 200, 'All Accounts fetched Successfully', accounts);
  }

  static async fetchAccountByAccountNumber(req, res) {
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
    const { accountDetails } = req;
    let { status } = req;
    status = req.body;
    if (status === 'active' || status === 'dormant') {
      const accountIndex = accounts.indexOf(accountDetails);
      accountDetails.status = status;
      accounts[accountIndex] = accountDetails;
    }
    const { accountNumber } = accountDetails;
    return response(res, 200, 'Successfully updated an account status', { accountNumber, status });
  }

  static deleteAccount(req, res) {
    const { accountDetails, accountExist } = req;
    if (accountExist === 0) {
      return response(res, 400, 'Account not found');
    }
    const index = accounts.findIndex(account => account.accountNumber === Number(accountDetails.accountNumber));
    accounts.splice(index, 1);
    return response(res, 200, 'Account successfully deleted');
  }
}
export default AccountController;