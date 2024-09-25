import { PrismaClient } from "@prisma/client";

export const GET = async () => {
  const client = new PrismaClient();
  const result = await client.pet.findMany();
  return Response.json(result);
};
