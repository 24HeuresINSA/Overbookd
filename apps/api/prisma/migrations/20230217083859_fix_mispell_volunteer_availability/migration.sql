/*
  Warnings:

  - You are about to drop the `volunteer_availabilty` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "volunteer_availabilty" DROP CONSTRAINT "volunteer_availabilty_user_id_fkey";

-- DropTable
DROP TABLE "volunteer_availabilty";

-- CreateTable
CREATE TABLE "volunteer_availability" (
    "user_id" INTEGER NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE INDEX "volunteer_availability_start_idx" ON "volunteer_availability"("start" ASC);

-- CreateIndex
CREATE INDEX "volunteer_availability_end_idx" ON "volunteer_availability"("end" ASC);

-- CreateIndex
CREATE INDEX "volunteer_availability_start_end_idx" ON "volunteer_availability"("start" ASC, "end" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "volunteer_availability_user_id_start_end_key" ON "volunteer_availability"("user_id", "start", "end");

-- AddForeignKey
ALTER TABLE "volunteer_availability" ADD CONSTRAINT "volunteer_availability_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
