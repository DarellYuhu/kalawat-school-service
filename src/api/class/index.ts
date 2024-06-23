import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import classSchema from "./class.schema";
import classService from "./class.service";

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

export default _class;
