import express, { Application, NextFunction, Request, Response } from "express";

import httpStatus from "http-status";
import cors from "cors";
import router from "./app/routes";
import GlobalErrorHandler from "./app/middlewares/globalErrorHandler";
import { PrismaClient } from "@prisma/client";
import path from "path";
import Stripe from "stripe"; // Import Stripe
import { StripeController } from "./app/modules/stripe/stripe.controller";
const app: Application = express();
const prisma = new PrismaClient();

// Middleware setup
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-12-18.acacia", // Set the API version
});
prisma
  .$connect()
  .then(() => {
    console.log("Database connected successfully!");
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
  });

  // app.use(
  //   cors({
  //     origin: ["http://localhost:3000", "https://allen8797-frontend.vercel.app", "https://allen-dashboard-ten.vercel.app"],
  //     credentials: true,
  //     methods: ["GET", "POST", "PUT", "DELETE","PATCH", "OPTIONS"], // Allowed methods
  //     allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"], // Allowed headers
  //   })
  // );

  export const corsOptions = {
    origin: [
      // "https://tasneem-social-frontend.netlify.app",
      "http://localhost:3000",
      "http://192.168.11.130:3000",
      "https://allen8797-frontend.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  };
  
  // Middleware setup

  

// Optional: Handle preflight requests for custom headers or methods
// app.options("*", cors());
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // Frontend URL
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//   next();
// });
app.use(
  "/api/v1/stripe/payment-webhook",
  express.raw({ type: "application/json" }),
  StripeController.saveTransactionBillingAndOrder
)
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// Route handler for root endpoint
app.get("/", (req: Request, res: Response) => {
  res.send({
    Message: "Welcome to api main route",
  });
});

// Router setup
app.use("/api/v1", router);

// Global Error Handler
app.use(GlobalErrorHandler);

// API Not found handler
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "API NOT FOUND!",
    error: {
      path: req.originalUrl,
      message: "Your requested path is not found!",
    },
  });
});

export default app;
