import { Router } from 'express';
import { authController } from './auth.controller';
import validationRequest from '../../middlewares/validationRequest';
import { userValidation } from '../user/user.validation';
import { authValidation } from './auth.validation';
import { auth } from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const route = Router();

route.post(
  '/register',
  validationRequest(userValidation.userValidationSchema),
  authController.register,
);
route.post(
  '/login',
  validationRequest(authValidation.loginValidationSchema),
  authController.login,
);
route.post(
  '/refresh-token',
  validationRequest(authValidation.refreshTokenValidationSchema),
  authController.refreshToken,
);
route.post(
  '/change-password',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.user),
  validationRequest(authValidation.changePasswordValidationSchema),
  authController.changePassword,
);
route.post(
  '/forget-password',
  validationRequest(authValidation.forgetPasswordValidationSchema),
  authController.forgetPassword,
);
route.post(
  '/reset-password/:token',
  validationRequest(authValidation.resetPasswordValidationSchema),
  authController.resetPassword,
);

export const authRoute = route;
