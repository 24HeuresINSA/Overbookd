/*
  Warnings:

  - The primary key for the `charisma_event_participation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `event_date` on the `charisma_event_participation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "charisma_event_participation" DROP CONSTRAINT "charisma_event_participation_pkey",
DROP COLUMN "event_date",
ADD COLUMN     "event_date" VARCHAR(20) NOT NULL,
ADD CONSTRAINT "charisma_event_participation_pkey" PRIMARY KEY ("participant_id", "slug", "event_date");
