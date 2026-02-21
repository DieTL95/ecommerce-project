import { Router } from "express";
import {
  addProductToCategory,
  createProduct,
  getAllProducts,
  getOneProduct,
  deleteProduct,
  getProductCategories,
  removeProductFromCategory,
  updateProductImages,
  updateProduct,
} from "../controllers/productsController.ts";
import { validateData } from "../middleware/validationMiddleware.ts";
import { productSchema } from "../schemas/productSchema.ts";
import { paramSchema } from "../schemas/reqSchemas.ts";
import upload from "../middleware/multerMiddleware.ts";
import { db } from "../database.ts";
const router = Router();

router
  .route("/")
  .get(getAllProducts)
  .post(validateData(productSchema), createProduct);

router
  .route("/:id")
  .get(validateData(paramSchema), getOneProduct)
  .patch(updateProduct)
  .delete(validateData(paramSchema), deleteProduct);

router
  .route("/:id/images")
  .patch(validateData(paramSchema), updateProductImages);
export default router;
