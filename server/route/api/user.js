// exoress libraries
import { Router } from 'express';

// controllers
import UserController from '../../controller/userController';
import DoValidation from '../../middleaware/validation/dovalidation';
import AccountValidation from '../../middleaware/validation/accountValidation';
import AuthMiddleware from '../../middleaware/authMiddleware/authMiddleware';


// user routes
const userRoutes = Router();

// signup route
userRoutes.post(
  '/signup',
  DoValidation.email,
  DoValidation.password,
  DoValidation.userName,
  UserController.register,
);

// admin create account for another admin or staff
userRoutes.post(
  '/signup/admin',
  AuthMiddleware.checkIfUserIsAuthenticated,
  AccountValidation.adminChecker,
  DoValidation.email,
  DoValidation.password,
  DoValidation.userName,
  DoValidation.isAdmin,
  UserController.signupAdminStaff,
);

// signin route
userRoutes.post(
  '/signin',
  DoValidation.email,
  DoValidation.password,
  UserController.signin,
);
export default userRoutes;
