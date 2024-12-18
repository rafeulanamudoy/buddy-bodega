import express from "express";

import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { customerController } from "./customer.controller";
import { parseBodyData } from "../../middlewares/parseBodyData";
import { multerUpload } from "../../middlewares/multer";




const router = express.Router();

router.post("/signUp", multerUpload.any(), 
parseBodyData,customerController.createCustomer);


export const customerRoute = router;
