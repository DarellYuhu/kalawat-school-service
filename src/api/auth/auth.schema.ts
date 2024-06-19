import { z } from "zod";

const signin = z.object({
  username: z.string(),
  password: z.string(),
});

export default {
  signin,
};
