import { RequestHandler } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import status from 'http-status';
import { AuthService } from './auth.service';
import config from '../../config';
import { IUser } from '../user/user.interface';

const login: RequestHandler = catchAsync(async (req, res) => {
  const payload = req.body;
  const { accessToken, refreshToken, needsPasswordChange } =
    await AuthService.loginUser(payload);

  //set the refresh token in cookies:
  res.cookie('refreshToken', refreshToken, {
    secure: config.node_env === 'production',
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User logged in successfully',
    data: {
      accessToken,
      needsPasswordChange,
    },
  });
});

const register: RequestHandler = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await AuthService.registerUser(payload);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: 'User registered successfully',
    data: result,
  });
});

const refreshToken: RequestHandler = catchAsync(async (req, res) => {
  const token = req.cookies.refreshToken;
  const result = await AuthService.refreshToken(token);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Refresh token generated successfully',
    data: result,
  });
});

const changePassword: RequestHandler = catchAsync(async (req, res) => {
  const userPass = req.body;
  const userData = req.user as IUser;
  const result = await AuthService.changePassword(userData, userPass);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Password update successfully',
    data: result,
  });
});

const forgetPassword: RequestHandler = catchAsync(async (req, res) => {
  const payload = req.body;
  await AuthService.forgetPassword(payload);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Please check your email to reset your password',
  });
});

const resetPassword: RequestHandler = catchAsync(async (req, res) => {
  const payload = req.body;
  const token = req.params.token;
  await AuthService.resetPassword(payload, token);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Password reset successfully',
  });
});

export const authController = {
  login,
  register,
  refreshToken,
  changePassword,
  forgetPassword,
  resetPassword,
};
