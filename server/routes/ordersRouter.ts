import { Router } from "express";
import {
  createOrder,
  getAllOrders,
  getOneOrder,
  updateOrderStatus,
} from "../controllers/ordersController.ts";

const router = Router();

router.route("/").get(getAllOrders).post(createOrder);

router.route("/:id").get(getOneOrder).patch(updateOrderStatus);

export default router;
