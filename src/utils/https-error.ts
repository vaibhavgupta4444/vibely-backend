export class HttpError extends Error {
  public readonly status: number;
  public readonly details?: any;

  constructor(status: number, message: string, details?: any) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.details = details;
   
    Error.captureStackTrace(this, HttpError);
  }
}

// Common HTTP error factory functions
export const BadRequestError = (message: string, details?: any) => 
  new HttpError(400, message, details);

export const UnauthorizedError = (message: string = 'Unauthorized') => 
  new HttpError(401, message);

export const ForbiddenError = (message: string = 'Forbidden') => 
  new HttpError(403, message);

export const NotFoundError = (message: string = 'Not found') => 
  new HttpError(404, message);

export const ConflictError = (message: string, details?: any) => 
  new HttpError(409, message, details);

export const ValidationError = (message: string, details?: any) => 
  new HttpError(422, message, details);