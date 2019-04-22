import { Router } from 'express';
import userRoutes from './api/user';
import accountRoutes from './api/account';
// import transactionRoutes from './api/transaction';

const routes = Router();

routes.use('/auth', userRoutes);
routes.use('/accounts', accountRoutes);
// routes.use('/transactions', transactionRoutes);


export default routes;
