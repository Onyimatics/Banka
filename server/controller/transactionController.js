import transactions from '../model/transactions';
import response from '../helper/response/index';

class TransactionController {
  static async fetchAllTransactions(req, res) {
    await response(res, 200, 'All Transactions fetched Successfully', transactions);
  }

  static async fetchTransactionByTransactionId(req, res) {
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
}
export default TransactionController;
