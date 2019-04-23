import { Router } from 'express';

// controllers
import TransactionController from '../../controller/transactionController';


// helpers
import AuthMiddleware from '../../middleaware/authMiddleware/authMiddleware';
import DoValidation from '../../middleaware/validation/dovalidation';
import AccountValidation from '../../middleaware/validation/accountValidation';


// account routes
const transactionRoutes = Router();

transactionRoutes.post('/:accountNumber/debit',
  AuthMiddleware.checkIfUserIsAuthenticated,
  AccountValidation.checkIfAccountExist,
  AccountValidation.adminChecker,
  AccountValidation.checkAmount,
  TransactionController.debitAccount);

transactionRoutes.post('/:accountNumber/credit',
  AuthMiddleware.checkIfUserIsAuthenticated,
  AccountValidation.checkIfAccountExist,
  AccountValidation.adminChecker,
  AccountValidation.checkAmount,
  TransactionController.creditAccount);

transactionRoutes.get('/:id',
  AuthMiddleware.checkIfUserIsAuthenticated,
  DoValidation.id,
  TransactionController.getSpecificTransaction);
export default transactionRoutes;
