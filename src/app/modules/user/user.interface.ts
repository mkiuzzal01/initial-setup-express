import { Model } from 'mongoose';
import { TGender, USER_ROLE } from './user.constant';

export type TUserStatus = 'in-progress' | 'blocked';
export type TUserRole = keyof typeof USER_ROLE;

export type TName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};

export type TLocation = {
  presentAddress: string;
  permanentAddress: string;
};

export interface IUser {
  name: TName;
  slug?: string;
  email: string;
  phone?: string;
  address?: TLocation;
  gender: TGender;
  password: string;
  image?: string;
  passwordChangeAt?: Date;
  role: TUserRole;
  status: TUserStatus;
  isDeleted: boolean;
}

export interface userModel extends Model<IUser> {
  isPasswordMatch(
    plaintextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;

  isJwtIssuedBeforePasswordChange(
    passwordChangeTime: Date,
    tokenIssuedTime: number,
  ): Promise<boolean>;
}
