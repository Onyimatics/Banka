// express libraries
import { Router } from 'express';

// controllers
import AccountController from '../../controller/accountController';
// import AccountValidation from '../../middleaware/validation/accountValidation';

// helpers
import AuthMiddleware from '../../middleaware/authMiddleware/authMiddleware';

// account routes
const accountRoutes = Router();
accountRoutes.post('/',
  AuthMiddleware.checkIfUserIsAuthenticated,
  AccountController.createAccount);

export default accountRoutes;
