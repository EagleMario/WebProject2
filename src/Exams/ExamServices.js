import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import crypto from 'crypto'; 
export const submitExamService = async (studentId, examId, calculatedScore) => {
    return await prisma.$transaction(async (tx) => { 
    
    const newRecordId = crypto.randomUUID();

        const result = await tx.$executeRaw`
            INSERT INTO "ExamGrade" ("id", "studentId", "examId", "score", "createdAt")
            VALUES (${newRecordId}, ${studentId}, ${examId}, ${calculatedScore}, CURRENT_TIMESTAMP)
            ON CONFLICT ("studentId", "examId") 
            DO UPDATE SET "score" = EXCLUDED."score", "createdAt" = CURRENT_TIMESTAMP;
        `;

        if (result === 0) {
            throw new Error("لم يتم تحديث أو إدخال الدرجة في قاعدة البيانات.");
        }

        return { 
            success: true, 
            message: "تم تسليم الامتحان وحفظ الدرجة بنجاح!" 
        };
    });
};