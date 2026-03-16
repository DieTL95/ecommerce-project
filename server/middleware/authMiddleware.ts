import type { Request, Response, NextFunction } from "express";
import { ForbiddenError, UnauthorisedError } from "../errors/customErrors.ts";

export const isAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.isAuthenticated()) {
    res.status(200);
    return next();
  }

  return res
    .status(401)
    .json({ session_id: req.sessionID, cart_id: req.session.cart_id });
};

export const isAdminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log(req.user);
  if (req.isAuthenticated() && req.user.admin) {
    return next();
  }

  throw new ForbiddenError("Forbidden.");
};
