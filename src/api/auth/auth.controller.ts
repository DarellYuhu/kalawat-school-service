import { Hono } from "hono";
import authService from "./auth.service";
import { zValidator } from "@hono/zod-validator";
import authSchema from "./auth.schema";

const auth = new Hono().basePath("/auth");

auth.post("/signin", zValidator("json", authSchema.signin), async (c) => {
  const { username, password } = c.req.valid("json");
  try {
    const data = await authService.signin(username, password);
    return c.json({ status: "success", message: "Login successfully", data });
  } catch (error) {
    console.log("huhi", error);
  }
});
