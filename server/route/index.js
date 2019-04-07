import { Router } from 'express';



import userRoutes from './api/user';

const routes = Router();

routes.use(userRoutes)
routes.all('*', (req, res) => {
    res.status(404).json({
        status: '404',
        data: {
            message: 'Route does not exist'
        }
    });
});


export default routes;
