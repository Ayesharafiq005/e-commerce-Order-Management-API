import { Router } from "express";
import { createCategory } from "../controllers/category.controller.js";

const router = Router();

router.route("/").post(createCategory);

export default router;