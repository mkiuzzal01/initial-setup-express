import { z } from 'zod';

const loginValidationSchema = z.object({
  body: z.object({
    email: z
      .string({ message: 'email is required' })
      .email('Invalid email format'),
    password: z.string({ message: 'password is required' }),
  }),
});

const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string({ message: 'old password is required' }),
    newPassword: z.string({ message: 'new password is required' }),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({ message: 'refresh token is required' }),
  }),
});

const forgetPasswordValidationSchema = z.object({
  body: z.object({
    id: z.string({ message: 'id is required' }),
  }),
});

const resetPasswordValidationSchema = z.object({
  body: z.object({
    id: z.string({ message: 'id is required' }),
    newPassword: z.string({
      message: 'user password is required',
    }),
  }),
});

export const authValidation = {
  loginValidationSchema,
  changePasswordValidationSchema,
  refreshTokenValidationSchema,
  forgetPasswordValidationSchema,
  resetPasswordValidationSchema,
};
