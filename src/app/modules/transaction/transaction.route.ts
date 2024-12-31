
import express from "express"

import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { transactionController } from "./transaction.controller";
const router = express.Router();


router.get("/get-transaction-by-customer",auth(UserRole.USER) , transactionController.getTransactionByCustomer);
router.get("/get-all-transaction",transactionController.getAllTransaction)
router.get("/total-cost",transactionController.totalCost)


export const transactionRoute = router;
