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
  const { customerEmail, paymentMethodTypes, currency, successUrl, cancelUrl,product ,billing_address_collection, client_reference_id} = req.body;

  // Step 1: Create a payment session
  const session = await stripeService.createPayment({
    paymentMethodTypes,
    currency,

    successUrl,
    cancelUrl,
    product,

    billing_address_collection,
    customerEmail,
    client_reference_id,
   
  });



  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment session created successfully",
    data: session
  });
});
const saveTransactionBillingAndOrder = catchAsync(async (req: Request, res: Response) => {
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

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, config.stripe.webhookSecret as string);
  } catch (err) {
    console.error("Webhook signature verification failed.", err);
    return res.status(400).send("Webhook Error");
  }
 

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session;
      try {
        const result = await stripeService.saveTransactionBillingAndOrder(session);
        return result;
      } catch (error) {
        console.error("Error saving transaction:", error);
        return res.status(500).send("Internal Server Error");
      }
      break;

    case "payment_intent.succeeded":
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      try {
        console.log('PaymentIntent succeeded:', paymentIntent.id);
      } catch (error) {
        console.error("Error handling payment_intent.succeeded:", error);
        return res.status(500).send("Internal Server Error");
      }
      break;

    case "payment_intent.created":
      const createdPaymentIntent = event.data.object as Stripe.PaymentIntent;
      try {
        console.log('PaymentIntent created:', createdPaymentIntent.id);
      } catch (error) {
        console.error("Error handling payment_intent.created:", error);
        return res.status(500).send("Internal Server Error");
      }
      break;

    case "charge.updated":
      const updatedCharge = event.data.object as Stripe.Charge;
      try {
        console.log('Charge updated:', updatedCharge.id);
      
      } catch (error) {
        console.error("Error handling charge.updated:", error);
        return res.status(500).send("Internal Server Error");
      }
      break;

    default:
      console.warn(`Unhandled event type ${event.type}`);
  }

  res.status(200).send("Event received");
});
export const StripeController = {
  createPayment,
  saveTransactionBillingAndOrder
};
