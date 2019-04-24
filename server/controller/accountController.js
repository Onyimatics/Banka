/* eslint-disable max-len */

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
    const { body: { type, openingBalance }, userDetails: { id: userid } } = req;
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


  static async updateAccountStatus(req, res) {
    /**
    * @static
    * @description Allow Admin/Staff to activate or deactivate an account
    * @param {object} req - Request object
    * @param {object} res - Response object
    * @returns {object} Json
    * @memberof AccountController
    */
    const { accountDetails } = req;
    const { accountNumber } = req.params;
    try {
      const { status } = accountDetails;
      if (status === 'active') {
        await pool.query('update accounts set status = $1 where accountnumber = $2;', ['dormant', accountNumber]);
        return response(res, 200, 'Account successfully deactivated');
      }
      await pool.query('update accounts set status = $1 where accountnumber = $2;', ['active', accountNumber]);
      return response(res, 200, 'Account successfully activated');
    } catch (error) {
      return response(res, 500, 'Server error');
    }
  }

  /**
  * @static
  * @description Allow Admin/Staff to delete an account
  * @param {object} req - Request object
  * @param {object} res - Response object
  * @returns {object} Json
  * @memberof AccountController
  */
  static async deleteAccount(req, res) {
    try {
      const { params: { accountNumber } } = req;
      await pool.query('delete from accounts where accountnumber = $1;', [accountNumber]);
      return response(res, 200, 'Account successfully deleted');
    } catch (error) {
      return response(res, 500, 'Server error');
    }
  }

  /**
    * @static
    * @description Allows users to get all accounts for a user
    * @param {object} req - Request object
    * @param {object} res - Response object
    * @returns {object} Json
    * @memberof AccountController
    */
  static async getAccountTransactions(req, res) {
    try {
      const { params: { accountNumber } } = req;
      const transactions = await pool.query('select * from transactions where accountnumber = $1', [accountNumber]);
      const data = transactions.rows.map((transaction) => {
        const {
          id, createdon, type, accountnumber, amount, oldbalance, newbalance,
        } = transaction;
        return {
          transactionId: id,
          createdOn: createdon,
          type,
          accountNumber: accountnumber,
          amount,
          oldBalance: oldbalance,
          newBalance: newbalance,
        };
      });
      return response(res, 200, 'Ok', data);
    } catch (error) {
      return response(res, 500, 'Server error');
    }
  }

  static async getSpecificAccountDetails(req, res) {
    try {
      const { params: { accountNumber } } = req;
      const account = await pool.query('SELECT email, accounts.* FROM users JOIN accounts on users.id = accounts.OWNER WHERE accounts.accountnumber = $1', [accountNumber]);
      const {
        createdon, accountnumber, email, type, status, balance,
      } = account.rows[0];
      const data = {
        createdOn: createdon,
        accountNumber: accountnumber,
        ownerEmail: email,
        type,
        status,
        Balance: balance,
      };
      return response(res, 200, 'Ok', data);
    } catch (error) {
      return response(res, 500, 'Server error');
    }
  }

  static async getAllBankAccounts(req, res) {
    let accounts;
    try {
      const { status } = req.query;
      if (status === 'active') {
        accounts = await pool.query('SELECT email, accounts.* FROM users JOIN accounts on users.id = accounts.OWNER where status = \'active\'');
      } else { accounts = await pool.query('SELECT email, accounts.* FROM users JOIN accounts on users.id = accounts.OWNER'); }
    } catch (error) {
      return response(res, 500, 'Server error');
    }
    const data = accounts.rows.map((account) => {
      const {
        createdon, accountnumber, email, type, status, balance,
      } = account;
      return {
        createdOn: createdon,
        accountNumber: accountnumber,
        ownerEmail: email,
        type,
        status,
        Balance: balance,
      };
    });

    return response(res, 200, 'Ok', data);
  }
}
export default AccountController;
