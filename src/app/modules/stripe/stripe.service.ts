import Stripe from "stripe";
import config from "../../../config";
import { BillingAddress, OrderModel, TransactionModel } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { json } from "stream/consumers";
import ApiError from "../../errors/ApiErrors";
import httpStatus from "http-status";

const stripe = new Stripe(config.stripe.secretKey as string, {
  apiVersion: "2024-12-18.acacia",
});

const createPayment = async (data: {
  paymentMethodTypes: Stripe.Checkout.SessionCreateParams.PaymentMethodType[];
  currency: string;
  successUrl: string;
  cancelUrl: string;
  product: any;
  client_reference_id: string;
  billing_address_collection: BillingAddress;
  customerEmail: string;
}) => {
  // Serialize product data
  const serializedProducts = JSON.stringify(data.product);

  // Serialize billing and shipping addresses
  const serializedBillingAddress = JSON.stringify(data.billing_address_collection);


  const lineItems = data.product.map((product: any) => ({
    price_data: {
      currency: data.currency,
      product_data: {
        name: product.id,
      },
      unit_amount: product.mainPrice * 100, // Stripe expects amount in cents
    },
    quantity: product.quantity,
  }));


  const session = await stripe.checkout.sessions.create({
    payment_method_types: data.paymentMethodTypes,
    line_items: lineItems,
    mode: "payment",
    success_url: data.successUrl,
    cancel_url: data.cancelUrl,
  
    client_reference_id: data.client_reference_id,
    // customer:customer.id,

    metadata: {
   
      customer_product: serializedProducts,
      customer_billing_address: serializedBillingAddress
    },
  });


  return session;
};

const saveTransactionBillingAndOrder = async (session:any) => {
  try {
  //  console.log(session,"check session")

    // console.log(session.client_reference_id,"check client reference id")
    const findCustomer=await prisma.user.findUnique({
      where:{
        id:session.client_reference_id
      },include:{
        customer:true
      }
    })

    // console.log(findCustomer,"check findcustomer")
    if(!findCustomer || !findCustomer.customer  ){
      throw new ApiError(httpStatus.UNAUTHORIZED,"customer not found")
    }
    
   const customer_billing_address= JSON.parse(session.metadata.customer_billing_address)

   const product=JSON.parse(session.metadata.customer_product)

  //  console.log(customer_billing_address,"check customer billing address")
  //  console.log(product,"check product ")
      

      const order = await prisma.orderModel.create({
          data: {
              customerId: findCustomer.customer.id, 
              products: product,
              totalAmount: session.amount_total , 
              
          },
      });

      //  console.log(session.id,"check session id")
      const transaction = await prisma.transactionModel.create({
          data: {
              customerId: findCustomer.customer.id,
              orderId: order.id,
             
              amount: session.amount_total , 
              paymentMethod: session.payment_method_types[0], 
            
          }, 
      });
      const billingAddress=await prisma.billingAddress.create({
        data:{
          ...customer_billing_address
        }
      })
      let deleteMany
      // console.log(findCustomer.customer.id,"customer id")
      if (findCustomer.customer.id ) {
        // console.log(findCustomer.customer.id)
       deleteMany=  await prisma.cartModel.deleteMany({
          where: {
            customerId: findCustomer.customer.id,
          },
        });
      }


// console.log(deleteMany,"check ")
    

      return {
         
          order,
          transaction,
          billingAddress
      };
  } catch (error) {
      // console.error('Error saving transaction and order:', error);
      throw new Error('Error saving transaction and order.');
  }
};


export const stripeService = {
  createPayment,
  saveTransactionBillingAndOrder,
};
