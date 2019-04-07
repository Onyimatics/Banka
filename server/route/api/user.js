// exoress libraries
import { Router } from 'express';



//controllers
import UserController from '../../controller/userController';
import DoValidation from '../../middleaware/validation/dovalidation';


//user routes
const userRoutes = Router();


userRoutes.post(
    '/auth/signup',
    DoValidation.email,
    DoValidation.password,
    DoValidation.name,
    UserController.register
);



export default userRoutes;