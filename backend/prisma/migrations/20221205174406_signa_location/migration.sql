/*
  Warnings:

  - You are about to drop the `location` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "fa" DROP CONSTRAINT "fa_location_id_fkey";

-- DropTable
DROP TABLE "location";

-- DropEnum
DROP TYPE "locationType";

-- CreateTable
CREATE TABLE "Signa_Location" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "Signa_Location_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "fa" ADD CONSTRAINT "fa_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "Signa_Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;
