import express from "express";

import { multerUpload } from "../../middlewares/multer";
import { categoryController } from "./categories.controller";

const router = express.Router();

// user login route
router.post(
  "/create-category",

  // auth(UserRole.ADMIN),
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
  // auth(UserRole.ADMIN),
  categoryController.updateSingleCategory
);
router.delete(
  "/delete-category/:id",
  // auth(UserRole.ADMIN),
  categoryController.deleteSingleCategory
);

export const categoryRoute = router;
