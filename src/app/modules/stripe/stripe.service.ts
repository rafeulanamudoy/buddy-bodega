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
    userId:string
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
      client_reference_id:data.userId
    });
  
    return session;
  };


  const saveTransactionBillingAndOrder = async (
    userId: string,
    sessionId: string,
    billingAddress: { name: string; email: string; address: Stripe.Address; },
    totalAmount: number,
    paymentStatus: string
  ) => {
    // Save billing address
    const savedBillingAddress = await prisma.billingAddress.create({
      data: {
      
        name: billingAddress.name,
        email: billingAddress.email,
        address: JSON.stringify(billingAddress.address),
      },
    });
  
    // Save order
    const savedOrder = await prisma.orderModel.create({
      data: {
        userId,
        sessionId,
        products: ["Sample Product"], // Replace with actual product details if available
        totalAmount,
        status: "Pending", // You can update this based on your business logic
        createdAt: new Date(),
      },
    });
  
    // Save transaction
    const savedTransaction = await prisma.transactionModel.create({
      data: {
        userId,
        sessionId,
        amount: totalAmount,
        paymentStatus,
        createdAt: new Date(),
      },
    });
  
    return { billingAddress: savedBillingAddress, order: savedOrder, transaction: savedTransaction };
  };
  
export const stripeService = {
  createPayment,
  saveTransactionBillingAndOrder,
};
