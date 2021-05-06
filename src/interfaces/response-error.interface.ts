export interface ResponseError {
  message?: string;
  description?: string;
  code?: number;
  details?: Record<string, any>;
  http_response?: {
    message: string;
    code: number;
  };
}
