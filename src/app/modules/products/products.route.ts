import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { productController } from "./products.controller";
import { multerUpload } from "../../middlewares/multer";
import { parseBodyData } from "../../middlewares/parseBodyData";
import optionalAuth from "../../middlewares/optionalAuth";

const router = express.Router();

router.post(
  "/create-product",
  auth(UserRole.SUPER_ADMIN),
  multerUpload.single("productImage"),
  parseBodyData,

  productController.createProduct
);
router.get(
  "/get-all-products",
  // auth(UserRole.ADMIN, UserRole.USER),
  //  optionalAuth(UserRole.ADMIN, UserRole.USER),

  productController.getProducts
);
router.get("/single-product/:id", productController.getSingleProduct);
router.patch("/update-product/:id", productController.updateProduct);
router.delete("/delete-product/:id", productController.deleteProduct);

export const productRoute = router;
