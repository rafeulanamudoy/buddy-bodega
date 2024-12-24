import httpStatus from "http-status";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";
import {Prisma } from "@prisma/client";
const getOrdersByCustomer = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
    include: {
      customer: true,
    },
  });
  if (!user || !user?.customer) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "customer not fount");
  }
  const result = await prisma.orderModel.findMany({
    where: {
      customerId: user?.customer?.id,
    },
  });
  return result;
};

const getAllOrders = async () => {
  const result = await prisma.orderModel.findMany({});
  
  return result;
};
const getDeliveryOrder= async () => {
  const result = await prisma.orderModel.findMany({where:{
    status:"COMPLETED"
  }});
  
  return result;
};

const updateSingleOrder = async (id:string,payload:Prisma.OrderModelUpdateInput) => {
    const result = await prisma.orderModel.update({
        where:{
            id:id
        },data:{
            ...payload
        }
    });
    return result;
  };


export const orderService = {
  getOrdersByCustomer,
  getAllOrders,
  updateSingleOrder,
  getDeliveryOrder
};
