const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

exports.getTopTeachersService = async () => {
    try {
        const topTeachers = await prisma.$queryRaw`
            WITH TeacherStats AS (
                SELECT 
                    e."teacherId",
                    COUNT(eg.id) AS total_students_tested,
                    SUM(CASE WHEN eg.score >= (e."totalMarks" / 2.0) THEN 1 ELSE 0 END) AS passed_students
                FROM "Exam" e
                JOIN "ExamGrade" eg ON e.id = eg."examId"
                GROUP BY e."teacherId"
            ),
            PassRates AS (
                SELECT 
                    "teacherId",
                    (passed_students * 100.0 / NULLIF(total_students_tested, 0)) AS pass_rate
                FROM TeacherStats
            )
            SELECT 
                u.name AS "teacherName",
                p.pass_rate AS "passRate"
            FROM "user" u
            JOIN PassRates p ON u.id = p."teacherId"
            WHERE u.role = 'TEACHER'
            ORDER BY p.pass_rate DESC
            LIMIT 3;
        `;

        const formattedResult = topTeachers.map(t => ({
            teacherName: t.teacherName,
            passRate: Number(t.passRate).toFixed(2) + '%'
        }));
        
        return formattedResult;
        
    } catch (error) {
        console.error("Error in getTopTeachersService:", error);
        // 👈 التعديل هنا: شيلنا الـ res خالص
        throw error; 
    }
};

exports.calculateStudentsGpaService = async () => {
    try {
        const studentsGpa = await prisma.$queryRaw`
            WITH StudentTotals AS (
                SELECT 
                    eg."studentId",
                    SUM(eg.score) AS total_achieved_score,
                    SUM(e."totalMarks") AS total_possible_score
                FROM "ExamGrade" eg
                JOIN "Exam" e ON eg."examId" = e.id
                GROUP BY eg."studentId"
            ),
            GpaCalculation AS (
                SELECT 
                    "studentId",
                    (total_achieved_score * 100.0 / NULLIF(total_possible_score, 0)) AS current_gpa
                FROM StudentTotals
            )
            SELECT 
                u.name AS "studentName",
                g.current_gpa AS "gpa"
            FROM "user" u
            JOIN GpaCalculation g ON u.id = g."studentId"
            WHERE u.role = 'STUDENT'
            ORDER BY g.current_gpa DESC;
        `;

        const formattedResult = studentsGpa.map(s => ({
            studentName: s.studentName,
            gpa: Number(s.gpa).toFixed(2)
        }));

        return formattedResult;
    } catch (error) {
        console.error("Error in calculateStudentsGpaService:", error);
        throw error;
    }
};