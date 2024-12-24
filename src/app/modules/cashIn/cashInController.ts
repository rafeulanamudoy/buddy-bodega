import { Request ,Response} from "express";
import catchAsync from "../../../shared/catchAsync";
import { cashInService } from "./cashIn.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";

const createCashIn=catchAsync(async (req: Request, res: Response) => {


    const result = await cashInService.createCashIn(req.body)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "cash in delivery payment successfully",
      data: result,
    });
  });
export const cashInController={

    createCashIn
}