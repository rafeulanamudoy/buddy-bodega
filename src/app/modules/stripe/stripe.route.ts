import express from "express";
import { StripeController } from "./stripe.controller";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { AuthorizedPaymentPayloadSchema } from "./stripe.validation";

const router = express.Router();

// Create a new payment session
router.post(
  "/create-payment",

  // validateRequest(AuthorizedPaymentPayloadSchema), // Validate request payload
  StripeController.createPayment
);

// router.post("/payment-webhook",  express.raw({ type: "application/json" }),StripeController.saveTransactionBillingAndOrder)

export const StripeRoutes = router;