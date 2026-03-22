-- AlterTable
ALTER TABLE "ai_writing_submissions" ADD COLUMN     "prompt_id" TEXT,
ALTER COLUMN "prompt" DROP NOT NULL;

-- CreateTable
CREATE TABLE "writing_prompts" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "requirements" TEXT,
    "type" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "tips_json" JSONB,
    "example_text" TEXT,
    "target_words" INTEGER NOT NULL DEFAULT 150,
    "order_index" INTEGER NOT NULL,
    "creator_id" TEXT,

    CONSTRAINT "writing_prompts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "writing_prompts" ADD CONSTRAINT "writing_prompts_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_writing_submissions" ADD CONSTRAINT "ai_writing_submissions_prompt_id_fkey" FOREIGN KEY ("prompt_id") REFERENCES "writing_prompts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
