import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import passport from "passport";
import { createUser } from "../controllers/usersController.ts";
import { validateData } from "../middleware/validationMiddleware.ts";
import { userSchema } from "../schemas/userSchema.ts";
import {
  isAdminMiddleware,
  isAuthMiddleware,
} from "../middleware/authMiddleware.ts";

const router = Router();

router.route("/register").post(validateData(userSchema), createUser);

router.route("/login").post(
  passport.authenticate("local", {
    failureMessage: "Failed",
    failWithError: true,
    keepSessionInfo: true,
  }),
);

router
  .route("/logout")
  .get((req: Request, res: Response, next: NextFunction) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
    });
    return res.status(200).json({ message: "Logged out." });
  });

router
  .route("/is-auth")
  .get(isAuthMiddleware, (req: Request, res: Response) => {
    return res
      .status(200)
      .json({ user: { ...req.user, session_id: req.sessionID } });
  });

router
  .route("/is-admin")
  .get(isAdminMiddleware, (req: Request, res: Response) => {
    return res.status(200).json(req.user);
  });

export default router;
