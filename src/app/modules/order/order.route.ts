
import express from "express"
import { orderController } from "./order.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
const router = express.Router();


router.get("/get-orders-by-customer",auth(UserRole.USER) , orderController.getOrdersByCustomer);
router.get("/get-all-orders",orderController.getAllOrders)
router.patch("/update-order/:id",orderController.updateOrder)
router.patch("/cancel-order/:id",orderController.cancelOrder)
router.get("/get-delivery-order",orderController.getDeliveryOrder)


export const orderRoute = router;
