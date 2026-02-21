import { Router } from "express";
import {
  addItemToCart,
  clearCart,
  createCart,
  deleteCartItem,
  getCartById,
  getCurrentCart,
  updateCart,
} from "../controllers/cartController.ts";

const router = Router();

router
  .route("/")
  .get(getCurrentCart)
  .post(createCart)
  .patch(updateCart)
  .delete(clearCart);

router
  .route("/:id")
  .get(getCartById)
  .post(addItemToCart)
  .delete(deleteCartItem);

export default router;
