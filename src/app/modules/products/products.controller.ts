import catchAsync from "../../../shared/catchAsync";
import { Request, Response } from "express";
import { productService } from "./products.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiErrors";
import pick from "../../../shared/pick";
import { filterableField } from "../../../helpers/searchableField";
import { paginationFileds } from "../../../helpers/paginationOption";
import config from "../../../config";

const createProduct = catchAsync(async (req: Request, res: Response) => {
  // console.log(req.user, "check req.user");
  const file = req.file as unknown as Express.Multer.File;
  console.log(req.file);

  if (!file) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "please upload product image");
  }
  const fileUrl = `${config.backend_base_url}/uploads/${file.filename}`;

  // Add the fileUrl to the product payload
  const productData = {
    ...req.body,
    productImage: fileUrl,
  };
  const result = await productService.createProducts(productData);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Product Create  Successfully.",
    data: result,
  });
});
const getSingleProduct = catchAsync(async (req: Request, res: Response) => {
  // console.log(req.user, "check req.user");

  const result = await productService.getSingleProduct(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "single product get   Successfully.",
    data: result,
  });
});
const getProducts = catchAsync(async (req: any, res: Response) => {
  // console.log(req.user, "check reconst paginationOptions = pick(req.query, paginationFileds);
  const paginationOptions = pick(req.query, paginationFileds);
  // console.log(req.query, "querty check from controller");
  const filters = pick(req.query, filterableField);
  console.log(req.user, "check user");

  const result = await productService.getProducts(
    req.user,
    filters,
    paginationOptions
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "single product get   Successfully.",
    data: result,
  });
});

export const productController = {
  createProduct,
  getSingleProduct,
  getProducts,
};
