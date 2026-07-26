export interface ApiError {
  status: number;
  message: string;
  errors?: ErrorDetail[];
  timestamp: string;
  path: string;
}

export interface ErrorDetail {
  field: string;
  message: string;
  rejectedValue?: any;
}

export interface ErrorResponse {
  error: ApiError;
  statusCode: number;
}

export enum ErrorCode {
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}
