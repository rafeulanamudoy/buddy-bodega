

 import express from "express"
import { cashInController } from "./cashInController";
const router = express.Router();


router.post("/cashIn-payment",  cashInController.createCashIn);



export const cashInRoute = router;
