import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import { Customer, User } from "@prisma/client";

export const createCustomer = async (payload: any) => {
  // Validate unique constraints
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
            californiaProducts: payload.californiaProducts,
            socialMediaName: payload.socialMediaName,
            socialMediaType: payload.socialMediaType,
            experienceEffect: payload.experienceEffect,
            familiarityType: payload.familiarityType,
            newProductsInDifferentCategory:
              payload.newProductsInDifferentCategory,
            oftenConsume: payload.oftenConsume,
            popularProducts: payload.popularProducts,
            staffFavorites: payload.staffFavorites,
            strain: payload.strain,
            tasteFlavor: payload.tasteFlavor,
            terpeneProfile: payload.terpeneProfile,
            typicallyConsume: payload.typicallyConsume,
            typicalProducts: payload.typicalProducts,
            differentCategories: payload.differentCategories,
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
   
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Customer Account  not found!");
  }

  return result;
};
export const updateCustomerByemail = async (
  email: string,
  customer: Partial<Customer>,
  user:  Partial <User>
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
};
