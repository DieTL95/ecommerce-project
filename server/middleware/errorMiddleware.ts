import type { Request, Response, NextFunction } from "express";
const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err);
  if (res.headersSent) {
    return next();
  }
  const status = err.status || 500;
  const message = err.message || "Server  error";
  res.status(status).json({ message });
  return next();
};

export default errorMiddleware;
