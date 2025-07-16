import mongoose from 'mongoose';
import status from 'http-status';
import { TErrorSource, TGenericErrorResponse } from '../interface/TError';

const handleCastError = (
  err: mongoose.Error.CastError,
): TGenericErrorResponse => {
  const errorSource: TErrorSource[] = [
    { path: err.path, message: err.message },
  ];
  return {
    statusCode: status.BAD_REQUEST,
    message: 'invalid id',
    errorSource,
  };
};

export default handleCastError;
