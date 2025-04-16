/* eslint-disable @typescript-eslint/no-explicit-any */
import status from 'http-status';
import { NextFunction, Request, Response } from 'express';

const notFound = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.status(status.NOT_FOUND).json({
    success: false,
    message: 'API not found',
    err: err,
  });
};

export default notFound;
