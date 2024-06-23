import prisma from "@database/index";

const addStudent = async (studentIds: string[], classId: number) => {
  return await prisma.class_Student.createManyAndReturn({
    data: studentIds.map((item) => ({ classId, studentId: item })),
    skipDuplicates: true,
  });
};

const removeStudent = async (studentIds: string[], classId: number) => {
  return await prisma.class_Student.deleteMany({
    where: {
      classId,
      studentId: {
        in: studentIds,
      },
    },
  });
};

export default { addStudent, removeStudent };
