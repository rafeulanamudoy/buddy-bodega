import Stripe from "stripe";
import config from "../../../config";
import { BillingAddress, OrderModel, TransactionModel } from "@prisma/client";
import prisma from "../../../shared/prisma";

import ApiError from "../../errors/ApiErrors";
import httpStatus from "http-status";

const stripe = new Stripe(config.stripe.secretKey as string, {
  apiVersion: "2024-12-18.acacia",
});

const createPayment = async (data: {
  paymentMethodTypes: Stripe.Checkout.SessionCreateParams.PaymentMethodType[];
  currency: string;
  successUrl: string;
  cancelUrl: string;
  product: any;
  client_reference_id: string;
  billing_address_collection: BillingAddress;
  customerEmail: string;
}) => {
  // Serialize product data
  const serializedProducts = JSON.stringify(data.product);

  // Serialize billing and shipping addresses
  const serializedBillingAddress = JSON.stringify(
    data.billing_address_collection
  );

  const lineItems = data.product.map((product: any) => ({
    price_data: {
      currency: data.currency,
      product_data: {
        name: product.id,
      },
      unit_amount: product.mainPrice * 100, // Stripe expects amount in cents
    },
    quantity: product.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: data.paymentMethodTypes,
    line_items: lineItems,
    mode: "payment",
    success_url: data.successUrl,
    cancel_url: data.cancelUrl,

    client_reference_id: data.client_reference_id,
    // customer:customer.id,

    metadata: {
      customer_product: serializedProducts,
      customer_billing_address: serializedBillingAddress,
    },
  });

  return session;
};

const saveTransactionBillingAndOrder = async (session: any) => {
  const { client_reference_id, metadata, amount_total, payment_method_types } =
    session;

  const findCustomer = await prisma.user.findUnique({
    where: { id: client_reference_id },
    include: { customer: true },
  });

  const customerBillingAddress = JSON.parse(metadata.customer_billing_address);
  const products = JSON.parse(metadata.customer_product);

  return prisma
    .$transaction(async (prisma) => {
      if (!findCustomer || !findCustomer.customer) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Customer not found");
      }
      const order = await prisma.orderModel.create({
        data: {
          customerId: findCustomer.customer.id,
          totalAmount: amount_total,
          stripeSessionId:session.id
        },
      });

      for (const product of products) {
        await prisma.orderProduct.create({
          data: {
            orderId: order.id,
            productId: product.id,
            productQuantity: product.quantity,
          },
        });
      }

      const transaction = await prisma.transactionModel.create({
        data: {
          customerId: findCustomer.customer.id,
          orderId: order.id,
          amount: amount_total,
          paymentMethod: payment_method_types[0],
        },
      });

      const billingAddress = await prisma.billingAddress.create({
        data: { ...customerBillingAddress },
      });

      await prisma.cartModel.deleteMany({
        where: { customerId: findCustomer.customer.id },
      });

      return { order, transaction, billingAddress };
    })
    .catch((error) => {
      console.error("Error saving transaction and order:", error);
      throw new Error("Error saving transaction and order.");
    });
};
const refundPayment = async (sessionId: string) => {
  try {
    // Retrieve the Checkout Session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Expire the Checkout Session
    const refund = await stripe.checkout.sessions.expire(sessionId);
    return refund;
  } catch (error) {
    console.error('Error during refund:', error);
    throw new Error('Could not process refund');
  }
};
export const stripeService = {
  createPayment,
  saveTransactionBillingAndOrder,
  refundPayment
};
