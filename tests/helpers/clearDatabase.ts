import prisma from "../../src/database";

export default async function clearDatabase() {
  await prisma.$transaction([prisma.academicYear.deleteMany()]);
}
