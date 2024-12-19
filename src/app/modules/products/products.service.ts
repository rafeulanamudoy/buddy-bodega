import { Prisma, Product } from "@prisma/client";
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
  filters: any,
  paginationOptions: IpaginationOptions
): Promise<IGenericResponse<Product[]>> => {
  const { skip, limit, page, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { query, ...filtersData } = filters;
  console.log(filtersData, "check filters data");
  let finalLimit = limit; // Using limit as received from paginationHelpers
  let sortCondition: { [key: string]: Prisma.SortOrder } = {};
  const andCondition: Prisma.ProductWhereInput[] = [];

  if (query) {
    andCondition.push({
      OR: [
        {
          name: {
            contains: query as string,
            mode: "insensitive",
          },
        },
      ],
    });
  }
  if (filtersData.brand) {
    andCondition.push({
      OR: [
        {
          brandName: filtersData.brand,
        },
      ],
    });
  }

  if (filtersData.sale) {
    console.log("check sale");
    andCondition.push({
      OR: [
        {
          discountPrice: {
            gt: 0,
          },
        },
      ],
    });
  }

  if (filtersData.newProduct) {
    console.log("check newProduct");
    // Limit to 10 results when filtering by newProduct
    finalLimit = 20;

    // Sort by latest createdAt
    // sortCondition['createdAt'] = Prisma.SortOrder.asc;
  }

  if (filtersData.category) {
    andCondition.push({
      category: {
        is: {
          categoryName: filtersData.category,
        },
      },
    });
  }

  // Ensure sortCondition is defined and assigned
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
    skip: skip,
    take: finalLimit, // Using updated finalLimit
    include: { category: true },
  });

  const count = await prisma.product.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit: finalLimit,
      count,
    },
    data: result,
  };
};

export const productService = {
  createProducts,
  getSingleProduct,
  getProducts,
};
