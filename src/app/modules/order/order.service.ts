import httpStatus from "http-status";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";
import { OrderStatus, Prisma } from "@prisma/client";
import { stripeService } from "../stripe/stripe.service";
import { OnfleetService } from "../onfleet/onfleet.service";
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
      include: {
        transactions: true,
        customer: {
          select: {
            email: true,
            address: true,
            city: true,
            state: true,
            zipCode: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
                nickName: true,
                profileImage: true,
                phone: true,
              },
            },
          },
        },
        OrderProducts: {
          include: {
            product: true,
          },
        },
      },
    });

    // const result = await Promise.all(
    //   orders.map(async (order) => {
    //     const products = await prisma.orderProduct.findMany({
    //       where: { orderId: order.id },

    //     });

    //     return { orderId: order.id,products};
    //   })
    // );

    // console.log(result, "Orders with products");
    return orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to fetch orders"
    );
  }
};

const getAllOrders = async (status: string | undefined) => {
  let whereCondition = {};

  if (status) {
    whereCondition = {
      status: status.toUpperCase(),
    };
  }

  console.log(whereCondition, "check where condition");
  const result = await prisma.orderModel.findMany({
    where: whereCondition,
    include: {
      transactions: true,
      customer: {
        select: {
          email: true,
          address: true,
          city: true,
          state: true,
          zipCode: true,
          user: {
            select: {
              firstName: true,
              lastName: true,
              nickName: true,
              profileImage: true,
              phone: true,
            },
          },
        },
      },
      OrderProducts: {
        include: {
          product: true,
        },
      },
    },
  });

  return result;
};
const getDeliveryOrder = async () => {
  const result = await prisma.orderModel.findMany({
    where: {
      status: "COMPLETED",
    },
    include: {
      OrderProducts: true,
    },
  });

  return result;
};
const getPendingOrder = async () => {
  const result = await prisma.orderModel.findMany({
    where: {
      status: "PENDING",
    },
    include: {
      OrderProducts: true,
    },
  });

  return result;
};

const updateSingleOrder = async (
  id: string,
  payload: Prisma.OrderModelUpdateInput
) => {
  const result = await prisma.orderModel.update({
    where: {
      id: id,
    },
    data: {
      ...payload,
    },
  });
  return result;
};

const acceptOrder = async (id: string, payload: any) => {
  const result = await prisma.orderModel.update({
    where: {
      id: id,
    },
    data: {
      status: OrderStatus.COMPLETED,
    },
    include: {
      customer: true,
    },
  });

  const onfleetTask = await OnfleetService.createOnfleetTask({
    ...payload,
    orderId: id,
  });
  return { result, onfleetTask };
};
const cancelOrder = async (
  id: string,
  payload: Prisma.OrderModelUpdateInput
) => {
  try {
    const order = await prisma.orderModel.findUnique({
      where: {
        id: id,
      },
    });

    if (!order || !order.stripeSessionId) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Order or sessionId not found"
      );
    }

    const updatedOrder = await prisma.orderModel.update({
      where: {
        id: id,
      },
      data: {
        ...payload,
      },
    });

    const refund = await stripeService.refundPayment(order.stripeSessionId);

    return {
      updatedOrder,
      refund,
    };
  } catch (error) {
    console.error("Error during order cancellation and refund:", error);
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Could not cancel order and process refund"
    );
  }
};
export const orderService = {
  getOrdersByCustomer,
  getAllOrders,
  updateSingleOrder,
  getDeliveryOrder,
  getPendingOrder,
  cancelOrder,
  acceptOrder,
};
