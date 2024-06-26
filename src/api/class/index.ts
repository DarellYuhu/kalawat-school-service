import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import classSchema from "./class.schema";
import classService from "./class.service";
import { Prisma } from "@prisma/client";
import { HTTPException } from "hono/http-exception";

const _class = new Hono();

_class.post(
  "/",
  zValidator("json", classSchema.create, (res, c) => {
    if (!res.success) {
      throw new HTTPException(400, {
        message: "Invalid param",
        cause: res.error,
      });
    }
  }),
  async (c) => {
    try {
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
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2003") {
          throw new HTTPException(404, {
            message: "Unkown IDs included",
            cause: error,
          });
        }
        if (error.code === "P2002") {
          throw new HTTPException(409, {
            message: "Class already exist",
            cause: error,
          });
        }
      }
      throw error;
    }
  }
);

_class.delete(
  "/:id",
  zValidator("param", classSchema.remove, (res, c) => {
    if (!res.success) {
      throw new HTTPException(400, {
        message: "Invalid param",
        cause: res.error,
      });
    }
  }),
  async (c) => {
    try {
      const { id } = c.req.valid("param");
      const data = await classService.remove(id);
      return c.json({
        status: "success",
        message: "Class deleted successfully",
        data,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new HTTPException(404, {
            message: "Class didn't exist",
            cause: error,
          });
        }
      }
      throw error;
    }
  }
);

export default _class;
