import mongoose from 'mongoose';
import status from 'http-status';
import { TErrorSource, TGenericErrorResponse } from '../interface/TError';

const handleValidationError = (
  err: mongoose.Error.ValidationError,
): TGenericErrorResponse => {
  const errorSource: TErrorSource[] = Object.keys(err.errors).map((key) => {
    const error = err.errors[key] as mongoose.Error.ValidatorError;

    return {
      path: error.path,
      message: error.message,
    };
  });

  return {
    statusCode: status.BAD_REQUEST,
    message: 'Validation error',
    errorSource,
  };
};

export default handleValidationError;
