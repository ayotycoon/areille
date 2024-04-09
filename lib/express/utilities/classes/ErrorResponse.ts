export class ErrorResponse {
  public error?: string = '';
  public statusCode = 500;
  public stack: any;
  constructor(error?: string, statusCode = 500, stack = null) {
    this.error = error;
    if (statusCode) this.statusCode = statusCode;
    this.stack = stack;
  }
}

export default ErrorResponse;
