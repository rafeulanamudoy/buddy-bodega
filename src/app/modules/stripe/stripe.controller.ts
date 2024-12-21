// import { Request, Response } from "express";
// import catchAsync from "../../../shared/catchAsync";
// import sendResponse from "../../../shared/sendResponse";
// import httpStatus from "http-status";
// import { stripeService } from "./stripe.service";

// // Create a new payment session
// const createPayment = catchAsync(async (req: Request, res: Response) => {
//   const { userId, paymentMethodTypes, currency, amount, successUrl, cancelUrl } = req.body;

//   // Step 1: Create a payment session
//   const session = await stripeService.createPayment({
//     paymentMethodTypes,
//     currency,
//     amount,
//     successUrl,
//     cancelUrl,
//   });

//   // Step 2: Save transaction and order history
//   const { transaction, order } = await stripeService.saveTransactionAndOrder(userId, session.id);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "Payment session created successfully",
//     data: { session, transaction, order },
//   });
// });

// export const StripeController = {
//   createPayment,
// };
