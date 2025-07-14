/* eslint-disable @typescript-eslint/no-explicit-any */
import status from 'http-status';
import { TErrorSource, TGenericErrorResponse } from '../interface/Terror';

const handleDuplicateError = (error: any): TGenericErrorResponse => {
  const errorSource: TErrorSource[] = [
    {
      path: Object.keys(error.keyPattern || {})[0] || '',
      message: 'Duplicate key error',
    },
  ];

  return {
    statusCode: status.BAD_REQUEST,
    message: 'Duplicate key error',
    errorSource,
  };
};

export default handleDuplicateError;
