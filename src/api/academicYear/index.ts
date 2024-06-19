import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import academicYearSchema from "./academicYear.schema";
import academicYearService from "./academicYear.service";
import { Semester } from "@prisma/client";

const academicYear = new Hono();

academicYear.post(
  "/",
  zValidator("json", academicYearSchema.create),
  async (c) => {
    const { semester, year } = c.req.valid("json");
    try {
      const data = await academicYearService.create(semester as Semester, year);
      return c.json({
        status: "success",
        message: "Academic year created successfully",
        data,
      });
    } catch (error) {
      console.log(error);
    }
  }
);

export default academicYear;
