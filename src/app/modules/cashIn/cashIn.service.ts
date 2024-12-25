import httpStatus from "http-status";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";

const createCashIn = async (payload: any) => {

    console.log(payload,"check payload")
  try {
    console.log(payload.client_reference_id, "check client reference id");
    const findCustomer = await prisma.user.findUnique({
      where: {
        id: payload.client_reference_id,
      },
      include: {
        customer: true,
      },
    });

    console.log(findCustomer, "check findcustomer");
    if (!findCustomer || !findCustomer.customer) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "customer not found");
    }

    const order = await prisma.orderModel.create({
      data: {
        customerId: findCustomer.customer.id,
    
        totalAmount: payload.amount_total,
      },
    });

    const transaction = await prisma.transactionModel.create({
      data: {
        customerId: findCustomer.customer.id,
        orderId: order.id,

        amount: payload.amount_total,
        paymentMethod: payload.paymentMethodTypes[0],
      },
    });
    const billingAddress = await prisma.billingAddress.create({
      data: {
        ...payload.billing_address_collection,
      },
    });
    let deleteMany;
    console.log(findCustomer.customer.id, "customer id");
    if (findCustomer.customer.id) {
      console.log(findCustomer.customer.id);
      deleteMany = await prisma.cartModel.deleteMany({
        where: {
          customerId: findCustomer.customer.id,
        },
      });
    }

    console.log(deleteMany, "check ");

    return {
      order,
      transaction,
      billingAddress,
    };
  } catch (error) {
    console.error("Error saving transaction and order:", error);
    throw new Error("Error saving transaction and order.");
  }
};

export const cashInService = {
  createCashIn
};
