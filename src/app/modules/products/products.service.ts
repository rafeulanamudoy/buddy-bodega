import { Prisma, Product, User, UserRole } from "@prisma/client";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";
import httpStatus from "http-status";
import { IFilters, searchableField } from "../../../helpers/searchableField";
import { IpaginationOptions } from "../../../helpers/paginationOption";
import { IGenericResponse } from "../../../helpers/general";
import { paginationHelpers } from "../../../helpers/paginationHelper";

export const createProducts = async (payload: Product) => {
  console.log(payload, "check payload");
  const isExist = await prisma.product.findUnique({
    where: {
      name: payload.name.trim().toUpperCase(),
    },
  });
  if (isExist) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "this product  name already exist"
    );
  }
  const result = await prisma.product.create({
    data: {
      name: payload.name.trim().toUpperCase(),

      brandName: payload.brandName,
      details: payload.details,
      mainPrice: payload.mainPrice,
      categoryId: payload.categoryId,
      discountPrice: payload.discountPrice || 0,
      productImage: payload.productImage,
    },
  });

  return result;
};

const getSingleProduct = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: {
      id: id,
    },
    include: {
      category: true,
      reviews: true,
    },
  });
  if (!product) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "product not found");
  }
  return product;
};

const getProducts = async (
  user: User | undefined, // User can be undefined
  filters: any,
  paginationOptions: IpaginationOptions
): Promise<IGenericResponse<Product[]>> => {
  const { skip, limit, page, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { query, ...filtersData } = filters;
  let finalLimit = limit;
  let sortCondition: { [key: string]: Prisma.SortOrder } = {};
  const andCondition: Prisma.ProductWhereInput[] = [];

  if (user) {
    const existingUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        customer: { select: { differentCategories: true } },
      },
    });

    if (
      user.role === UserRole.USER &&
      existingUser &&
      existingUser.customer &&
      !existingUser.customer.differentCategories.includes("ALL")
    ) {
      andCondition.push({
        OR: existingUser.customer.differentCategories.map((category) => ({
          category: { is: { categoryName: category } },
        })),
      });
    }
  }

  if (query) {
    andCondition.push({
      OR: [{ name: { contains: query as string, mode: "insensitive" } }],
    });
  }

  if (filtersData.brand) {
    andCondition.push({ OR: [{ brandName: filtersData.brand }] });
  }

  if (filtersData.sale) {
    andCondition.push({ OR: [{ discountPrice: { gt: 0 } }] });
  }

  if (filtersData.newProduct) {
    finalLimit = 20;
  }

  if (filtersData.category) {
    andCondition.push({
      category: { is: { categoryName: filtersData.category } },
    });
  }

  if (sortBy && sortOrder) {
    sortCondition[sortBy] =
      sortOrder === "asc" ? Prisma.SortOrder.asc : Prisma.SortOrder.desc;
  }

  const whereConditions: Prisma.ProductWhereInput = {
    AND: andCondition.length > 0 ? andCondition : undefined,
  };

  const result = await prisma.product.findMany({
    where: whereConditions,
    orderBy: sortCondition,
    skip,
    take: finalLimit,
    include: { category: true },
  });

  const count = await prisma.product.count({ where: whereConditions });

  return {
    meta: { page, limit: finalLimit, count },
    data: result,
  };
};
export const productService = {
  createProducts,
  getSingleProduct,
  getProducts,
};
