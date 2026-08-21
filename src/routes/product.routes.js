import { Router } from "express";
import { createProduct , getAllProducts} from "../controllers/product.controller.js";


const router = Router();

router.route("/").post(createProduct);

router.route("/").get(getAllProducts);

export default router;