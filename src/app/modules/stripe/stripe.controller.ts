import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { stripeService } from "./stripe.service";

// Create a new payment session
const createPayment = catchAsync(async (req: Request, res: Response) => {
  const { userId, paymentMethodTypes, currency, successUrl, cancelUrl,product ,billingAddress} = req.body;

  // Step 1: Create a payment session
  const session = await stripeService.createPayment({
    paymentMethodTypes,
    currency,
  
    successUrl,
    cancelUrl,
    product
    
  });

  // Step 2: Save transaction and order history
  const { transaction, order } = await stripeService.saveTransactionBillingAndOrder(userId, session.id,billingAddress);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment session created successfully",
    data: { session, transaction, order },
  });
});

export const StripeController = {
  createPayment,
};
