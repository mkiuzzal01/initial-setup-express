import { model, Schema } from 'mongoose';
import { TUser, userModel } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../config';
import { USER_STATUS } from './user.constant';

const userSchema = new Schema<TUser, userModel>(
  {
    id: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true, select: 0 },
    needsPasswordChange: { type: Boolean, default: true },
    passwordChangeAt: {
      type: Date,
    },
    role: {
      type: String,
      enum: ['superAdmin', 'admin', 'student', 'faculty'],
      required: true,
    },
    status: {
      type: String,
      enum: USER_STATUS,
      default: 'in-progress',
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

// Hash password before saving:
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_round),
  );
  next();
});

// Hide password after saving
userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

//check user is exist:
userSchema.statics.isUserExistByCustomId = async function (id: string) {
  return await User.findOne({ id }).select('+password');
};

//check password is match:
userSchema.statics.isPasswordMatch = async function (
  plaintextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plaintextPassword, hashedPassword);
};

//check password change time and jwt token issue time:
userSchema.statics.isJwtIssuedBeforePasswordChange = async function (
  passwordChangeTime: Date,
  tokenIssuedTime: number,
) {
  const passChangeTime = passwordChangeTime?.getTime() / 1000;
  return passChangeTime > tokenIssuedTime;
};

export const User = model<TUser, userModel>('User', userSchema);
