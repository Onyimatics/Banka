import transactions from '../model/transactions';
import response from '../helper/response/index';

class TransactionController {
  /**
    * @static
    * @description Allows User to fetch transactions
    * @param {object} req - Request object
    * @param {object} res - Response object
    * @returns {object} Json
    * @memberof TransactionController
    */
  static async fetchAllTransactions(req, res) {
    await response(res, 200, 'All Transactions fetched Successfully', transactions);
  }

  static async fetchTransactionByTransactionId(req, res) {
    /**
    * @static
    * @description Allows User to fetch a transaction by Id
    * @param {object} req - Request object
    * @param {object} res - Response object
    * @returns {object} Json
    * @memberof TransactionController
    */
    const { type } = req.user;
    if (type) {
      const { transactionDetails, transactionExist } = req;
      if (transactionExist === 0) {
        response(res, 404, 'Transaction not found', transactionDetails);
      } else {
        await response(res, 200, 'Transaction details Successfully Retrieved', transactionDetails);
      }
    }
  }
  /**
    * @static
    * @description Allows Staff debit an account
    * @param {object} req - Request object
    * @param {object} res - Response object
    * @returns {object} Json
    * @memberof TransactionController
    */

  static debitAccount(req, res) {
    const { accountDetails, accountStatus } = req;
    const { amount } = req.body;
    const { isAdmin, id } = req.user;
    if (isAdmin === true) {
      return response(res, 401, 'Unauthorized', null);
    }
    if (accountStatus !== 'active') {
      return response(res, 400, 'Account is currently inactive', null);
    }
    if (amount > 0) {
      const { balance: oldBalance } = accountDetails;
      if (Number(oldBalance) - amount > 0) {
        accountDetails.balance = Number(oldBalance) - Number(amount);

        const newTransactions = {
          id: transactions.length + 1,
          createdOn: new Date(),
          type: 'debit', // credit or debit
          accountNumber: accountDetails.accountNumber,
          cashier: id, // cashier who consummated the transaction
          amount,
          oldBalance,
          newBalance: accountDetails.balance,
        };
        transactions.push(newTransactions);
        const { id: transactionId } = newTransactions;
        return response(res, 200, 'Account has been successfully debited',
          {
            transactionId, accountNumber: newTransactions.accountNumber, amount, cashier: id, transactionType: 'debit', accountBalance: accountDetails.balance,
          });
      }

      return response(res, 400, 'Insufficient fund');
    }
    return response(res, 401, 'Forbidden');
  }

  static creditAccount(req, res) {
    /**
    * @static
    * @description Allows Staff credit an account
    * @param {object} req - Request object
    * @param {object} res - Response object
    * @returns {object} Json
    * @memberof TransactionController
    */

    const { accountDetails, accountStatus } = req;
    const { amount } = req.body;
    const { isAdmin, id } = req.user;
    if (accountStatus !== 'active') {
      return response(res, 400, 'Account is currently inactive', null);
    }
    if (isAdmin === true) {
      return response(res, 400, 'Unauthorized', null);
    }
    if (amount > 0) {
      const { balance: oldBalance } = accountDetails;
      accountDetails.balance = Number(oldBalance) + Number(amount);
      const newTransactions = {
        id: transactions.length + 1,
        createdOn: new Date(),
        type: 'credit', // credit or debit
        accountNumber: accountDetails.accountNumber,
        cashier: id, // cashier who consummated the transaction
        amount,
        oldBalance,
        newBalance: accountDetails.balance,
      };
      transactions.push(newTransactions);
      const { id: transactionId } = newTransactions;
      return response(res, 200, 'Successfully credited an account', {
        transactionId, accountNumber: newTransactions.accountNumber, amount, cashier: id, transactionType: 'credit', accountBalance: accountDetails.balance,
      });
    }
    return response(res, 401, 'Forbidden');
  }
}
export default TransactionController;
