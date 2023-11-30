-- CreateEnum
CREATE TYPE "festival_activity_event" AS ENUM ('CREATED');

-- CreateTable
CREATE TABLE "festival_activity_history" (
    "id" SERIAL NOT NULL,
    "event" "festival_activity_event" NOT NULL,
    "instigatorId" INTEGER NOT NULL,
    "fa_id" INTEGER NOT NULL,
    "snapshot" JSONB NOT NULL,
    "at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "festival_activity_history_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "festival_activity_history" ADD CONSTRAINT "festival_activity_history_instigatorId_fkey" FOREIGN KEY ("instigatorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_activity_history" ADD CONSTRAINT "festival_activity_history_fa_id_fkey" FOREIGN KEY ("fa_id") REFERENCES "FestivalActivity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
