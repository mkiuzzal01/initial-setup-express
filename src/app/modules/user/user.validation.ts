import { z } from 'zod';

const USER_ROLE = {
  admin: 'Admin',
  user: 'User',
  superAdmin: 'Super Admin',
} as const;

const GENDERS = ['male', 'female', 'other'] as const;
const USER_STATUSES = ['in-progress', 'blocked'] as const;

const nameSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),
});

const locationSchema = z.object({
  presentAddress: z.string().min(1, 'Present address is required'),
  permanentAddress: z.string().min(1, 'Permanent address is required'),
});

const userValidationSchema = z.object({
  name: nameSchema,
  slug: z.string().optional(),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  address: locationSchema.optional(),
  gender: z.enum(GENDERS),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  image: z.string().url('Image must be a valid URL').optional(),
  needsPasswordChange: z.boolean(),
  passwordChangeAt: z.coerce.date().optional(),
  role: z.enum(Object.keys(USER_ROLE) as [keyof typeof USER_ROLE]),
  status: z.enum(USER_STATUSES),
  isDeleted: z.boolean(),
});

const updateUserValidationSchema = userValidationSchema.partial();

export const userValidation = {
  userValidationSchema,
  updateUserValidationSchema,
};
