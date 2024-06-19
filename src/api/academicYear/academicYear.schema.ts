import { Semester } from "@prisma/client";
import { z } from "zod";

const create = z.object({
  semester: z.enum(Object.values(Semester) as [string, ...string[]]),
  year: z.string().regex(/^\d{4}\/\d{4}$/, "Invalid year format"),
});

export default { create };
