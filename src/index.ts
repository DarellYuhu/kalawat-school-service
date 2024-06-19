import app from "./app";
import Config from "./config";

const server = Bun.serve({
  fetch: app.fetch,
  port: Config.PORT,
});

console.log(`server listening on port: ${server.port}`);
