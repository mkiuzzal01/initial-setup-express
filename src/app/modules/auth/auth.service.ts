import status from 'http-status';
import AppError from '../../errors/AppError';
import { TUser } from '../user/user.interface';
import { User } from '../user/user.model';
import { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import { TChangePassword, TResetPassword } from './auth.interface';
import bcrypt from 'bcrypt';
import { createToken, verifyToken } from './auth.utils';
import { sendMail } from '../../../utils/sendMail';

const loginUser = async (payload: TUser) => {
  const isUserExist = await User.isUserExistByCustomId(payload?.id);
  if (!isUserExist) {
    throw new AppError(status.NOT_FOUND, 'User not found');
  }

  const isDeleted = isUserExist?.isDeleted;
  if (isDeleted === true) {
    throw new AppError(status.FORBIDDEN, 'User is deleted');
  }
  const userStatus = isUserExist?.status;

  if (userStatus === 'blocked') {
    throw new AppError(status.FORBIDDEN, 'User is blocked');
  }

  //check the provided password is exist:
  const isPasswordMatch = await User.isPasswordMatch(
    payload?.password,
    isUserExist?.password,
  );
  if (!isPasswordMatch) {
    throw new AppError(status.UNAUTHORIZED, 'Invalid credentials');
  }

  //generate access token:
  const jwtPayload = {
    userId: isUserExist?.id,
    role: isUserExist?.role,
  };

  //generate access token:
  const accessToken = createToken(
    jwtPayload,
    config.access_token_secret as string,
    config.jwt_access_token_expiration as string,
  );

  //generate refresh token:
  const refreshToken = createToken(
    jwtPayload,
    config.refresh_token_secret as string,
    config.jwt_refresh_token_expiration as string,
  );

  //then finally login  user:
  return {
    accessToken,
    refreshToken,
    needsPasswordChange: isUserExist?.needsPasswordChange,
  };
};

const changePassword = async (
  payload: JwtPayload,
  userPass: TChangePassword,
) => {
  const { role, userId } = payload;
  const isUserExist = await User.isUserExistByCustomId(userId);

  if (!isUserExist) {
    throw new AppError(status.NOT_FOUND, 'User not found');
  }

  const isDeleted = isUserExist?.isDeleted;
  if (isDeleted === true) {
    throw new AppError(status.FORBIDDEN, 'User is deleted');
  }
  const userStatus = isUserExist?.status;

  if (userStatus === 'blocked') {
    throw new AppError(status.FORBIDDEN, 'User is blocked');
  }

  //check the provided password is exist:
  const isPasswordMatch = await User.isPasswordMatch(
    userPass?.oldPassword,
    isUserExist?.password,
  );

  if (!isPasswordMatch) {
    throw new AppError(status.UNAUTHORIZED, 'Invalid credentials');
  }

  //encrypted new password:
  const newHasPassword = await bcrypt.hash(
    userPass?.newPassword,
    Number(config.bcrypt_salt_round),
  );

  await User.findOneAndUpdate(
    {
      id: userId,
      role: role,
    },
    {
      password: newHasPassword,
      needsPasswordChange: false,
      passwordChangeAt: new Date(),
    },
  );

  return null;
};

const refreshToken = async (token: string) => {
  if (!token) {
    throw new AppError(status.UNAUTHORIZED, 'you are not authorized');
  }

  //verified token with decode:
  const decoded = verifyToken(token, config.refresh_token_secret as string);

  //verification of role and authorization:
  const { userId, iat } = decoded;

  const isUserExist = await User.isUserExistByCustomId(userId);

  if (!isUserExist) {
    throw new AppError(status.NOT_FOUND, 'user not found');
  }

  const isDeleted = isUserExist?.isDeleted;
  if (isDeleted === true) {
    throw new AppError(status.FORBIDDEN, 'user is deleted');
  }
  const userStatus = isUserExist?.status;

  if (userStatus === 'blocked') {
    throw new AppError(status.FORBIDDEN, 'user is blocked');
  }

  //check password change time and token issue time:
  const checkTime = await User.isJwtIssuedBeforePasswordChange(
    isUserExist?.passwordChangeAt as Date,
    iat as number,
  );

  if (checkTime) {
    throw new AppError(status.FORBIDDEN, 'Token has expired or is invalid');
  }

  //create jwt payload:
  const jwtPayload = {
    userId: isUserExist?.id,
    role: isUserExist?.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.access_token_secret as string,
    config.jwt_access_token_expiration as string,
  );

  return {
    accessToken,
  };
};

const forgetPassword = async (id: string) => {
  const isUserExist = await User.isUserExistByCustomId(id);

  if (!isUserExist) {
    throw new AppError(status.NOT_FOUND, 'user not found');
  }

  const isDeleted = isUserExist?.isDeleted;
  if (isDeleted === true) {
    throw new AppError(status.FORBIDDEN, 'user is deleted');
  }
  const userStatus = isUserExist?.status;

  if (userStatus === 'blocked') {
    throw new AppError(status.FORBIDDEN, 'user is blocked');
  }

  //generate access token:
  const jwtPayload = {
    userId: isUserExist?.id,
    role: isUserExist?.role,
  };

  //generate access token:
  const resetToken = createToken(
    jwtPayload,
    config.access_token_secret as string,
    config.jwt_access_token_expiration as string,
  );

  const resetLink = `${config.reset_pass_ui_link}?id=${id}&token=${resetToken}`;

  sendMail(isUserExist.email, resetLink);
};

const resetPassword = async (payload: TResetPassword, token: string) => {
  const isUserExist = await User.isUserExistByCustomId(payload.id);
  if (!isUserExist) {
    throw new AppError(status.NOT_FOUND, 'user not found');
  }

  const isDeleted = isUserExist?.isDeleted;
  if (isDeleted === true) {
    throw new AppError(status.FORBIDDEN, 'user is deleted');
  }
  const userStatus = isUserExist?.status;

  if (userStatus === 'blocked') {
    throw new AppError(status.FORBIDDEN, 'user is blocked');
  }

  if (!token) {
    throw new AppError(status.UNAUTHORIZED, 'you are not authorized');
  }

  //verified token with decode:
  const decoded = verifyToken(token, config.access_token_secret as string);

  if (payload.id !== decoded.userId) {
    throw new AppError(status.FORBIDDEN, 'you are forbidden');
  }

  //encrypted new password:
  const newHasPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_round),
  );

  await User.findOneAndUpdate(
    {
      id: decoded.userId,
      role: decoded.role,
    },
    {
      password: newHasPassword,
      needsPasswordChange: false,
      passwordChangeAt: new Date(),
    },
  );

  return null;
};

export const AuthService = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
};
