/*
  Warnings:

  - A unique constraint covering the columns `[user_id,word_id]` on the table `user_vocab_progress` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "user_vocab_progress_user_id_word_id_key" ON "user_vocab_progress"("user_id", "word_id");
