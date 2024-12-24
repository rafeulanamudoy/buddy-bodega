import httpStatus from "http-status";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";
import {Prisma } from "@prisma/client";
const getTransactionByCustomer = async (id: string) => {
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
  const result = await prisma.transactionModel.findMany({
    where: {
      customerId: user?.customer?.id,
    },
  });
  return result;
};

const getAllTransaction = async () => {
  const result = await prisma.transactionModel.findMany({include:{
    order:true,
    
  }});
  
  return result;
};


export const transactionService = {
  getTransactionByCustomer,
  getAllTransaction,

};
