/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import { ZodObject } from 'zod';
import catchAsync from '../utils/catchAsync';

const validationRequest = (schema: ZodObject<any>) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await schema.parseAsync({
      body: req.body,
      cookies: req.cookies,
    });
    next();
  });
};

export default validationRequest;
