import { beforeAll, afterAll, expect, test, describe, it } from "bun:test";
import app from "../src/app";
import { clearDatabase, seedDatabase } from "./helpers";
import { AcademicYear } from "@prisma/client";
import { ZodError } from "zod";

let academicYearId: number;

beforeAll(async () => {
  try {
    const { academicYear } = await seedDatabase();
    academicYearId = academicYear.id;
  } catch (error) {
    console.log("ERR_CLASS_STUDENT_PRETEST: ", error);
  }
});

afterAll(async () => {
  try {
    await clearDatabase();
  } catch (error) {
    console.log("ERR_CLASS_STUDENT_POSTTEST: ", error);
  }
});

describe("POST /academic-year", () => {
  const condition = [
    { case: "no year", semester: "GANJIL" },
    { case: "no semester", year: "2023/2024" },
    { case: "false semester input", semester: "EVEN", year: "2023/2024" },
    { case: "false year input", semester: "GENAP", year: "2023/20" },
    { case: "no data" },
  ];
  test.each(condition)("should return 400 when $case", async (data) => {
    const { case: string, ...payload } = data;
    const res = await app.request("/academic-year", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });
    const result = await res.json();
    expect(res.status).toBe(400);
    expect(result).toHaveProperty("success", false);
  });

  it("should return 201", async () => {
    const payload = { semester: "GENAP", year: "2024/2025" };
    const res = await app.request("/academic-year", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });
    expect(res.status).toBe(201);
  });

  it("should return 409 when same data already exist", async () => {
    const payload = { semester: "GENAP", year: "2024/2025" };
    const res = await app.request("/academic-year", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });
    expect(res.status).toBe(409);
  });
});

describe("DELETE /academic-year/:id", () => {
  it("should fail when invalid parameter type (400)", async () => {
    const res = await app.request(`/academic-year/${academicYearId}AXD`, {
      method: "DELETE",
    });
    const data: TResponse<ZodError> = await res.json();
    expect(res.status).toBe(400);
    expect(data.error).toHaveProperty("name", "ZodError");
  });

  it("should fail when academic year didn't exist (404)", async () => {
    const res = await app.request(`/academic-year/${academicYearId}123`, {
      method: "DELETE",
    });
    expect(res.status).toBe(404);
  });

  it("should return 200", async () => {
    const res = await app.request(`/academic-year/${academicYearId}`, {
      method: "DELETE",
    });
    const data: TResponse<AcademicYear> = await res.json();
    expect(res.status).toBe(200);
    expect(data.data).toHaveProperty("id");
  });
});
