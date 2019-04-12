import { Router } from 'express';
import userRoutes from './api/user';
import accountRoutes from './api/account';
// import transactionRoutes from './api/transaction';

const routes = Router();

routes.use('/auth', userRoutes);
routes.use('/accounts', accountRoutes);
// routes.use('/transactions', transactionRoutes);
routes.all('*', (req, res) => {
  res.status(404).json({
    status: 404,
    data: {
      message: 'Page Not Found',
    },
  });
});


export default routes;
