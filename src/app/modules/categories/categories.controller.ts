import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";

import { categoryService } from "./categories.service";

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await categoryService.createCategory(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "category Created successfully",
    data: result,
  });
});

const getCategories = catchAsync(async (req: Request, res: Response) => {
  const result = await categoryService.getCategories();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All category Get  Successfully",
    data: result,
  });
});
const deleteSingleCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await categoryService.deleteSingleCategory(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "category  deleted   Successfully",
    data: result,
  });
});
const updateSingleCategory = catchAsync(async (req: Request, res: Response) => {
  let data = req.body;

  const result = await categoryService.updateSingleCategories(
    req.params.id,
    data
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "category  updated   Successfully",
    data: result,
  });
});
export const categoryController = {
  createCategory,
  getCategories,
  deleteSingleCategory,
  updateSingleCategory,
};
