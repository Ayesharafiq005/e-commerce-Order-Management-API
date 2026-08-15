import { Router } from "express";
import { placeOrder , getOrderById ,getUserOrders } from "../controllers/order.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();

router.use(verifyJWT);


router.route("/").post(placeOrder).get(getUserOrders);
router.route("/:orderId").get(getOrderById);

export default router;