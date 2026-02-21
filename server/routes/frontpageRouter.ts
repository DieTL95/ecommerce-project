import { Router } from "express";
import {
  getFrontpage,
  createFrontpage,
  getOneFrontpage,
  updatePage,
  deletePage,
  getCurrentFrontpage,
} from "../controllers/frontpageController.ts";
import { validateData } from "../middleware/validationMiddleware.ts";
import { paramSchema } from "../schemas/reqSchemas.ts";

const router = Router();

router.route("/").get(getFrontpage).post(createFrontpage);
router.route("/current").get(getCurrentFrontpage);

router
  .route("/:id")
  .get(validateData(paramSchema), getOneFrontpage)
  .patch(validateData(paramSchema), updatePage)
  .delete(validateData(paramSchema), deletePage);

export default router;
