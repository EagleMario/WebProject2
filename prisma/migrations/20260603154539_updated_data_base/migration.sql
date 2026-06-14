-- CreateTable
CREATE TABLE "ExamGrade" (
    "id" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "studentId" TEXT NOT NULL,
    "examId" TEXT NOT NULL,

    CONSTRAINT "ExamGrade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssignmentGrade" (
    "id" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "studentId" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,

    CONSTRAINT "AssignmentGrade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ClassToExamGrade" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ClassToExamGrade_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_AssignmentGradeToClass" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AssignmentGradeToClass_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExamGrade_studentId_examId_key" ON "ExamGrade"("studentId", "examId");

-- CreateIndex
CREATE UNIQUE INDEX "AssignmentGrade_studentId_assignmentId_key" ON "AssignmentGrade"("studentId", "assignmentId");

-- CreateIndex
CREATE INDEX "_ClassToExamGrade_B_index" ON "_ClassToExamGrade"("B");

-- CreateIndex
CREATE INDEX "_AssignmentGradeToClass_B_index" ON "_AssignmentGradeToClass"("B");

-- AddForeignKey
ALTER TABLE "ExamGrade" ADD CONSTRAINT "ExamGrade_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamGrade" ADD CONSTRAINT "ExamGrade_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentGrade" ADD CONSTRAINT "AssignmentGrade_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentGrade" ADD CONSTRAINT "AssignmentGrade_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassToExamGrade" ADD CONSTRAINT "_ClassToExamGrade_A_fkey" FOREIGN KEY ("A") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassToExamGrade" ADD CONSTRAINT "_ClassToExamGrade_B_fkey" FOREIGN KEY ("B") REFERENCES "ExamGrade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AssignmentGradeToClass" ADD CONSTRAINT "_AssignmentGradeToClass_A_fkey" FOREIGN KEY ("A") REFERENCES "AssignmentGrade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AssignmentGradeToClass" ADD CONSTRAINT "_AssignmentGradeToClass_B_fkey" FOREIGN KEY ("B") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;
