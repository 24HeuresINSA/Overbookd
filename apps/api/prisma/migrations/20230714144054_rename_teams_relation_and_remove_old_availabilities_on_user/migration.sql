/*
  Warnings:

  - You are about to drop the `availability` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `time_slot` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "availability" DROP CONSTRAINT "availability_time_slot_id_fkey";

-- DropForeignKey
ALTER TABLE "availability" DROP CONSTRAINT "availability_user_id_fkey";

-- DropTable
DROP TABLE "availability";

-- DropTable
DROP TABLE "time_slot";
