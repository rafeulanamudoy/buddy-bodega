import { UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../shared/prisma";

export const initiateSuperAdmin = async () => {
  const payload = {
    firstName: "Super",
    lastName: "Admin",
    nickName: "superAdmin",
    email: "superadmin@gmail10p.com",
    password: "123456",
    role: UserRole.SUPER_ADMIN,

    phone: "01515635005",
  };

  const existingSuperAdmin = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (existingSuperAdmin) {
    return;
  }

  await prisma.$transaction(async (TransactionClient) => {
    const hashedPassword: string = await bcrypt.hash(payload.password, 12);

    await TransactionClient.user.create({
      data: {
        firstName: payload.firstName,
        lastName: payload?.lastName,
        email: payload.email,
        password: hashedPassword,
        role: payload.role,
        nickName: "admin",
        phone: "01515635005",
      },
    });

    await TransactionClient.admin.create({
      data: {
        email: payload.email,
        nickName: payload.nickName,
      },
    });
  });
};
