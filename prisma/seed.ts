// import { PrismaClient } from "@/app/generated/prisma/client";

import { PrismaClient } from "@prisma/client/extension";


const prisma = new PrismaClient();

async function main() {
  const now = new Date();
  const future = new Date(now);
  future.setMonth(future.getMonth() + 1);

  const future2 = new Date(now);
  future2.setMonth(future2.getMonth() + 2);

  await prisma.preorder.createMany({
    data: [
      {
        name: "iPhone 15 Pro",
        productCount: 50,
        preorderWhen: new Date(now),
        startAt: new Date(now),
        endAt: future,
        status: "active",
      },
      {
        name: "Samsung Galaxy S24",
        productCount: 30,
        preorderWhen: new Date(now),
        startAt: future,
        endAt: future2,
        status: "active",
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
