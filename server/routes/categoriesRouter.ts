import { Router } from "express";
import {
  addCategoryToProduct,
  createCategory,
  deleteCategory,
  getAllCategories,
  getOneCategory,
  getOneCatgAllProducts,
  removeCategoryFromProduct,
  updateCategory,
  updateCategoryImages,
} from "../controllers/categoriesController.ts";
import { isAdminMiddleware } from "../middleware/authMiddleware.ts";
import { validateData } from "../middleware/validationMiddleware.ts";
import { paramSchema } from "../schemas/reqSchemas.ts";

const router = Router();

router.route("/").get(isAdminMiddleware, getAllCategories).post(createCategory);

router
  .route("/:id")
  .get(validateData(paramSchema), getOneCategory)
  .patch(validateData(paramSchema), updateCategory)
  .delete(validateData(paramSchema), deleteCategory);

router
  .route("/:id/images")
  .patch(validateData(paramSchema), updateCategoryImages);
router
  .route("/products/:id")
  .get(getOneCatgAllProducts)
  .post(addCategoryToProduct)
  .delete(removeCategoryFromProduct);

export default router;
