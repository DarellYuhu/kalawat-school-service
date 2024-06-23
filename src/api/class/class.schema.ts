import { z } from "zod";

const create = z.object({
  grade: z.number().min(7).max(9),
  parallel: z
    .string()
    .max(1)
    .transform((val) => val.toUpperCase()),
  academicYearId: z.number(),
  Class_Student: z.array(z.object({ studentId: z.string() })).min(1),
});

const remove = z.object({
  id: z.preprocess((val) => Number(val), z.number()),
});

export default { create, remove };
