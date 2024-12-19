import express from "express";
import { cartController } from "./cart.controller";

const router = express.Router();

// user login route
router.post(
  "/create-cart",

  // auth(UserRole.ADMIN),
  cartController.createCart
);

export const cartRoute = router;
