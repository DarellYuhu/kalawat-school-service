export default class Config {
  static PORT = Bun.env.PORT;
  static JWT_SECRET = Bun.env.JWT_SECRET || "secret";
}
