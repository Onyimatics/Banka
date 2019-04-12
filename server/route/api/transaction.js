import { Router } from 'express';

// controllers
import TransactionController from '../../controller/transactionController';
import AccountValidation from '../../middleaware/validation/accountValidation';

// helpers
import AuthMiddleware from '../../middleaware/authMiddleware/authMiddleware';

// account routes
const transactionRoutes = Router();

transactionRoutes.get('/',
  AuthMiddleware.checkIfUserIsAuthenticated,
  AccountValidation.adminChecker,
  TransactionController.fetchAllTransactions);

transactionRoutes.get('/:transactionId',
  AuthMiddleware.checkIfUserIsAuthenticated,
  AccountValidation.checkIfTransactiontExist,
  TransactionController.fetchTransactionByTransactionId);

export default transactionRoutes;
