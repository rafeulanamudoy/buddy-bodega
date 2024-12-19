import express from "express";
import { cartController } from "./cart.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

// user login route
router.post(
  "/create-cart",

  // auth(UserRole.ADMIN),
  cartController.createCart
);
router.patch("/update-cart/:id", cartController.updateCart);
router.delete("/delete-cart/:id",cartController.deleteCart);
router.get("/get-cart/",auth(UserRole.USER),cartController.getCartByCustomer)
export const cartRoute = router;
