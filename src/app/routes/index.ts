import express from "express";
import { userRoutes } from "../modules/user/user.route";
import { authRoute } from "../modules/auth/auth.routes";
import { customerRoute } from "../modules/customer/customer.route";
// import { brandRoute } from "../modules/brands/brands.route";
import { categoryRoute } from "../modules/categories/categories.route";
import { productRoute } from "../modules/products/products.route";

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
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
