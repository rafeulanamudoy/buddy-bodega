import { z } from "zod";

export const AuthorizedPaymentPayloadSchema = z.object({
  userId: z.string(),
  paymentMethodTypes: z.array(z.string()),
  currency: z.string().length(3), // e.g., "usd"
  amount: z.number().positive(),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
});
