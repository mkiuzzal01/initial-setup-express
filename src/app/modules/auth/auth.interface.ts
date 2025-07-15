export type TAuth = {
  email: string;
  password: string;
};

export type TChangePassword = {
  oldPassword: string;
  newPassword: string;
};

export type TResetPassword = {
  email: string;
  newPassword: string;
};
