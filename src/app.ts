import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { _class, academicYear } from "./api";
import classStudent from "./api/classStudent";

const app = new Hono();

// app.get("/", (c) => {
//   return c.text("Hello Hono!");
// });

app.route("/academic-year", academicYear);
app.route("/class", _class);
app.route("/class", classStudent);

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json({ status: "error", message: err.message }, err.status);
  }
  console.log(err);
  return c.json({ status: "error", message: err.message }, 500);
});

export default app;
