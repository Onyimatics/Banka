import transactions from '../model/transactions';
import response from '../helper/response/index';
import accounts from '../model/accounts';

class TransactionController {
  /**
    * @static
    * @description Allows User to fetch transactions
    * @param {object} req - Request object
    * @param {object} res - Response object
    * @returns {object} Json
    * @memberof TransactionController
    */
  // eslint-disable-next-line consistent-return
  static debitAccount(req, res) {
    /**
    * @static
    * @description Allows Staff debit an account
    * @param {object} req - Request object
    * @param {object} res - Response object
    * @returns {object} Json
    * @memberof TransactionController
    */

    const { accountNumber } = req.params;

    const { accountDetails } = req;
    const { amount } = req.body;
    const { id } = req.user;

    const account = accounts.find(paccount => paccount.accountNumber === Number(accountNumber));

    if (!account) {
      return response(res, 404, 'Account not found');
    }
    if (account.status !== 'active') {
      return response(res, 400, 'Account is currently dormant');
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

      return response(res, 403, 'Insufficient fund');
    }
  }


  // eslint-disable-next-line consistent-return
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
    const { id } = req.user;
    if (accountStatus !== 'active') {
      return response(res, 400, 'Account is currently dormant');
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
  }
}
export default TransactionController;
