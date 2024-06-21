import { afterAll, expect, test, describe, it } from "bun:test";
import app from "../src/app";
import { clearDatabase } from "./helpers";

afterAll(async () => {
  try {
    await clearDatabase();
  } catch (error) {
    console.log(error);
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
    const payload = { semester: "GENAP", year: "2023/2024" };
    const res = await app.request("/academic-year", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });
    expect(res.status).toBe(201);
  });
});
