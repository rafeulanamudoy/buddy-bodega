import express from "express";
import { cartController } from "./cart.controller";

const router = express.Router();

// user login route
router.post(
  "/create-cart",

  // auth(UserRole.ADMIN),
  cartController.createCart
);
router.patch("/update-cart/:id", cartController.updateCart);
router.delete("/delete-cart/:id",cartController.deleteCart)
export const cartRoute = router;
