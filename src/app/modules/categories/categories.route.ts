import express from "express";

import { multerUpload } from "../../middlewares/multer";
import { categoryController } from "./categories.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

// user login route
router.post(
  "/create-category",

  auth(UserRole.SUPER_ADMIN),
  categoryController.createCategory
);
router.get(
  "/get-category",
  // auth(UserRole.ADMIN),
  categoryController.getCategories
);

router.patch(
  "/update-category/:id",
  multerUpload.single("brandImage"),
  auth(UserRole.SUPER_ADMIN),
  categoryController.updateSingleCategory
);
router.delete(
  "/delete-category/:id",
  auth(UserRole.SUPER_ADMIN),
  categoryController.deleteSingleCategory
);

export const categoryRoute = router;
