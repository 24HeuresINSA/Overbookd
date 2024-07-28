-- CreateTable
CREATE TABLE "charisma_event_participation" (
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "participant_id" INTEGER NOT NULL,
    "charisma" INTEGER NOT NULL,
    "event_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "charisma_event_participation_pkey" PRIMARY KEY ("participant_id","slug","event_date")
);

-- AddForeignKey
ALTER TABLE "charisma_event_participation" ADD CONSTRAINT "charisma_event_participation_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
