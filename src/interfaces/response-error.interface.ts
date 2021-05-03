export interface ResponseError {
  message?: string;
  description?: string;
  code?: number;
  http_response?: {
    message: string;
    code: number;
  };
}
