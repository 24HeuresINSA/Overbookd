-- CreateTable
CREATE TABLE "overclic_score" (
    "id" SERIAL NOT NULL,
    "score" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "overclic_score_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "overclic_score_user_id_idx" ON "overclic_score"("user_id");

-- AddForeignKey
ALTER TABLE "overclic_score" ADD CONSTRAINT "overclic_score_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
