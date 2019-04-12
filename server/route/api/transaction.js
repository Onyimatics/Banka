import { Router } from 'express';

// controllers
import TransactionController from '../../controller/transactionController';
import AccountValidation from '../../middleaware/validation/accountValidation';

// helpers
import AuthMiddleware from '../../middleaware/authMiddleware/authMiddleware';

// account routes
const transactionRoutes = Router();

transactionRoutes.get('/', AuthMiddleware.checkIfUserIsAuthenticated, AccountValidation.adminChecker, TransactionController.fetchAllTransactions);

export default transactionRoutes;
