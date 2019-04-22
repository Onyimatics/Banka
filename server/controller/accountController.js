import accounts from '../model/accounts';
import response from '../helper/response/index';
import pool from '../db/config';

class AccountController {
  /**
    * @static
    * @description Allow a user to create bank account
    * @param {object} req - Request object
    * @param {object} res - Response object
    * @returns {object} Json
    * @memberof AccountController
    */
  static async createAccount(req, res) {
    const { type, openingBalance, userid } = req.body;
    let accountDetails;
    if (!type) { return response(res, 400, 'Enter a valid account type'); }

    try {
      const lastAccNum = await pool.query('SELECT accountnumber FROM accounts ORDER BY accountnumber DESC LIMIT 1;');
      const { accountnumber } = lastAccNum.rows[0];
      accountDetails = await pool.query('insert into accounts (accountnumber, owner, type, status, balance) values ($1, $2, $3, $4, $5) returning *', [
        accountnumber + 1,
        userid,
        type,
        'active',
        openingBalance,
      ]);
    } catch (error) {
      return response(res, 500, 'Server error');
    }
    const { accountnumber, balance } = accountDetails.rows[0];
    const { firstname, lastname, email } = req.customer;
    return response(res, 201, 'Successfully created a new bank account', {
      accountNumber: accountnumber, firstName: firstname, lastName: lastname, email, type, openingBalance: balance,
    });
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
