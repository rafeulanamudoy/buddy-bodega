import { Category } from "@prisma/client";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";
import httpStatus from "http-status";

const createCategory = async (payload: Category) => {
  const isExist = await prisma.category.findUnique({
    where: {
      categoryName: payload.categoryName.trim().toUpperCase(),
    },
  });
  if (isExist) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "this category name already exist"
    );
  }
  const result = await prisma.category.create({
    data: {
      categoryName: payload.categoryName.trim().toUpperCase(),
    },
  });

  return result;
};

const getCategories = async () => {
  const result = await prisma.category.findMany({});
  return result;
};

const deleteSingleCategory = async (id: string) => {
  const isExist = await prisma.category.findUnique({
    where: {
      id: id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "category  not exist ");
  }
  const result = await prisma.category.delete({
    where: {
      id: id,
    },
  });
  return result;
};

const updateSingleCategories = async (id: string, payload: Category) => {
  const isExist = await prisma.category.findUnique({
    where: {
      id: id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "category not exist ");
  }
  const result = await prisma.category.update({
    where: {
      id: id,
    },
    data: {
      ...payload,
    },
  });
  return result;
};

export const categoryService = {
  createCategory,
  getCategories,
  deleteSingleCategory,
  updateSingleCategories,
};
