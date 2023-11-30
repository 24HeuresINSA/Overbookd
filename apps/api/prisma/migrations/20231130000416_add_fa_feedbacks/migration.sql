-- CreateTable
CREATE TABLE "feedback" (
    "comment" TEXT NOT NULL,
    "author_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fa_id" INTEGER NOT NULL,

    CONSTRAINT "feedback_pkey" PRIMARY KEY ("fa_id","author_id","created_at")
);

-- AddForeignKey
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_fa_id_fkey" FOREIGN KEY ("fa_id") REFERENCES "FestivalActivity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
