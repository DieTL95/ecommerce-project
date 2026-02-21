import { Router } from "express";
import {
  getAddresses,
  createAddress,
  getOneAddress,
  updateAddress,
  deleteAddress,
} from "../controllers/addressController.ts";
import { validateData } from "../middleware/validationMiddleware.ts";
import { paramSchema } from "../schemas/reqSchemas.ts";
import { addressSchema } from "../schemas/addressSchema.ts";

const router = Router();

router
  .route("/")
  .get(getAddresses)
  .post(validateData(addressSchema), createAddress);

router
  .route("/:id")
  .get(validateData(paramSchema), getOneAddress)
  .patch(validateData(paramSchema), validateData(addressSchema), updateAddress)
  .delete(validateData(paramSchema), deleteAddress);

export default router;
