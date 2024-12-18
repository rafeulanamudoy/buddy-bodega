import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { brandService } from "./brands.service";

const createBrand = catchAsync(async (req: Request, res: Response) => {
  const result = await brandService.createBrand(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Brand Created successfully",
    data: result,
  });
});

const getBrands = catchAsync(async (req: Request, res: Response) => {
  const result = await brandService.getBrands();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Brand Get  Successfully",
    data: result,
  });
});
const deleteSingleBrand = catchAsync(async (req: Request, res: Response) => {
  const result = await brandService.deleteSingleBrand(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Brand  deleted   Successfully",
    data: result,
  });
});
const updateSingleBrand = catchAsync(async (req: Request, res: Response) => {
  const result = await brandService.updateSingleBrand(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Brand  updated   Successfully",
    data: result,
  });
});
export const brandsController = {
  createBrand,
  getBrands,
  deleteSingleBrand,
  updateSingleBrand,
};
