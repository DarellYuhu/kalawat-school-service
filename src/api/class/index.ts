import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import classSchema from "./class.schema";
import classService from "./class.service";
import { z } from "zod";

const _class = new Hono();

_class.post("/", zValidator("json", classSchema.create), async (c) => {
  const { Class_Student, ...data } = c.req.valid("json");
  const result = await classService.create(data, Class_Student);
  return c.json(
    {
      status: "success",
      message: "Class created successfully",
      data: result,
    },
    201
  );
});

_class.delete("/:id", zValidator("param", classSchema.remove), async (c) => {
  const { id } = c.req.valid("param");
  const data = await classService.remove(id);
  return c.json({
    status: "success",
    message: "Class deleted successfully",
    data,
  });
});

_class.post(
  "/:classId",
  zValidator("json", classSchema.addStudentPayload),
  zValidator("param", classSchema.addStudentParam),
  async (c) => {
    const payload = c.req.valid("json");
    const { classId } = c.req.valid("param");
    const data = await classService.addStudent(payload, classId);
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

export default _class;
