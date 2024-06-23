import { faker } from "@faker-js/faker";
import prisma from "@database/index";
import { Gender } from "@prisma/client";

export default async function seedDatabase() {
  const academicYear = await prisma.academicYear.create({
    data: {
      semester: "GENAP",
      year: "2023/2024",
    },
  });

  const user = await prisma.user.createManyAndReturn({
    data: Array.from({
      length: 10,
    }).map(() => ({
      password: "123456",
      username: faker.internet.userName(),
      role: ["MURID"],
    })),
  });

  const students = await prisma.student.createManyAndReturn({
    data: user.map((item) => ({
      address: faker.location.streetAddress(),
      dob: faker.date
        .birthdate({ min: 19, max: 25, mode: "age" })
        .toISOString(),
      pob: faker.location.city(),
      religion: "Kristen",
      fullName: faker.person.fullName(),
      gender: faker.person.sex().toUpperCase() as Gender,
      userId: item.id,
    })),
  });

  const _class = await prisma.class.create({
    data: {
      grade: 7,
      parallel: "A",
      academicYearId: academicYear.id,
      Class_Student: {
        createMany: {
          data: students.slice(0, 3).map((item) => ({ studentId: item.id })),
        },
      },
    },
  });

  return { academicYear, students, _class };
}
