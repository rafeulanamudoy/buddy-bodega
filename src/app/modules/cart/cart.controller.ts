import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { cartService } from "./cart.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";

const createCart = catchAsync(async (req: Request, res: Response) => {
    const result = await cartService.createCart(req.body);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "cart Created successfully",
      data: result,
    });
  });


  export const cartController={
    createCart
  }