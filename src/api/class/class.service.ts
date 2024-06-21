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
  await prisma.$transaction([
    prisma.class_Student.deleteMany({
      where: {
        classId: id,
      },
    }),
    prisma.class.deleteMany({
      where: {
        id,
      },
    }),
  ]);
};

const addStudent = async (studentIds: string[], classId: number) => {
  return await prisma.class_Student.createManyAndReturn({
    data: studentIds.map((item) => ({ classId, studentId: item })),
    skipDuplicates: true,
  });
};

export default { create, remove, addStudent };
