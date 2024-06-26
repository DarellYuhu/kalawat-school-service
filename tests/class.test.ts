import { expect, describe, beforeAll, test, it, afterAll } from "bun:test";
import { clearDatabase, seedDatabase } from "./helpers";
import app from "src/app";
import { classData } from "./datas";
import { Class, Prisma } from "@prisma/client";
import { ZodError } from "zod";

let academicYearId: number;
let Class_Student: { studentId: string }[];
let classId: number;

beforeAll(async () => {
  try {
    const { academicYear, students, _class } = await seedDatabase();
    academicYearId = academicYear.id;
    Class_Student = students.map((item) => ({ studentId: item.id }));
    classId = _class.id;
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

describe("POST /class", () => {
  test.each(classData.badCondition(academicYearId, Class_Student))(
    "should fail when $cause (400)",
    async (data) => {
      const { cause, ...payload } = data;
      const res = await app.request("/class", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      });
      const result: TResponse<ZodError> = await res.json();
      expect(res.status).toBe(400);
      expect(result.status).toBe("error");
      expect(result.error?.issues).toBeArray();
    }
  );

  it("should fail when unkown IDs is submitted (404)", async () => {
    const payload = {
      grade: 7,
      parallel: "B",
      academicYearId,
      Class_Student: [{ studentId: "unkown" }, ...Class_Student],
    };
    const res = await app.request("/class", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });
    const data: TResponse<Prisma.PrismaClientKnownRequestError> =
      await res.json();
    expect(res.status).toBe(404);
    expect(data.error?.code).toBe("P2003");
  });

  it("should fail when academic year didn't exist (404)", async () => {
    const payload = {
      grade: 7,
      parallel: "B",
      academicYearId: 1234,
      Class_Student,
    };
    const res = await app.request("/class", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });
    const data: TResponse<Prisma.PrismaClientKnownRequestError> =
      await res.json();
    expect(res.status).toBe(404);
    expect(data.error?.code).toBe("P2003");
  });

  it("should success create class (201)", async () => {
    const payload = {
      grade: 7,
      parallel: "B",
      academicYearId,
      Class_Student,
    };
    const res = await app.request("/class", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });
    const data: TResponse<Class> = await res.json();
    expect(res.status).toBe(201);
    expect(data.data?.id).toBeNumber();
  });

  it("should fail when class already exist (409)", async () => {
    const payload = {
      grade: 7,
      parallel: "B",
      academicYearId,
      Class_Student,
    };
    const res = await app.request("/class", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });
    const data: TResponse<Prisma.PrismaClientKnownRequestError> =
      await res.json();
    expect(res.status).toBe(409);
    expect(data.error?.code).toBe("P2002");
  });
});

describe("DELETE /class/:id", () => {
  it("should fail when invalid param type (400)", async () => {
    const res = await app.request("/class/XYZ", { method: "DELETE" });
    const data: TResponse<ZodError> = await res.json();
    expect(res.status).toBe(400);
    expect(data.status).toBe("error");
    expect(data.error?.issues).toBeArray();
  });

  it("should fail when class didn't exist (404)", async () => {
    const res = await app.request(`/class/1234`, { method: "DELETE" });
    const data: TResponse<Prisma.PrismaClientKnownRequestError> =
      await res.json();
    expect(res.status).toBe(404);
    expect(data.status).toBe("error");
    expect(data.error?.code).toBe("P2025");
  });

  it("should delete class successfully (200)", async () => {
    const res = await app.request(`/class/${classId}`, { method: "DELETE" });
    const data: TResponse<Class> = await res.json();
    expect(res.status).toBe(200);
    expect(data.data?.id).toBeNumber();
  });
});
