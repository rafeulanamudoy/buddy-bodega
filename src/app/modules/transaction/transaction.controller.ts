import { Request,Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { transactionService } from "./transaction.service";


const getTransactionByCustomer = catchAsync(async (req: any, res: Response) => {

    const userid=req.user.id
    const result = await transactionService.getTransactionByCustomer(userid);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "customer transaction get successfully",
      data: result,
    });
  });
const getAllTransaction=catchAsync(async (req: any, res: Response) => {


    const result = await transactionService.getAllTransaction();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "all transaction get successfully",
      data: result,
    });
  });





  export const transactionController={
    getTransactionByCustomer,
    getAllTransaction
        
  
  }