import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { customerService } from "./customer.service";
import { uploadFileToSpace } from "../../../helpers/uploaderToS3";
import ApiError from "../../errors/ApiErrors";

const createCustomer = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const files = req.files as Express.Multer.File[];

  if (!files || files.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No files uploaded.");
  }

  const fileMap: { [key: string]: Express.Multer.File } = {};
  files.forEach((file) => {
    fileMap[file.fieldname] = file;
  });

  const uploadIdFile = fileMap["uploadId"];
  const uploadSelfieIdFile = fileMap["uploadSelfieId"];

  if (!uploadIdFile || !uploadSelfieIdFile) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Both 'uploadId' and 'uploadSelfieId' files are required."
    );
  }

  // Upload files asynchronously
  const [uploadIdUrl, uploadSelfieIdUrl] = await Promise.all([
    uploadFileToSpace(uploadIdFile, "customerUploadedIdFile"),
    uploadFileToSpace(uploadSelfieIdFile, "customerSelfieIdFile"),
  ]);

  // console.log(uploadIdUrl,"check url")
  const customerProfileData = {
    ...data,
    uploadId: uploadIdUrl,
    uploadSelfieId: uploadSelfieIdUrl,
  };

  // Call service to create the customer
  const result = await customerService.createCustomer(customerProfileData);

  const { otp, otpExpiry, identifier, password, createdAt, ...others } = result;

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Customer account created successfully.",
    data: others,
  });
});
const getSingleCustomer = catchAsync(async (req: any, res: Response) => {
  console.log(req.user, "check req.user");

  const result = await customerService.getSingleCustomer(req.user.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Customer account get successfully.",
    data: result,
  });
});
const updateProfile=catchAsync(async (req: any, res: Response) => {
  console.log(req.user, "check req.user");
  const data=req.body;

  if(req.body.email ||  req.body.phone){
    throw new ApiError(httpStatus.UNAUTHORIZED,"you are not allowed to update email or phone number")
  }

  const {firstName,lastName,profileImage,nickName,...customerProfile}=data

  
  const auth={firstName,lastName,profileImage,nickName}
  const result = await customerService.updateCustomerByemail(req.user.email,customerProfile,auth);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: " customer account updated successfully.",
    data: result,
  });
});
export const customerController = {
  createCustomer,
  getSingleCustomer,
  updateProfile
};
