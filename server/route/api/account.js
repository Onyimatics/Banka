// express libraries
import { Router } from 'express';

// controllers
import AccountController from '../../controller/accountController';
import AccountValidation from '../../middleaware/validation/accountValidation';

// helpers
import AuthMiddleware from '../../middleaware/authMiddleware/authMiddleware';

import DoValidation from '../../middleaware/validation/dovalidation';


// account routes
const accountRoutes = Router();
accountRoutes.post('/',
  AuthMiddleware.checkIfUserIsAuthenticated,
  AuthMiddleware.checkUserById,
  AccountValidation.type,
  DoValidation.openingBalance,
  AccountController.createAccount);

accountRoutes.patch('/:accountNumber',
  AuthMiddleware.checkIfUserIsAuthenticated,
  DoValidation.accountNumber,
  AccountValidation.staffChecker,
  AccountValidation.checkIfAccountExist,
  AccountController.updateAccountStatus);

accountRoutes.delete('/:accountNumber',
  AuthMiddleware.checkIfUserIsAuthenticated,
  DoValidation.accountNumber,
  AccountValidation.staffChecker,
  AccountValidation.checkIfAccountExist,
  AccountController.deleteAccount);

accountRoutes.get('/:accountNumber/transactions',
  AuthMiddleware.checkIfUserIsAuthenticated,
  DoValidation.accountNumber,
  AccountValidation.checkIfAccountExist,
  AccountController.getAccountTransactions);

accountRoutes.get('/:accountNumber',
  AuthMiddleware.checkIfUserIsAuthenticated,
  DoValidation.accountNumber,
  AccountValidation.checkIfAccountExist,
  AccountController.getSpecificAccountDetails);

accountRoutes.get('/',
  AuthMiddleware.checkIfUserIsAuthenticated,
  AccountValidation.staffChecker,
  AccountController.getAllBankAccounts);

export default accountRoutes;
