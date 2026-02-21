export class ErrorBase extends Error {
  status: number;
  constructor(message: string | undefined, status: number) {
    super(message);
    this.status = status;
  }
}

export class BadRequestError extends ErrorBase {
  constructor(message: string | undefined) {
    super(message, 400);
  }
}
export class UnauthorisedError extends ErrorBase {
  constructor(message: string | undefined) {
    super(message, 401);
  }
}
export class ForbiddenError extends ErrorBase {
  constructor(message: string | undefined) {
    super(message, 403);
  }
}
export class NotFoundError extends ErrorBase {
  constructor(message: string | undefined) {
    super(message, 404);
  }
}
