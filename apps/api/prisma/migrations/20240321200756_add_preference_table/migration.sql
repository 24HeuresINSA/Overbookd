-- CreateTable
CREATE TABLE "preference" (
    "user_id" INTEGER NOT NULL,
    "paper_planning" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "preference_pkey" PRIMARY KEY ("user_id")
);

-- AddForeignKey
ALTER TABLE "preference" ADD CONSTRAINT "preference_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
