import prisma from "@database/index";

export default async function clearDatabase() {
  await prisma.$transaction([
    prisma.class_Student.deleteMany(),
    prisma.class.deleteMany(),
    prisma.student.deleteMany(),
    prisma.user.deleteMany(),
    prisma.academicYear.deleteMany(),
  ]);
}
