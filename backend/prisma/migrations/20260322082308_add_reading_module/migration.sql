-- CreateTable
CREATE TABLE "reading_passages" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "duration_mins" INTEGER,
    "image_url" TEXT,

    CONSTRAINT "reading_passages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reading_questions" (
    "id" TEXT NOT NULL,
    "passage_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "question_text" TEXT NOT NULL,
    "options_json" JSONB,
    "correct_answer" TEXT NOT NULL,
    "explanation" TEXT,
    "order_index" INTEGER NOT NULL,

    CONSTRAINT "reading_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_reading_progress" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "passage_id" TEXT NOT NULL,
    "time_spent" INTEGER,
    "score" DOUBLE PRECISION,
    "completed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_reading_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_reading_answers" (
    "id" TEXT NOT NULL,
    "progress_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "user_answer" TEXT NOT NULL,
    "is_correct" BOOLEAN NOT NULL,

    CONSTRAINT "user_reading_answers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "reading_questions" ADD CONSTRAINT "reading_questions_passage_id_fkey" FOREIGN KEY ("passage_id") REFERENCES "reading_passages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_reading_progress" ADD CONSTRAINT "user_reading_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_reading_progress" ADD CONSTRAINT "user_reading_progress_passage_id_fkey" FOREIGN KEY ("passage_id") REFERENCES "reading_passages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_reading_answers" ADD CONSTRAINT "user_reading_answers_progress_id_fkey" FOREIGN KEY ("progress_id") REFERENCES "user_reading_progress"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_reading_answers" ADD CONSTRAINT "user_reading_answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "reading_questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
