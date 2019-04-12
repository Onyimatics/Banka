// exoress libraries
import { Router } from 'express';

// controllers
import UserController from '../../controller/userController';
import DoValidation from '../../middleaware/validation/dovalidation';


// user routes
const userRoutes = Router();

// signup route
userRoutes.post(
  '/signup',
  DoValidation.email,
  DoValidation.password,
  DoValidation.name,
  UserController.register,
);
// signin route
userRoutes.post(
  '/signin',
  DoValidation.email,
  DoValidation.password,
  UserController.signin,
);


export default userRoutes;
