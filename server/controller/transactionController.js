import response from '../helper/response/index';
import pool from '../db/config';

class TransactionController {
  /**
    * @static
    * @description Allows User to fetch transactions
    * @param {object} req - Request object
    * @param {object} res - Response object
    * @returns {object} Json
    * @memberof TransactionController
    */
  static async debitAccount(req, res) {
    const {
      accountDetails,
      body: { amount },
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
          insert into transactions(type, accountnumber, cashier, amount, oldbalance,newbalance) values (${[...Object.values(newTransactions)]}) returning *
          `;
        const transaction = await pool.query(query);
        return response(res, 200, 'Account has been successfully debited', transaction.rows[0]);
      } catch (error) {
        return response(res, 500, 'Server error');
      }
    }
    return response(res, 403, 'Insufficient fund');
  }
}
export default TransactionController;
