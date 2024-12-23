import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import { Customer, User, UserStatus } from "@prisma/client";
import emailSender from "../../../helpers/emailSender";





const sendOtpForCustomer = async (email: string) => {
  const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

  const html = `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>OTP Verification</title>
  </head>
  <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f6f9fc; margin: 0; padding: 0; line-height: 1.6;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
          <div style="background-color: #FF7600; background-image: linear-gradient(135deg, #FF7600, #45a049); padding: 30px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);">OTP Verification</h1>
          </div>
          <div style="padding: 20px 12px; text-align: center;">
              <p style="font-size: 18px; color: #333333; margin-bottom: 10px;">Hello,</p>
              <p style="font-size: 18px; color: #333333; margin-bottom: 20px;">Your OTP for verifying your account is:</p>
              <p style="font-size: 36px; font-weight: bold; color: #FF7600; margin: 20px 0; padding: 10px 20px; background-color: #f0f8f0; border-radius: 8px; display: inline-block; letter-spacing: 5px;">${randomOtp}</p>
              <p style="font-size: 16px; color: #555555; margin-bottom: 20px; max-width: 400px; margin-left: auto; margin-right: auto;">Please enter this OTP to complete the verification process. This OTP is valid for 5 minutes.</p>
              <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                  <p style="font-size: 14px; color: #888888; margin-bottom: 4px;">Thank you for choosing our service!</p>
                  <p style="font-size: 14px; color: #888888; margin-bottom: 0;">If you didn't request this OTP, please ignore this email.</p>
              </div>
          </div>
          <div style="background-color: #f9f9f9; padding: 10px; text-align: center; font-size: 12px; color: #999999;">
              <p style="margin: 0;">© 2023 Your Company Name. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>`;

  // Send the OTP email
  await emailSender("OTP", email, html);


  const existingOtp = await prisma.otpModel.findUnique({
    where: { email },
  });

  if (existingOtp) {
 
    await prisma.otpModel.update({
      where: { email },
      data: {
        code: randomOtp,
        otpExpiry: otpExpiry,
      },
    });
  } else {
    // Create a new OTP record
    await prisma.otpModel.create({
      data: {
        code: randomOtp,
        otpExpiry: otpExpiry,
        email,
      },
    });
  }

  return randomOtp;
};

const verifyOtp = async (payload: any) => {
  const existingOtp = await prisma.otpModel.findUnique({
    where: {
      email: payload.email,
    },
  });
  console.log(existingOtp,"check existing otp")

  if (existingOtp?.code !== payload.otp) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "wrong otp ");
  }

  if (existingOtp && existingOtp.otpExpiry) {
    if (new Date() > existingOtp.otpExpiry) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Your OTP has expired. Please request a new one.");
    }
  }

  await prisma.user.update({
    where: {
      email: payload.email,
    },
    data: {
      status: UserStatus.ACTIVE,  // Ensure UserStatus.ACTIVE is correctly referenced
    },
  });
};

    


 const createCustomer = async (payload: any) => {
  // Fetch OTP data for the user
  // const otpData = await prisma.otpModel.findUnique({
  //   where: {
  //     email: payload.email,
  //   },
  // });


  // if (!otpData) {
  //   throw new ApiError(httpStatus.UNAUTHORIZED, "No OTP found for this email.");
  // }


  // if (otpData.code !== payload.otp) {
  //   throw new ApiError(httpStatus.UNAUTHORIZED, "Your OTP is incorrect.");
  // }

  // if(otpData.otpExpiry){
  //   if (new Date() > otpData.otpExpiry) {
  //     throw new ApiError(httpStatus.UNAUTHORIZED, "Your OTP has expired. Please request a new one.");
  //   }
  // }

  const [isEmailExist, isNickNameExist] = await Promise.all([
    prisma.user.findUnique({ where: { email: payload.email } }),
    prisma.user.findUnique({ where: { nickName: payload.nickName } }),
  ]);

  if (isEmailExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email is already in use.");
  }

  if (isNickNameExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Username is already taken.");
  }

  try {
    // Transactional creation of user and customer
    const { user, customer } = await prisma.$transaction(
      async (transactionClient) => {
        const hashedPassword = await bcrypt.hash(payload.password, 12);

        // Create User
        const createdUser = await transactionClient.user.create({
          data: {
            email: payload.email,
            password: hashedPassword,
            nickName: payload.nickName,
            firstName: payload.firstName,
            lastName: payload.lastName,
            phone: payload.phone,
            role: "USER",
          },
        });

        // Create Customer
        const createdCustomer = await transactionClient.customer.create({
          data: {
            email: payload.email,
            address: payload.address,
            city: payload.city,
            state: payload.state,
            zipCode: payload.zipCode,
            uploadId: payload.uploadId,
            uploadSelfieId: payload.uploadSelfieId,
            socialMediaName: payload.socialMediaName,
            socialMediaType: payload.socialMediaType,
          },
        });

        return { user: createdUser, customer: createdCustomer };
      }
    );

    return user; // Returning both user and customer data
  } catch (error: any) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
  }
};

export const getSingleCustomer = async (id: string) => {
  const result = await prisma.user.findUnique({
    where: {
      id: id,
    },
    include: {
      customer: true,
    },
  
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Customer Account  not found!");
  }

  return result;
};
export const updateCustomerByemail = async (
  email: string,
  customer: Partial<Customer>,
  user: Partial<User>
 
) => {
  const currentUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (!currentUser) {
    throw new ApiError(404, "User not found.");
  }

  if (user.nickName) {
    const existingChef = await prisma.user.findUnique({
      where: { nickName: user.nickName },
    });
    if (existingChef) {
      throw new ApiError(
        400,
        "This username is already taken. Please try another."
      );
    }

    if (currentUser?.nickName === user.nickName) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "same user name provide by you"
      );
    }
  }

  const result = await prisma.$transaction(async (prisma) => {
    const updatedChef = await prisma.customer.update({
      where: { email: currentUser.email },
      data: {
        ...customer,
      },
    });

    const updatedUser = await prisma.user.update({
      where: { email: email },
      data: {
        ...user,
      },
    });

    return { updatedChef, updatedUser };
  });

  return result;
};


export const customerService = {
  createCustomer,
  getSingleCustomer,
  updateCustomerByemail,
 sendOtpForCustomer,
 verifyOtp
};
