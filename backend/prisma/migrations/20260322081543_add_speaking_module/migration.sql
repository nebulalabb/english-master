-- AlterTable
ALTER TABLE "pronunciation_records" ADD COLUMN     "exercise_id" TEXT;

-- CreateTable
CREATE TABLE "speaking_exercises" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "level" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "target_text" TEXT NOT NULL,
    "phonetic" TEXT,
    "audio_url" TEXT,
    "image_url" TEXT,
    "order_index" INTEGER NOT NULL,
    "creator_id" TEXT,

    CONSTRAINT "speaking_exercises_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "speaking_exercises" ADD CONSTRAINT "speaking_exercises_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pronunciation_records" ADD CONSTRAINT "pronunciation_records_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "speaking_exercises"("id") ON DELETE SET NULL ON UPDATE CASCADE;
