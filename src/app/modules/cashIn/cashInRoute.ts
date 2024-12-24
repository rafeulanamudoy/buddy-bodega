import { cashInController } from "./cashincontroller";

 import express from "express"
const router = express.Router();


router.post("/cashIn-payment",  cashInController.createCashIn);



export const cashInRoute = router;
