import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { brandsController } from "./brands.controller";

const router = express.Router();

// user login route
router.post(
  "/create-brand",
  auth(UserRole.ADMIN),
  brandsController.createBrand
);
router.get("/get-brands", auth(UserRole.ADMIN), brandsController.getBrands);

router.patch(
  "update-brand",
  auth(UserRole.ADMIN),
  brandsController.updateSingleBrand
);
router.delete(
  "delete-brand",
  auth(UserRole.ADMIN),
  brandsController.deleteSingleBrand
);

export const brandRoute = router;
