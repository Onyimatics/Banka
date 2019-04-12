import accounts from '../model/accounts';
import response from '../helper/response/index';
import AccountGenerator from '../helper/accountGenerator/accountGenerator';

class AccountController {
  static async fetchAllAccounts(req, res) {
    await response(res, 200, 'All Accounts fetched Successfully', accounts);
  }

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
}
export default AccountController;
