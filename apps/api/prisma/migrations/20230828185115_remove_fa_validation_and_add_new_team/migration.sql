/*
  Warnings:

  - You are about to drop the column `collaboratorId` on the `fa` table. All the data in the column will be lost.
  - You are about to drop the `fa_refuse` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `fa_validation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "fa" DROP CONSTRAINT "fa_collaboratorId_fkey";

-- DropForeignKey
ALTER TABLE "fa_refuse" DROP CONSTRAINT "fa_refuse_fa_id_fkey";

-- DropForeignKey
ALTER TABLE "fa_refuse" DROP CONSTRAINT "fa_refuse_team_id_fkey";

-- DropForeignKey
ALTER TABLE "fa_refuse" DROP CONSTRAINT "fa_refuse_user_id_fkey";

-- DropForeignKey
ALTER TABLE "fa_validation" DROP CONSTRAINT "fa_validation_fa_id_fkey";

-- DropForeignKey
ALTER TABLE "fa_validation" DROP CONSTRAINT "fa_validation_team_id_fkey";

-- DropForeignKey
ALTER TABLE "fa_validation" DROP CONSTRAINT "fa_validation_user_id_fkey";

-- AlterTable
ALTER TABLE "fa" RENAME COLUMN "collaboratorId" TO "collaborator_id";

-- DropTable
DROP TABLE "fa_refuse";

-- DropTable
DROP TABLE "fa_validation";

-- CreateTable
CREATE TABLE "new_team" (
    "code" VARCHAR(20) NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "color" VARCHAR(30) NOT NULL DEFAULT '#000000',
    "icon" VARCHAR(255) NOT NULL DEFAULT 'mdi-circle',

    CONSTRAINT "new_team_pkey" PRIMARY KEY ("code")
);

-- CreateIndex
CREATE UNIQUE INDEX "new_team_code_key" ON "new_team"("code");

-- CreateIndex
CREATE UNIQUE INDEX "new_team_name_key" ON "new_team"("name");

-- AddForeignKey
ALTER TABLE "fa" ADD CONSTRAINT "fa_collaborator_id_fkey" FOREIGN KEY ("collaborator_id") REFERENCES "collaborator"("id") ON DELETE SET NULL ON UPDATE CASCADE;


------------------ New Team Relations ------------------

-- AlterTable
ALTER TABLE "catalog_category" ADD COLUMN     "newOwnerCode" VARCHAR(20);

-- AlterTable
ALTER TABLE "fa" ADD COLUMN     "newTeamCode" VARCHAR(20);

-- AlterTable
ALTER TABLE "ft" ADD COLUMN     "newTeamCode" VARCHAR(20);

-- AlterTable
ALTER TABLE "ft_review" ADD COLUMN     "newTeamCode" VARCHAR(20);

-- AlterTable
ALTER TABLE "ft_team_request" ADD COLUMN     "newTeamCode" VARCHAR(20);

-- AlterTable
ALTER TABLE "team_permission" ADD COLUMN     "newTeamCode" VARCHAR(20);

-- AlterTable
ALTER TABLE "user_team" ADD COLUMN     "newTeamCode" VARCHAR(20);

-- AddForeignKey
ALTER TABLE "user_team" ADD CONSTRAINT "user_team_newTeamCode_fkey" FOREIGN KEY ("newTeamCode") REFERENCES "new_team"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_permission" ADD CONSTRAINT "team_permission_newTeamCode_fkey" FOREIGN KEY ("newTeamCode") REFERENCES "new_team"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fa" ADD CONSTRAINT "fa_newTeamCode_fkey" FOREIGN KEY ("newTeamCode") REFERENCES "new_team"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catalog_category" ADD CONSTRAINT "catalog_category_newOwnerCode_fkey" FOREIGN KEY ("newOwnerCode") REFERENCES "new_team"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ft" ADD CONSTRAINT "ft_newTeamCode_fkey" FOREIGN KEY ("newTeamCode") REFERENCES "new_team"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ft_team_request" ADD CONSTRAINT "ft_team_request_newTeamCode_fkey" FOREIGN KEY ("newTeamCode") REFERENCES "new_team"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ft_review" ADD CONSTRAINT "ft_review_newTeamCode_fkey" FOREIGN KEY ("newTeamCode") REFERENCES "new_team"("code") ON DELETE SET NULL ON UPDATE CASCADE;

INSERT INTO "new_team" ("code", "name", "color", "icon")
SELECT "code", "name", "color", "icon"
FROM "team";

UPDATE "user_team"
SET "newTeamCode" = (
  SELECT "code" FROM "team" WHERE "team"."id" = "user_team"."team_id"
);

UPDATE "team_permission" SET "newTeamCode" = "team_code";

UPDATE "fa"
SET "newTeamCode" = (
  SELECT "code" FROM "team" WHERE "team"."id" = "fa"."team_id"
);

UPDATE "ft" SET "newTeamCode" = "team_code";

UPDATE "catalog_category"
SET "newOwnerCode" = (
  SELECT "code" FROM "team" WHERE "team"."id" = "catalog_category"."owner_id"
);

UPDATE "ft_team_request" SET "newTeamCode" = "team_code";

UPDATE "ft_review" SET "newTeamCode" = "team_code";


------------------ Add new team table constraints ------------------

/*
  Warnings:

  - The primary key for the `team_permission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `user_team` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[ft_id,team_code,newTeamCode]` on the table `ft_review` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ft_time_window_id,team_code,newTeamCode]` on the table `ft_team_request` will be added. If there are existing duplicate values, this will fail.
  - Made the column `newTeamCode` on table `ft_review` required. This step will fail if there are existing NULL values in that column.
  - Made the column `newTeamCode` on table `ft_team_request` required. This step will fail if there are existing NULL values in that column.
  - Made the column `newTeamCode` on table `team_permission` required. This step will fail if there are existing NULL values in that column.
  - Made the column `newTeamCode` on table `user_team` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ft_review" DROP CONSTRAINT "ft_review_newTeamCode_fkey";

-- DropForeignKey
ALTER TABLE "ft_team_request" DROP CONSTRAINT "ft_team_request_newTeamCode_fkey";

-- DropForeignKey
ALTER TABLE "team_permission" DROP CONSTRAINT "team_permission_newTeamCode_fkey";

-- DropForeignKey
ALTER TABLE "user_team" DROP CONSTRAINT "user_team_newTeamCode_fkey";

-- DropIndex
DROP INDEX "ft_review_ft_id_team_code_key";

-- DropIndex
DROP INDEX "ft_team_request_ft_time_window_id_team_code_key";

-- AlterTable
ALTER TABLE "ft_review" ALTER COLUMN "newTeamCode" SET NOT NULL;

-- AlterTable
ALTER TABLE "ft_team_request" ALTER COLUMN "newTeamCode" SET NOT NULL;

-- AlterTable
ALTER TABLE "team_permission" DROP CONSTRAINT "team_permission_pkey",
ALTER COLUMN "newTeamCode" SET NOT NULL,
ADD CONSTRAINT "team_permission_pkey" PRIMARY KEY ("team_code", "permission_name", "newTeamCode");

-- AlterTable
ALTER TABLE "user_team" DROP CONSTRAINT "user_team_pkey",
ALTER COLUMN "newTeamCode" SET NOT NULL,
ADD CONSTRAINT "user_team_pkey" PRIMARY KEY ("user_id", "team_id", "newTeamCode");

-- CreateIndex
CREATE UNIQUE INDEX "ft_review_ft_id_team_code_newTeamCode_key" ON "ft_review"("ft_id", "team_code", "newTeamCode");

-- CreateIndex
CREATE UNIQUE INDEX "ft_team_request_ft_time_window_id_team_code_newTeamCode_key" ON "ft_team_request"("ft_time_window_id", "team_code", "newTeamCode");

-- AddForeignKey
ALTER TABLE "user_team" ADD CONSTRAINT "user_team_newTeamCode_fkey" FOREIGN KEY ("newTeamCode") REFERENCES "new_team"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_permission" ADD CONSTRAINT "team_permission_newTeamCode_fkey" FOREIGN KEY ("newTeamCode") REFERENCES "new_team"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ft_team_request" ADD CONSTRAINT "ft_team_request_newTeamCode_fkey" FOREIGN KEY ("newTeamCode") REFERENCES "new_team"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ft_review" ADD CONSTRAINT "ft_review_newTeamCode_fkey" FOREIGN KEY ("newTeamCode") REFERENCES "new_team"("code") ON DELETE CASCADE ON UPDATE CASCADE;


------------------ Remove old team relations ------------------

/*
  Warnings:

  - You are about to drop the column `owner_id` on the `catalog_category` table. All the data in the column will be lost.
  - You are about to drop the column `team_id` on the `fa` table. All the data in the column will be lost.
  - You are about to drop the column `team_code` on the `ft` table. All the data in the column will be lost.
  - You are about to drop the column `team_code` on the `ft_review` table. All the data in the column will be lost.
  - You are about to drop the column `team_code` on the `ft_team_request` table. All the data in the column will be lost.
  - The primary key for the `team_permission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `team_code` on the `team_permission` table. All the data in the column will be lost.
  - The primary key for the `user_team` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `team_id` on the `user_team` table. All the data in the column will be lost.
  - You are about to drop the `team` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[ft_id,newTeamCode]` on the table `ft_review` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ft_time_window_id,newTeamCode]` on the table `ft_team_request` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "catalog_category" DROP CONSTRAINT "catalog_category_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "fa" DROP CONSTRAINT "fa_team_id_fkey";

-- DropForeignKey
ALTER TABLE "ft" DROP CONSTRAINT "ft_team_code_fkey";

-- DropForeignKey
ALTER TABLE "ft_review" DROP CONSTRAINT "ft_review_team_code_fkey";

-- DropForeignKey
ALTER TABLE "ft_team_request" DROP CONSTRAINT "ft_team_request_team_code_fkey";

-- DropForeignKey
ALTER TABLE "team_permission" DROP CONSTRAINT "team_permission_team_code_fkey";

-- DropForeignKey
ALTER TABLE "user_team" DROP CONSTRAINT "user_team_team_id_fkey";

-- DropIndex
DROP INDEX "ft_review_ft_id_team_code_newTeamCode_key";

-- DropIndex
DROP INDEX "ft_team_request_ft_time_window_id_team_code_newTeamCode_key";

-- AlterTable
ALTER TABLE "catalog_category" DROP COLUMN "owner_id";

-- AlterTable
ALTER TABLE "fa" DROP COLUMN "team_id";

-- AlterTable
ALTER TABLE "ft" DROP COLUMN "team_code";

-- AlterTable
ALTER TABLE "ft_review" DROP COLUMN "team_code";

-- AlterTable
ALTER TABLE "ft_team_request" DROP COLUMN "team_code";

-- AlterTable
ALTER TABLE "team_permission" DROP CONSTRAINT "team_permission_pkey",
DROP COLUMN "team_code",
ADD CONSTRAINT "team_permission_pkey" PRIMARY KEY ("permission_name", "newTeamCode");

-- AlterTable
ALTER TABLE "user_team" DROP CONSTRAINT "user_team_pkey",
DROP COLUMN "team_id",
ADD CONSTRAINT "user_team_pkey" PRIMARY KEY ("user_id", "newTeamCode");

-- DropTable
DROP TABLE "team";

-- CreateIndex
CREATE UNIQUE INDEX "ft_review_ft_id_newTeamCode_key" ON "ft_review"("ft_id", "newTeamCode");

-- CreateIndex
CREATE UNIQUE INDEX "ft_team_request_ft_time_window_id_newTeamCode_key" ON "ft_team_request"("ft_time_window_id", "newTeamCode");


------------------ Rename team foreign keys ------------------

/*
  Warnings:

  - You are about to drop the column `newOwnerCode` on the `catalog_category` table. All the data in the column will be lost.
  - You are about to drop the column `newTeamCode` on the `fa` table. All the data in the column will be lost.
  - You are about to drop the column `newTeamCode` on the `ft` table. All the data in the column will be lost.
  - You are about to drop the column `newTeamCode` on the `ft_review` table. All the data in the column will be lost.
  - You are about to drop the column `newTeamCode` on the `ft_team_request` table. All the data in the column will be lost.
  - The primary key for the `team_permission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `newTeamCode` on the `team_permission` table. All the data in the column will be lost.
  - The primary key for the `user_team` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `newTeamCode` on the `user_team` table. All the data in the column will be lost.
  - You are about to drop the `new_team` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[ft_id,team_code]` on the table `ft_review` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ft_time_window_id,team_code]` on the table `ft_team_request` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `team_code` to the `ft_review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `team_code` to the `ft_team_request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `team_code` to the `team_permission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `team_code` to the `user_team` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "catalog_category" DROP CONSTRAINT "catalog_category_newOwnerCode_fkey";

-- DropForeignKey
ALTER TABLE "fa" DROP CONSTRAINT "fa_newTeamCode_fkey";

-- DropForeignKey
ALTER TABLE "ft" DROP CONSTRAINT "ft_newTeamCode_fkey";

-- DropForeignKey
ALTER TABLE "ft_review" DROP CONSTRAINT "ft_review_newTeamCode_fkey";

-- DropForeignKey
ALTER TABLE "ft_team_request" DROP CONSTRAINT "ft_team_request_newTeamCode_fkey";

-- DropForeignKey
ALTER TABLE "team_permission" DROP CONSTRAINT "team_permission_newTeamCode_fkey";

-- DropForeignKey
ALTER TABLE "user_team" DROP CONSTRAINT "user_team_newTeamCode_fkey";

-- DropIndex
DROP INDEX "ft_review_ft_id_newTeamCode_key";

-- DropIndex
DROP INDEX "ft_team_request_ft_time_window_id_newTeamCode_key";

-- AlterTable
ALTER TABLE "catalog_category" RENAME COLUMN "newOwnerCode" TO "owner_code";

-- AlterTable
ALTER TABLE "fa" RENAME COLUMN "newTeamCode" TO "team_code";

-- AlterTable
ALTER TABLE "ft" RENAME COLUMN "newTeamCode" TO "team_code";

-- AlterTable
ALTER TABLE "ft_review" RENAME COLUMN "newTeamCode" TO "team_code";

-- AlterTable
ALTER TABLE "ft_team_request" RENAME COLUMN "newTeamCode" TO "team_code";

-- AlterTable
ALTER TABLE "team_permission" DROP CONSTRAINT "team_permission_pkey";

-- AlterTable
ALTER TABLE "team_permission" RENAME COLUMN "newTeamCode" TO "team_code";

-- AlterTable
ALTER TABLE "team_permission" ADD CONSTRAINT "team_permission_pkey" PRIMARY KEY ("permission_name", "team_code");

-- AlterTable
ALTER TABLE "user_team" DROP CONSTRAINT "user_team_pkey";

-- AlterTable
ALTER TABLE "user_team" RENAME COLUMN "newTeamCode" TO "team_code";

-- AlterTable
ALTER TABLE "user_team" ADD CONSTRAINT "user_team_pkey" PRIMARY KEY ("user_id", "team_code");

-- AlterTable
ALTER TABLE "new_team" RENAME TO "team";

-- CreateIndex
CREATE UNIQUE INDEX "team_code_key" ON "team"("code");

-- CreateIndex
CREATE UNIQUE INDEX "team_name_key" ON "team"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ft_review_ft_id_team_code_key" ON "ft_review"("ft_id", "team_code");

-- CreateIndex
CREATE UNIQUE INDEX "ft_team_request_ft_time_window_id_team_code_key" ON "ft_team_request"("ft_time_window_id", "team_code");

-- AddForeignKey
ALTER TABLE "user_team" ADD CONSTRAINT "user_team_team_code_fkey" FOREIGN KEY ("team_code") REFERENCES "team"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_permission" ADD CONSTRAINT "team_permission_team_code_fkey" FOREIGN KEY ("team_code") REFERENCES "team"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fa" ADD CONSTRAINT "fa_team_code_fkey" FOREIGN KEY ("team_code") REFERENCES "team"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catalog_category" ADD CONSTRAINT "catalog_category_owner_code_fkey" FOREIGN KEY ("owner_code") REFERENCES "team"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ft" ADD CONSTRAINT "ft_team_code_fkey" FOREIGN KEY ("team_code") REFERENCES "team"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ft_team_request" ADD CONSTRAINT "ft_team_request_team_code_fkey" FOREIGN KEY ("team_code") REFERENCES "team"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ft_review" ADD CONSTRAINT "ft_review_team_code_fkey" FOREIGN KEY ("team_code") REFERENCES "team"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "team" RENAME CONSTRAINT "new_team_pkey" TO "team_pkey";
