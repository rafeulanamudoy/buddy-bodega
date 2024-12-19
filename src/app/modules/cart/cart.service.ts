import { CartModel } from "@prisma/client";
import prisma from "../../../shared/prisma";

const createCart = async (payload: CartModel) => {
  const result = await prisma.cartModel.create({
    data: {
      ...payload,
    },
  });

  return result;
};

export const cartService = {
  createCart,
};
