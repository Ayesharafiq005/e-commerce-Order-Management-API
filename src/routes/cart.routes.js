import { Router } from "express";
import {
    addToCart, getUserCart, removeFromCart,
} from "../controllers/cart.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();

router.use(verifyJWT);


router.route("/").post(addToCart).get(getUserCart);
router.route("/:productId").delete(removeFromCart);


export default router;