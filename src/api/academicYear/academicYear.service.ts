import { Semester } from "@prisma/client";
import prisma from "../../database";

const create = async (semester: Semester, year: string) => {
  return await prisma.academicYear.create({
    data: {
      semester,
      year,
    },
  });
};

export default {
  create,
};
