// express libraries
import { Router } from 'express';

// controllers
import AccountController from '../../controller/accountController';
import AccountValidation from '../../middleaware/validation/accountValidation';

// helpers
import AuthMiddleware from '../../middleaware/authMiddleware/authMiddleware';

// account routes
const accountRoutes = Router();
accountRoutes.post('/',
  AuthMiddleware.checkIfUserIsAuthenticated,
  AuthMiddleware.checkUserById,
  AccountValidation.type,
  AccountController.createAccount);

accountRoutes.patch('/:accountNumber',
  AuthMiddleware.checkIfUserIsAuthenticated,
  AccountValidation.staffChecker,
  AccountValidation.checkIfAccountExist,
  AccountController.updateAccountStatus);

accountRoutes.delete('/:accountNumber',
  AuthMiddleware.checkIfUserIsAuthenticated,
  AccountValidation.staffChecker,
  AccountValidation.checkIfAccountExist,
  AccountController.deleteAccount);


export default accountRoutes;
