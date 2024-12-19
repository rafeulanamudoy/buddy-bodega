// import { Request, Response } from "express";
// import catchAsync from "../../../shared/catchAsync";
// import sendResponse from "../../../shared/sendResponse";
// import httpStatus from "http-status";
// import { brandService } from "./brands.service";
// import ApiError from "../../errors/ApiErrors";
// import { uploadFileToSpace } from "../../../helpers/uploaderToS3";

// const createBrand = catchAsync(async (req: Request, res: Response) => {
//   const file = req.file;

//   if (!file) {
//     throw new ApiError(
//       httpStatus.UNAUTHORIZED,
//       "you have to upload brand image"
//     );
//   }
//   const brandImageUrl = await uploadFileToSpace(file, "brands");
//   const data = { ...req.body, brandImage: brandImageUrl };
//   const result = await brandService.createBrand(data);
//   sendResponse(res, {
//     statusCode: httpStatus.CREATED,
//     success: true,
//     message: "Brand Created successfully",
//     data: result,
//   });
// });

// const getBrands = catchAsync(async (req: Request, res: Response) => {
//   const result = await brandService.getBrands();
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "All Brand Get  Successfully",
//     data: result,
//   });
// });
// const deleteSingleBrand = catchAsync(async (req: Request, res: Response) => {
//   const result = await brandService.deleteSingleBrand(req.params.id);
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "Brand  deleted   Successfully",
//     data: result,
//   });
// });
// const updateSingleBrand = catchAsync(async (req: Request, res: Response) => {
//   const file = req.file;
//   let data = req.body;
//   let brandImageUrl;
//   if (file) {
//     brandImageUrl = await uploadFileToSpace(file, "brands");
//     data = { ...req.body, brandImage: brandImageUrl };
//   }

//   const result = await brandService.updateSingleBrand(req.params.id, data);
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "Brand  updated   Successfully",
//     data: result,
//   });
// });
// export const brandsController = {
//   createBrand,
//   getBrands,
//   deleteSingleBrand,
//   updateSingleBrand,
// };
