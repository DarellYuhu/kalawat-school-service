import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import academicYearSchema from "./academicYear.schema";
import academicYearService from "./academicYear.service";
import { Semester } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { HTTPException } from "hono/http-exception";

const academicYear = new Hono();

academicYear.post(
  "/",
  zValidator("json", academicYearSchema.create, (res, c) => {
    if (!res.success) {
      throw new HTTPException(400, {
        message: "Please provide valid data",
        cause: res.error,
      });
    }
  }),
  async (c) => {
    try {
      const { semester, year } = c.req.valid("json");
      const data = await academicYearService.create(semester as Semester, year);
      return c.json(
        {
          status: "success",
          message: "Academic year created successfully",
          data,
        },
        201
      );
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new HTTPException(409, {
            message: "Semester and year already exist",
            cause: error,
          });
        }
      }
      throw error;
    }
  }
);

academicYear.delete(
  "/:id",
  zValidator("param", academicYearSchema.removeParam, (res, c) => {
    if (!res.success) {
      throw new HTTPException(400, {
        message: "Please provide valid data",
        cause: res.error,
      });
    }
  }),
  async (c) => {
    try {
      const { id } = c.req.valid("param");
      const data = await academicYearService.remove(id);
      return c.json({
        status: "success",
        message: "Academic year deleted successfully",
        data,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new HTTPException(404, {
            message: "Record doesn't exist",
            cause: error,
          });
        }
      }
      throw error;
    }
  }
);

export default academicYear;
