import { Router } from "express";
import { signedUpload } from "../controllers/signedUploadController.ts";

const router = Router();

router.route("/").get(signedUpload);

export default router;
