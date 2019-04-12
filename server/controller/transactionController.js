import transactions from '../model/transactions';
import response from '../helper/response/index';

class TransactionController {
  static async fetchAllTransactions(req, res) {
    await response(res, 200, 'All Transactions fetched Successfully', transactions);
  }
}
export default TransactionController;
