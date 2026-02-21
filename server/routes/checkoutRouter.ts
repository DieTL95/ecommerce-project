import { Router } from "express";
import { validateData } from "../middleware/validationMiddleware.ts";
import { paramSchema } from "../schemas/reqSchemas.ts";
import { payment } from "../controllers/paymentsController.ts";

const router = Router();

router.route("/payment-intent").post(payment);

export default router;
