import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { productController } from "./products.controller";
import { multerUpload } from "../../middlewares/multer";
import { parseBodyData } from "../../middlewares/parseBodyData";

const router = express.Router();

router.post(
  "/create-product",
  //   auth(UserRole.ADMIN),
  multerUpload.single("productImage"),
  parseBodyData,

  productController.createProduct
);
router.get("/:id", productController.getSingleProduct);
router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.USER),
  productController.getProducts
);

export const productRoute = router;
