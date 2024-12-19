// import { Brand } from "@prisma/client";
// import prisma from "../../../shared/prisma";
// import ApiError from "../../errors/ApiErrors";
// import httpStatus from "http-status";

// const createBrand = async (payload: Brand) => {
//   const isExist = await prisma.brand.findFirst({
//     where: {
//       brandName: payload.brandName.trim().toUpperCase(),
//     },
//   });
//   if (isExist) {
//     throw new ApiError(httpStatus.BAD_REQUEST, "this brandname already exist");
//   }
//   const result = await prisma.brand.create({
//     data: {
//       brandName: payload.brandName.trim().toUpperCase(),
//       brandImage: payload.brandImage,
//     },
//   });

//   return result;
// };

// const getBrands = async () => {
//   const result = await prisma.brand.findMany({});
//   return result;
// };

// const deleteSingleBrand = async (id: string) => {
//   const isExist = await prisma.brand.findFirst({
//     where: {
//       id: id,
//     },
//   });

//   if (!isExist) {
//     throw new ApiError(httpStatus.UNAUTHORIZED, "brand not exist ");
//   }
//   const result = await prisma.brand.delete({
//     where: {
//       id: id,
//     },
//   });
//   return result;
// };

// const updateSingleBrand = async (id: string, payload: Brand) => {
//   const isExist = await prisma.brand.findFirst({
//     where: {
//       id: id,
//     },
//   });

//   if (!isExist) {
//     throw new ApiError(httpStatus.UNAUTHORIZED, "brand not exist ");
//   }
//   const result = await prisma.brand.update({
//     where: {
//       id: id,
//     },
//     data: {
//       ...payload,
//     },
//   });
//   return result;
// };

// export const brandService = {
//   createBrand,
//   getBrands,
//   deleteSingleBrand,
//   updateSingleBrand,
// };
