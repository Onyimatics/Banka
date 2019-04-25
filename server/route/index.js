import { Router } from 'express';
import userRoutes from './api/user';
import accountRoutes from './api/account';
import transactionRoutes from './api/transaction';
import AuthMiddleware from '../middleaware/authMiddleware/authMiddleware';
import DoValidation from '../middleaware/validation/dovalidation';
import UserController from '../controller/userController';

const routes = Router();

routes.get('/', (req, res) => {
  res.status(200).json({
    status: '200',
    message: 'Welcome to Banka API',
  });
});
routes.use('/auth', userRoutes);
routes.use('/accounts', accountRoutes);
routes.use('/transactions', transactionRoutes);

routes.get('/user/:email/accounts',
  AuthMiddleware.checkIfUserIsAuthenticated,
  DoValidation.email,
  UserController.getAllUserAccounts);


export default routes;
