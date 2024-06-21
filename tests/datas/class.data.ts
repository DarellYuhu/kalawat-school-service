const badCondition = (
  academicYearId: number,
  Class_Student: { studentId: string }[]
) => [
  {
    cause: "no grade",
    parallel: "A",
    academicYearId,
    Class_Student,
  },
  {
    cause: "no parallel",
    grade: 7,
    academicYearId,
    Class_Student,
  },
  {
    cause: "no academic year id",
    grade: 7,
    parallel: "A",
    Class_Student,
  },
  {
    cause: "no class student",
    grade: 7,
    parallel: "A",
    academicYearId,
  },
  {
    cause: "wrong grade type",
    grade: "7",
    parallel: "A",
    academicYearId,
    Class_Student,
  },
  {
    cause: "wrong parallel type",
    grade: 7,
    parallel: true,
    academicYearId,
    Class_Student,
  },
  {
    cause: "wrong parallel input",
    grade: 7,
    parallel: "AB",
    academicYearId,
    Class_Student,
  },
  {
    cause: "no data provided",
  },
];

export default { badCondition };
