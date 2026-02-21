import { Router } from "express";
import {
  createUser,
  deleteUser,
  getOneUser,
  getUsers,
  updateUser,
} from "../controllers/usersController.ts";
import { validateData } from "../middleware/validationMiddleware.ts";
import { paramSchema } from "../schemas/reqSchemas.ts";

const router = Router();

router.route("/").get(getUsers).patch(updateUser);

router
  .route("/:id")
  .get(validateData(paramSchema), getOneUser)

  .delete(deleteUser);

export default router;
