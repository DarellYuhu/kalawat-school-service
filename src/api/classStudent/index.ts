import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import classStudentSchema from "./classStudent.schema";
import classStudentService from "./classStudent.service";

const classStudent = new Hono();

classStudent.post(
  "/:classId/student",
  zValidator("json", classStudentSchema.addRemoveStudentPayload),
  zValidator("param", classStudentSchema.addRemoveStudentParam),
  async (c) => {
    const payload = c.req.valid("json");
    const { classId } = c.req.valid("param");
    const data = await classStudentService.addStudent(payload, classId);
    return c.json(
      {
        status: "success",
        message: "Student add successfully",
        data,
      },
      201
    );
  }
);

classStudent.delete(
  "/:classId/student",
  zValidator("json", classStudentSchema.addRemoveStudentPayload),
  zValidator("param", classStudentSchema.addRemoveStudentParam),
  async (c) => {
    const payload = c.req.valid("json");
    const { classId } = c.req.valid("param");
    const data = await classStudentService.removeStudent(payload, classId);
    return c.json(
      {
        status: "success",
        message: "Student removed successfully",
        data,
      },
      200
    );
  }
);

export default classStudent;
