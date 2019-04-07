// exoress libraries
import { Router } from 'express';



//controllers
import UserController from '../../controller/userController';
import DoValidation from '../../middleaware/validation/dovalidation';


//user routes
const userRoutes = Router();

// signup route
userRoutes.post(
    '/auth/signup',
    DoValidation.email,
    DoValidation.password,
    DoValidation.name,
    UserController.register
);
// login route
userRoutes.post(
    '/auth/login',
    DoValidation.email,
    DoValidation.password,
    UserController.login
);


export default userRoutes;