import express from "express";

import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { customerController } from "./customer.controller";
import { parseBodyData } from "../../middlewares/parseBodyData";
import { multerUpload } from "../../middlewares/multer";
import { UserControllers } from "../user/user.controller";




const router = express.Router();

router.post("/signUp", multerUpload.any(), 
parseBodyData,customerController.createCustomer);

router.get("/get-me", auth (UserRole.USER),customerController.getSingleCustomer)
router.patch("/update-profile",customerController.updateProfile)

export const customerRoute = router;
