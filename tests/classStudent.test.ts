import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import app from "src/app";
import { clearDatabase, seedDatabase } from "./helpers";

let classId: number;
let studentIds: string[];

beforeAll(async () => {
  try {
    const { _class, students } = await seedDatabase();
    classId = _class.id;
    studentIds = students.map((item) => item.id);
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

describe("POST /class/:id/student", () => {
  it("should return 201", async () => {
    const res = await app.request(`/class/${classId}/student`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(studentIds.slice(0, 4)),
    });
    const data = await res.json();
    expect(res.status).toBe(201);
    expect(data.data).toBeArray();
  });
});

describe("DELETE /class/:id/student", () => {
  it("should return 200", async () => {
    const res = await app.request(`/class/${classId}/student`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(studentIds.slice(4, 5)),
    });
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.data).toHaveProperty("count");
  });
});
