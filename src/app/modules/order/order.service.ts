import httpStatus from "http-status";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";
import {Prisma } from "@prisma/client";
const getOrdersByCustomer = async (id: string) => {
  try {
    // Fetch the user and their associated customer record
    const user = await prisma.user.findUnique({
      where: { id },
      include: { customer: true },
    });

    if (!user || !user?.customer) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Customer not found");
    }

    const orders = await prisma.orderModel.findMany({
      where: { customerId: user.customer.id },
      select: { id: true },
    });

    const result = await Promise.all(
      orders.map(async (order) => {
        const products = await prisma.orderProduct.findMany({
          where: { orderId: order.id }, 
          include: { product: true,order:true }, 
        });

        return { orderId: order.id, products };
      })
    );

    console.log(result, "Orders with products");
    return result;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to fetch orders");
  }
};

const getAllOrders = async () => {
  const result = await prisma.orderModel.findMany({
    include: {
      transactions: true, // Include transaction data
    },
  });

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
