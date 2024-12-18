import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";

import { brandsController } from "./brands.controller";
import { multerUpload } from "../../middlewares/multer";

const router = express.Router();

// user login route
router.post(
  "/create-brand",
  multerUpload.single("brandImage"),
  // auth(UserRole.ADMIN),
  brandsController.createBrand
);
router.get(
  "/get-brands",
  // auth(UserRole.ADMIN),
  brandsController.getBrands
);

router.patch(
  "/update-brand/:id",
  multerUpload.single("brandImage"),
  // auth(UserRole.ADMIN),
  brandsController.updateSingleBrand
);
router.delete(
  "/delete-brand/:id",
  // auth(UserRole.ADMIN),
  brandsController.deleteSingleBrand
);

export const brandRoute = router;
