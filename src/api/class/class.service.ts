import prisma from "@database/index";
import { Prisma } from "@prisma/client";

const create = async (
  data: Prisma.ClassUncheckedCreateInput,
  students: { studentId: string }[]
) => {
  return await prisma.class.create({
    data: {
      ...data,
      Class_Student: {
        createMany: { data: students, skipDuplicates: true },
      },
    },
  });
};

const remove = async (id: number) => {
  const { "1": result } = await prisma.$transaction([
    prisma.class_Student.deleteMany({
      where: {
        classId: id,
      },
    }),
    prisma.class.delete({
      where: {
        id,
      },
    }),
  ]);
  return result;
};

export default { create, remove };
