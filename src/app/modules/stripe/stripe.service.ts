// import Stripe from "stripe";
// import config from "../../../config";
// import { Product } from "@prisma/client";

// const stripe = new Stripe(config.stripe.secretKey as string, {
//   apiVersion: "2024-12-18.acacia",
// });

// const createPayment = async (data: {
//   paymentMethodTypes:  Stripe.Checkout.SessionCreateParams.PaymentMethodType[];
//   currency: string;
//   amount: number;
//   successUrl: string;
//   cancelUrl: string;
//   product:Product[]

// }) => {
//   // Create a Stripe checkout session




//   const line_items=data.product.map(product=>{

//     priceData:
//     {
//        currenct
//      }

//   })
//   const session = await stripe.checkout.sessions.create({
//     payment_method_types: data.paymentMethodTypes,
//     line_items: [
//       {
//         price_data: {
//           currency: data.currency,
//           product_data: {
//             name: ,
//           },
//           unit_amount: data.amount,
//         },
//         quantity: 1,
//       },
//     ],
//     mode: "payment",
//     success_url: data.successUrl,
//     cancel_url: data.cancelUrl,
//   });

//   return session;
// };

// const saveTransactionAndOrder = async (userId: string, sessionId: string) => {
//   // Example: Save transaction and order history in your database
//   // Replace this with actual database operations
//   const transaction = {
//     userId,
//     sessionId,
//     status: "Pending",
//     createdAt: new Date(),
//   };

//   const order = {
//     userId,
//     sessionId,
//     products: ["Sample Product"], // Replace with actual product details
//     totalAmount: 1000, // Replace with actual amount
//     createdAt: new Date(),
//   };

//   // Mock database save (replace with real implementation)
//   console.log("Transaction saved:", transaction);
//   console.log("Order saved:", order);

//   return { transaction, order };
// };

// export const stripeService = {
//   createPayment,
//   saveTransactionAndOrder,
// };
