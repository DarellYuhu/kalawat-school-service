/*
  Warnings:

  - A unique constraint covering the columns `[grade,parallel,academicYearId]` on the table `Class` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Class_grade_parallel_academicYearId_key" ON "Class"("grade", "parallel", "academicYearId");
