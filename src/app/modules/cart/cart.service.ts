import { CartModel } from "@prisma/client";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";
import httpStatus from "http-status";

const createCart = async (payload: CartModel) => {
  const result = await prisma.cartModel.create({
    data: {
      ...payload,
    },
  });

  return result;
};

export const updateCart = async (id: string, payload: Partial<CartModel>) => {
    const isExist=await prisma.cartModel.findFirst({
        where:{
            id:id
        }
    })
    if(!isExist){
        throw new ApiError(httpStatus.UNAUTHORIZED,"cart not fount")
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

 const deleteCart= async (id: string) => {

    const isExist=await prisma.cartModel.findFirst({
        where:{
            id:id
        }
    })
    if(!isExist){
        throw new ApiError(httpStatus.UNAUTHORIZED,"cart not fount")
    }
    const result = await prisma.cartModel.delete({
      where: {
        id: id,
      },
      
    });
  
    return result;
  };

export const cartService = {
  createCart,
  updateCart,
  deleteCart
};
