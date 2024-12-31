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

  const onFleetWebhook = catchAsync(async (req: Request, res: Response) => {
   

    // if (req.method !== "POST") {
    //   return res.status(405).send("Method Not Allowed");
    // }

    const verificationHeader = req.headers["x-onfleet-webhook-verification"] as string;
    console.log("Verification Header:", verificationHeader);
  

    console.log("Raw Body:", req.body?.toString());
  
    
    let payload;
    try {
      payload = JSON.parse(req.body?.toString() || "{}");
      console.log("Parsed Payload:", payload);
    } catch (error) {
      console.error("Error parsing body:", error);
      return res.status(400).send("Invalid JSON payload");
    }
  
    if (verificationHeader) {
      return res.status(200).send(verificationHeader);
    }
  
    // Default response
    res.status(200).send("Webhook processed successfully.");
  });

export const cashInController={

    createCashIn,
    onFleetWebhook
}