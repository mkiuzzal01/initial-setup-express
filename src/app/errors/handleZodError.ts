import { ZodError, ZodIssue } from 'zod';
import status from 'http-status';
import { TErrorSource, TGenericErrorResponse } from '../interface/Terror';

const handleZodError = (err: ZodError): TGenericErrorResponse => {
  const errorSource: TErrorSource[] = err.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue.path.length - 1],
      message: issue.message,
    };
  });

  return {
    statusCode: status.BAD_REQUEST,
    message: 'validation error',
    errorSource,
  };
};

export default handleZodError;
