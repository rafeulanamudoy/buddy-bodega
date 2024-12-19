import { Product } from "@prisma/client";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";
import httpStatus from "http-status";

export const createProducts = async (payload: Product) => {
  console.log(payload,"check payload")
  const isExist = await prisma.product.findUnique({
    where: {
      name: payload.name.trim().toUpperCase(),
    },
  });
  if (isExist) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "this product  name already exist"
    );
  }
  const result = await prisma.product.create({
    data: {
      name: payload.name.trim().toUpperCase(),

      brandName: payload.brandName,
      details: payload.details,
      mainPrice: payload.mainPrice,
      categoryId: payload.categoryId,
      discountPrice: payload.discountPrice || 0,
      productImage: payload.productImage,
    },
  });

  return result;
};

const getSingleProduct = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: {
      id: id,
    },
  });
  if (!product) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "product not found");
  }
  return product;
};

const getProducts = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: {
      id: id,
    },
  });
  if (!product) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "product not found");
  }
  return product;
};

export const productService = {
  createProducts,
  getSingleProduct,
  getProducts,
};
