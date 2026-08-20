import { Router } from "express";
import { placeOrder , getOrderById ,getUserOrders, getAllOrders, updateOrderStatus } from "../controllers/order.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

router.use(verifyJWT);


router.route("/").post(placeOrder).get(getUserOrders);
router.route("/:orderId").get(getOrderById);


// admin Routes ;
router.route("/admin/all").get(verifyAdmin ,getAllOrders);
router.route("/admin/status/:orderId").patch(verifyAdmin, updateOrderStatus);

export default router;