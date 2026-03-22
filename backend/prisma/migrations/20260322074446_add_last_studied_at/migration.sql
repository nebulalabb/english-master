-- AlterTable
ALTER TABLE "user_course_enrollments" ADD COLUMN     "last_studied_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
