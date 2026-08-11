import { Router } from "express";
import { createProduct } from "../controllers/product.controller.js";


const router = Router();

router.route("/").post(createProduct);


export default router;