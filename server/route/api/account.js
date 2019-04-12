// express libraries
import { Router } from 'express';

// controllers
import AccountController from '../../controller/accountController';
import AccountValidation from '../../middleaware/validation/accountValidation';

// helpers
import AuthMiddleware from '../../middleaware/authMiddleware/authMiddleware';

// account routes
const accountRoutes = Router();
accountRoutes.get('/',
  AuthMiddleware.checkIfUserIsAuthenticated,
  AccountValidation.adminChecker,
  AccountController.fetchAllAccounts);

accountRoutes.post('/',
  AuthMiddleware.checkIfUserIsAuthenticated,
  AuthMiddleware.checkUserById,
  AccountController.createAccount);


export default accountRoutes;
