import { CartModel } from "@prisma/client";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";
import httpStatus from "http-status";

const createCart = async (payload: CartModel) => {
  const customer = await prisma.user.findUnique({
    where: {
      id: payload.customerId,
    },
  });
  if (!customer) {
    throw new ApiError(400, "customer not found");
  }
  const findCustomer = await prisma.customer.findUnique({
    where: {
      email: customer.email,
    },
  });
  if (findCustomer) {
    const result = await prisma.cartModel.create({
      data: {
        quantity: payload.quantity,
        customerId: findCustomer?.id,
        productId: payload.productId,
      },
    });
    return result;
  }
};

export const updateCart = async (id: string, payload: Partial<CartModel>) => {
  const isExist = await prisma.cartModel.findFirst({
    where: {
      id: id,
    },
  });
  if (!isExist) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "cart not fount");
  }
  const result = await prisma.cartModel.update({
    where: {
      id: id,
    },
    data: {
      ...payload,
    },
  });

  return result;
};

const deleteCart = async (id: string) => {
  const isExist = await prisma.cartModel.findFirst({
    where: {
      id: id,
    },
  });
  if (!isExist) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "cart not fount");
  }
  const result = await prisma.cartModel.delete({
    where: {
      id: id,
    },
  });

  return result;
};

export const getCartByCustomer = async (id: string) => {
  const user = await prisma.user.findFirst({
    where: {
      id: id,
    },
    select: {
      customer: true, // Assumes "customer" is an object containing `id`
    },
  });

  if (!user || !user.customer || !user.customer.id) {
    throw new ApiError(httpStatus.NOT_FOUND, "Customer not found");
  }

  const result = await prisma.cartModel.findMany({
    where: {
      customerId: user.customer.id, // Extract and pass the `id` as a string
    },
  include :{
    product : true
  }

  
   
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Cart not found for the customer");
  }

  return result;
};
export const cartService = {
  createCart,
  updateCart,
  deleteCart,
  getCartByCustomer,
};
