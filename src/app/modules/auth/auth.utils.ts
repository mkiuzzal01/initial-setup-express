import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

//for creating token:
export const createToken = (
  jwtPayload: JwtPayload,
  accessTokenSecret: string,
  expiresIn: number | string,
): string => {
  const options: SignOptions = {
    expiresIn: expiresIn as SignOptions['expiresIn'],
  };

  return jwt.sign(jwtPayload, accessTokenSecret, options);
};

//for verifying token:
export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as JwtPayload;
};
