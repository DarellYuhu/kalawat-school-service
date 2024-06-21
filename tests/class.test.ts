import { expect, describe, beforeAll, test, it, afterAll } from "bun:test";
import { clearDatabase, seedDatabase } from "./helpers";
import app from "src/app";
import { classData } from "./datas";

let academicYearId: number;
let Class_Student: { studentId: string }[];
let classId: number;
let newClassId: number;
let studentIds: string[];

beforeAll(async () => {
  try {
    const { academicYear, students, _class, _newClass } = await seedDatabase();
    academicYearId = academicYear.id;
    Class_Student = students.map((item) => ({ studentId: item.id }));
    classId = _class.id;
    newClassId = _newClass.id;
    studentIds = students.map((item) => item.id);
  } catch (error) {
    console.log(error);
  }
});

afterAll(async () => {
  try {
    await clearDatabase();
  } catch (error) {
    console.log(error);
  }
});

describe("POST /class", () => {
  test.each(classData.badCondition(academicYearId, Class_Student))(
    "should return 400 when $cause",
    async (data) => {
      const { cause, ...payload } = data;
      const res = await app.request("/class", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      });
      expect(res.status).toBe(400);
    }
  );

  it("should return 201", async () => {
    const payload = {
      grade: 7,
      parallel: "A",
      academicYearId,
      Class_Student,
    };
    const res = await app.request("/class", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    expect(res.status).toBe(201);
    expect(data).toHaveProperty("data");
  });
});

describe("DELETE /class/:id", () => {
  it("should return 200", async () => {
    const res = await app.request(`/class/${classId}`, { method: "DELETE" });
    expect(res.status).toBe(200);
  });
});

describe("POST /class/:id", () => {
  it("should return 200", async () => {
    const res = await app.request(`/class/${newClassId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(studentIds.slice(4)),
    });
    const data = await res.json();
    expect(res.status).toBe(201);
    expect(data.data).toBeArray();
  });
});
