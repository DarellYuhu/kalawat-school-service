import { sign } from "hono/jwt";
import { HTTPException } from "hono/http-exception";
import prisma from "../../database";
import Config from "../../config";

const signin = async (username: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      Student: true,
      Teacher: true,
    },
  });

  if (!user) {
    throw new HTTPException(401, {
      message: "Sign-In error",
      cause: "Wrong username or password",
    });
  }

  const isValid = await Bun.password.verify(password, user?.password, "bcrypt");

  if (!isValid) {
    throw new HTTPException(401, {
      message: "Sign-In error",
      cause: "Wrong username or password",
    });
  }

  const token = await sign(
    {
      sub: user.id,
      name: user.Student?.fullName || user.Teacher?.fullName,
      roles: user.role,
    },
    Config.JWT_SECRET
  );
  return {
    token,
    user: {
      id: user.id,
      name: user.Student?.fullName || user.Teacher?.fullName,
      roles: user.role,
    },
  };
};

export default {
  signin,
};
