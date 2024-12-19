import { CartModel } from "@prisma/client";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";
import httpStatus from "http-status";

const createCart = async (payload: CartModel) => {
  const customer = await prisma.customer.findUnique({
    where: {
      id: payload.customerId,
    },
  });
  if (!customer) {
    throw new ApiError(400, "customer not found");
  }
  const result = await prisma.cartModel.create({
    data: {
      ...payload,
    },
  });

  return result;
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

  const result = await prisma.customer.findUnique({
    where: {
      id: user.customer.id, // Extract and pass the `id` as a string
    },
    include: {
      cart: true, // Includes the cart data
    },
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
