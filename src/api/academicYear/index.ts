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
  zValidator("json", academicYearSchema.create),
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
          });
        }
      }
      throw error;
    }
  }
);

export default academicYear;
