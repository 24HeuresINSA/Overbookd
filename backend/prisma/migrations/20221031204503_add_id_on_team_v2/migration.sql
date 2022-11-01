/*
  Warnings:

  - The primary key for the `User_Team` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User_Team` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Team` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `team_id` to the `User_Team` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User_Team" DROP CONSTRAINT "User_Team_pkey",
DROP COLUMN "id",
ADD COLUMN     "team_id" INTEGER NOT NULL,
ADD CONSTRAINT "User_Team_pkey" PRIMARY KEY ("user_id", "team_id");

-- CreateIndex
CREATE UNIQUE INDEX "Team_name_key" ON "Team"("name");

-- AddForeignKey
ALTER TABLE "User_Team" ADD CONSTRAINT "User_Team_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
