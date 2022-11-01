/*
  Warnings:

  - The primary key for the `Team` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `name` on the `Team` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(30)`.
  - The primary key for the `User_Team` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `team_id` on the `User_Team` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User_Team" DROP CONSTRAINT "User_Team_team_id_fkey";

-- AlterTable
ALTER TABLE "Team" DROP CONSTRAINT "Team_pkey",
ADD COLUMN     "color" VARCHAR(30),
ADD COLUMN     "icon" VARCHAR(255),
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(30),
ADD CONSTRAINT "Team_pkey" PRIMARY KEY ("id");

-- Empty User_Team --
TRUNCATE "User_Team";

-- AlterTable
ALTER TABLE "User_Team" DROP CONSTRAINT "User_Team_pkey",
DROP COLUMN "team_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "User_Team_pkey" PRIMARY KEY ("id");
