import { z } from "zod";

const addRemoveStudentPayload = z.array(z.string()).min(1);
const addRemoveStudentParam = z.object({
  classId: z.preprocess((val) => Number(val), z.number()),
});

export default { addRemoveStudentParam, addRemoveStudentPayload };
