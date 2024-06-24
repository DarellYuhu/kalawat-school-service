import { Semester } from "@prisma/client";
import prisma from "@database/index";

const create = async (semester: Semester, year: string) => {
  return await prisma.academicYear.create({
    data: {
      semester,
      year,
    },
  });
};

const remove = async (id: number) => {
  const classStudent = prisma.class_Student.deleteMany({
    where: {
      Class: {
        academicYearId: id,
      },
    },
  });
  const classes = prisma.class.deleteMany({
    where: { academicYearId: id },
  });
  const academicYear = prisma.academicYear.delete({
    where: { id },
  });

  const { "2": result } = await prisma.$transaction([
    classStudent,
    classes,
    academicYear,
  ]);
  return result;
};

export default { create, remove };
