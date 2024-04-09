export default class GenericError extends Error {
  public statusCode;
  public message: string;
  constructor(message: string, statusCode = 500) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
  }
}
