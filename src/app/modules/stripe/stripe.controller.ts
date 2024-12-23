import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { stripeService } from "./stripe.service";
import Stripe from "stripe";
import config from "../../../config";
const stripe = new Stripe(config.stripe.secretKey as string, {
  apiVersion: "2024-12-18.acacia",
});

// Create a new payment session
const createPayment = catchAsync(async (req: Request, res: Response) => {
  const { customer, paymentMethodTypes, currency, successUrl, cancelUrl,product ,billingAddress} = req.body;

  // Step 1: Create a payment session
  const session = await stripeService.createPayment({
    paymentMethodTypes,
    currency,

    successUrl,
    cancelUrl,
    product,

    billingAddress,
   
  });

  // Step 2: Save transaction and order history
  // const { transaction, order } = await stripeService.saveTransactionBillingAndOrder(userId, session.id,billingAddress,totalAmount,paymentStatus);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment session created successfully",
    data: session
  });
});
const saveTransactionBillingAndOrder=catchAsync(async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
 
  if (!sig) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'Missing Stripe signature header.',
      data: null,
    });
  }

  let event: Stripe.Event;
console.log(config.stripe.webhookSecret,"check secret key")
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, config.stripe.webhookSecret as string);
    console.log(event.type,"check event")
  } catch (err) {
    console.error("Webhook signature verification failed.", err);
    return res.status(400).send("Webhook Error");
  }
 
  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session;
      console.log(session,"check session")

      // Extract necessary information
      const userId = session.client_reference_id; // Sent during session creation
      const sessionId = session.id;
      const customerId = session.customer as string; // Stripe Customer ID
      const totalAmount = session.amount_total; // Total amount paid
      const paymentStatus = session.payment_status;

      try {

        const customer = await stripe.customers.retrieve(customerId);
        return

        // 2. Save transaction, order, and billing information
        // await stripeService.saveTransactionBillingAndOrder(
        //   userId,
        //   sessionId,
        //   customer,
        //   totalAmount,
        //   paymentStatus

        // );
      } catch (error) {
        console.error("Error saving transaction:", error);
        return res.status(500).send("Internal Server Error");
      }

      break;

    // Handle other event types...
    default:
      console.warn(`Unhandled event type ${event.type}`);
  }

  res.status(200).send("Event received");
});
export const StripeController = {
  createPayment,
  saveTransactionBillingAndOrder
};
