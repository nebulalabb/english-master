-- CreateTable
CREATE TABLE "listening_exercises" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "level" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "audio_url" TEXT NOT NULL,
    "transcript" TEXT,
    "duration_sec" INTEGER NOT NULL,
    "thumbnail" TEXT,
    "order_index" INTEGER NOT NULL,

    CONSTRAINT "listening_exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listening_questions" (
    "id" TEXT NOT NULL,
    "exercise_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "question_text" TEXT NOT NULL,
    "options_json" JSONB,
    "correct_answer" TEXT NOT NULL,
    "explanation" TEXT,
    "order_index" INTEGER NOT NULL,

    CONSTRAINT "listening_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_listening_progress" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "exercise_id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "score" DOUBLE PRECISION,
    "last_studied" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_listening_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_listening_answers" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "is_correct" BOOLEAN NOT NULL,
    "answered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_listening_answers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_listening_progress_user_id_exercise_id_key" ON "user_listening_progress"("user_id", "exercise_id");

-- AddForeignKey
ALTER TABLE "listening_questions" ADD CONSTRAINT "listening_questions_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "listening_exercises"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_listening_progress" ADD CONSTRAINT "user_listening_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_listening_progress" ADD CONSTRAINT "user_listening_progress_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "listening_exercises"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_listening_answers" ADD CONSTRAINT "user_listening_answers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_listening_answers" ADD CONSTRAINT "user_listening_answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "listening_questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
