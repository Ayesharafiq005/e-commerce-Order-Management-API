import { Router } from "express";
import { createCategory } from "../controllers/category.controller.js";
import { verifyJWT  } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

router.route("/").post(verifyJWT, verifyAdmin,createCategory);

export default router;