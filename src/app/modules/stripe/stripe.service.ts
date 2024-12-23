import Stripe from "stripe";
import config from "../../../config";
import { BillingAddress, OrderModel, TransactionModel } from "@prisma/client";
import prisma from "../../../shared/prisma";

const stripe = new Stripe(config.stripe.secretKey as string, {
  apiVersion: "2024-12-18.acacia",
});

const createPayment = async (data: {
  paymentMethodTypes: Stripe.Checkout.SessionCreateParams.PaymentMethodType[];
  currency: string;
  successUrl: string;
  cancelUrl: string;
  product: any;

  billingAddress: any; // Adjusted type to accept valid values for billing_address_collection
}) => {
  // Create Stripe checkout session
  const lineItems = data.product.map((product: any) => ({
    price_data: {
      currency: data.currency,
      product_data: {
        name: product.name,
      },
      unit_amount: product.mainPrice * 100,
    },
    quantity: product.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: data.paymentMethodTypes,
    line_items: lineItems,
    mode: "payment",
    success_url: data.successUrl,
    cancel_url: data.cancelUrl,
  
    billing_address_collection:data.billingAddress

  });

  return session;
};


 
  
export const stripeService = {
  createPayment,
  // saveTransactionBillingAndOrder,
};
