import { Router } from 'express';
import { authController } from './auth.controller';

const route = Router();

route.post('/login', authController.login);
route.post('/register', authController.register);
route.post('/change-password', authController.changePassword);
route.post('/refresh-token', authController.refreshToken);
route.post('/forget-password', authController.forgetPassword);
route.post('/reset-password/:token', authController.resetPassword);

export const authRoute = route;
