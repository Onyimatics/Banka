import response from '../helper/response/index';
import pool from '../db/config';

class TransactionController {
  /**
    * @static debitAccount
    * @description Allows User to fetch transactions
    * @param {object} req - Request object
    * @param {object} res - Response object
    * @returns {object} Json
    * @memberof TransactionController
    */
  static async debitAccount(req, res) {
    const {
      accountDetails, body: { amount },
      userDetails: { id },
      params: { accountNumber },
    } = req;

    if (accountDetails.status !== 'active') {
      return response(res, 400, 'Account is currently dormant');
    }

    const { balance: oldBalance } = accountDetails;
    if (Number(oldBalance) - amount > 0) {
      try {
        const newBalance = Number(oldBalance) - Number(amount);
        const newTransactions = {
          type: '\'debit\'',
          accountNumber,
          cashier: id,
          amount,
          oldBalance,
          newBalance,
        };

        const query = `WITH transactions AS (
          update accounts set balance = ${newBalance} where accountnumber = ${accountNumber}  
          )
          insert into transactions(type, accountnumber, cashier, amount, oldbalance,newbalance) 
          values (${[...Object.values(newTransactions)]}) returning *
          `;
        const transaction = await pool.query(query);
        return response(res, 200, 'Account has been successfully debited', transaction.rows[0]);
      } catch (error) {
        return response(res, 500, 'Server error');
      }
    }
    return response(res, 403, 'Insufficient fund');
  }

  /**
    * @static creditAccount
    * @description Allows Staff credit an account
    * @param {object} req - Request object
    * @param {object} res - Response object
    * @returns {object} Json
    * @memberof TransactionController
    */

  static async creditAccount(req, res) {
    const {
      accountDetails, body: { amount }, userDetails: { id }, params: { accountNumber },
    } = req;
    if (accountDetails.status !== 'active') {
      return response(res, 400, 'Account is currently dormant');
    }
    try {
      const { balance: oldBalance } = accountDetails;
      const newBalance = Number(oldBalance) + Number(amount);

      const newTransactions = {
        type: '\'credit\'',
        accountNumber,
        cashier: id,
        amount,
        oldBalance,
        newBalance,
      }; const query = `WITH transactions AS (
        update accounts set balance = ${newBalance} where accountnumber = ${accountNumber}  )
        insert into transactions(type, accountnumber, cashier, amount, oldbalance,newbalance) 
        values (${[...Object.values(newTransactions)]}) returning * `;

      const transaction = await pool.query(query);
      return response(res, 200, 'Account has been successfully credited', transaction.rows[0]);
    } catch (error) {
      return response(res, 500, 'Server error');
    }
  }

  /**
    * @static getSpecificTransaction
    * @description Allows User to get a specific transaction details
    * @param {object} req - Request object
    * @param {object} res - Response object
    * @returns {object} Json
    * @memberof TransactionController
    */
  static async getSpecificTransaction(req, res) {
    try {
      const { params: { id } } = req;
      const transaction = await pool.query('select * from transactions where id = $1', [id]);
      // if (!transaction[0]) {
      //   return response(res, 404, 'Transaction not found');
      // }
      const {
        createdon, type, accountnumber, amount, oldbalance, newbalance,
      } = transaction.rows[0];
      const data = {
        transactionId: id,
        createdOn: createdon,
        type,
        accountNumber: accountnumber,
        amount,
        oldBalance: oldbalance,
        newBalance: newbalance,
      };
      return response(res, 200, 'Transaction Details Successfully Retrieved', data);
    } catch (error) {
      return response(res, 500, 'Server error');
    }
  }
}

export default TransactionController;
