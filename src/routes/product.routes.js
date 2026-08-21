import { Router } from "express";
import { createProduct , getAllProducts} from "../controllers/product.controller.js";
import { verifyJWT  } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";



const router = Router();

router.route("/").post(verifyJWT, verifyAdmin, createProduct);

router.route("/").get(getAllProducts);

export default router;