import { Request,Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { orderService } from "./order.service";

const getOrdersByCustomer = catchAsync(async (req: any, res: Response) => {

    const userid=req.user.id
    const result = await orderService.getOrdersByCustomer(userid);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "customer order get successfully",
      data: result,
    });
  });
const getAllOrders=catchAsync(async (req: any, res: Response) => {
   const {status}=req.query
   console.log(status,"check stauts")

    const result = await orderService.getAllOrders(status);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "all orders get successfully",
      data: result,
    });
  });


  const updateOrder=catchAsync(async (req: Request, res: Response) => {


    const result = await orderService.updateSingleOrder(req.params.id,req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "all orders get successfully",
      data: result,
    });
  });

  const getDeliveryOrder=catchAsync(async (req: Request, res: Response) => {


    const result = await orderService.getDeliveryOrder();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "delivery orders get successfully",
      data: result,
    });
  });


  export const orderController={
    getOrdersByCustomer,
    getAllOrders,
    updateOrder,getDeliveryOrder
  }