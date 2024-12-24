import express from "express";
import { userRoutes } from "../modules/user/user.route";
import { authRoute } from "../modules/auth/auth.routes";
import { customerRoute } from "../modules/customer/customer.route";
// import { brandRoute } from "../modules/brands/brands.route";
import { categoryRoute } from "../modules/categories/categories.route";
import { productRoute } from "../modules/products/products.route";
import { cartRoute } from "../modules/cart/cart.route";
import { StripeRoutes } from "../modules/stripe/stripe.route";
import { orderRoute } from "../modules/order/order.route";
import { transactionRoute } from "../modules/transaction/transaction.route";
import { cashInRoute } from "../modules/cashIn/cashInRoute";
// import { StripeRoutes } from "../modules/stripe/stripe.route";

const router = express.Router();

const moduleRoutes = [
  // {
  //   path: "/users",
  //   route: userRoutes,
  // },

  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/customer",
    route: customerRoute,
  },
  // {
  //   path: "/brand",
  //   route: brandRoute,
  // },
  {
    path: "/category",
    route: categoryRoute,
  },
  {
    path: "/product",
    route: productRoute,
  },{
    path:"/cart",
    route:cartRoute
  },
  {
    path:"/stripe",
    route:StripeRoutes
  },
  {
    path:"/order",
    route:orderRoute
  },
  {
    path:"/transaction",
    route:transactionRoute
  },
  {
    path:"/cashIn",
    route:cashInRoute
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
