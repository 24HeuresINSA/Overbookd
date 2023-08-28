/*
  Warnings:

  - You are about to drop the `fa_refuse` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `fa_validation` table. If the table is not empty, all the data it contains will be lost.

*/
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
ALTER TABLE "catalog_category" ADD COLUMN     "newTeamCode" VARCHAR(20);

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
ALTER TABLE "user_team" ADD CONSTRAINT "user_team_newTeamCode_fkey" FOREIGN KEY ("newTeamCode") REFERENCES "new_team"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_permission" ADD CONSTRAINT "team_permission_newTeamCode_fkey" FOREIGN KEY ("newTeamCode") REFERENCES "new_team"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fa" ADD CONSTRAINT "fa_newTeamCode_fkey" FOREIGN KEY ("newTeamCode") REFERENCES "new_team"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catalog_category" ADD CONSTRAINT "catalog_category_newTeamCode_fkey" FOREIGN KEY ("newTeamCode") REFERENCES "new_team"("code") ON DELETE SET NULL ON UPDATE CASCADE;

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
SET "newTeamCode" = (SELECT "code" FROM "team" WHERE "team"."id" = "user_team"."team_id");

UPDATE "fa"
SET "newTeamCode" = (SELECT "code" FROM "team" WHERE "team"."id" = "fa"."team_id");

UPDATE "catalog_category"
SET "newTeamCode" = (
  SELECT "code" FROM "team" WHERE "team"."id" = "catalog_category"."owner_id"
);

UPDATE "ft_team_request" SET "newTeamCode" = "team_code";

UPDATE "ft_review" SET "newTeamCode" = "team_code";

UPDATE "team_permission" SET "newTeamCode" = "team_code";

UPDATE "ft" SET "newTeamCode" = "team_code";


/*
  Warnings:

  - The primary key for the `team_permission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `user_team` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[ft_id,team_code,newTeamCode]` on the table `ft_review` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ft_time_window_id,team_code,newTeamCode]` on the table `ft_team_request` will be added. If there are existing duplicate values, this will fail.
  - Made the column `newTeamCode` on table `catalog_category` required. This step will fail if there are existing NULL values in that column.
  - Made the column `newTeamCode` on table `ft` required. This step will fail if there are existing NULL values in that column.
  - Made the column `newTeamCode` on table `ft_review` required. This step will fail if there are existing NULL values in that column.
  - Made the column `newTeamCode` on table `ft_team_request` required. This step will fail if there are existing NULL values in that column.
  - Made the column `newTeamCode` on table `team_permission` required. This step will fail if there are existing NULL values in that column.
  - Made the column `newTeamCode` on table `user_team` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "catalog_category" DROP CONSTRAINT "catalog_category_newTeamCode_fkey";

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
DROP INDEX "ft_review_ft_id_team_code_key";

-- DropIndex
DROP INDEX "ft_team_request_ft_time_window_id_team_code_key";

-- AlterTable
ALTER TABLE "catalog_category" ALTER COLUMN "newTeamCode" SET NOT NULL;

-- AlterTable
ALTER TABLE "ft" ALTER COLUMN "newTeamCode" SET NOT NULL;

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
ALTER TABLE "user_team" ADD CONSTRAINT "user_team_newTeamCode_fkey" FOREIGN KEY ("newTeamCode") REFERENCES "new_team"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_permission" ADD CONSTRAINT "team_permission_newTeamCode_fkey" FOREIGN KEY ("newTeamCode") REFERENCES "new_team"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catalog_category" ADD CONSTRAINT "catalog_category_newTeamCode_fkey" FOREIGN KEY ("newTeamCode") REFERENCES "new_team"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ft" ADD CONSTRAINT "ft_newTeamCode_fkey" FOREIGN KEY ("newTeamCode") REFERENCES "new_team"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ft_team_request" ADD CONSTRAINT "ft_team_request_newTeamCode_fkey" FOREIGN KEY ("newTeamCode") REFERENCES "new_team"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ft_review" ADD CONSTRAINT "ft_review_newTeamCode_fkey" FOREIGN KEY ("newTeamCode") REFERENCES "new_team"("code") ON DELETE RESTRICT ON UPDATE CASCADE;


/*
  Warnings:

  - The primary key for the `team_permission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `user_team` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[ft_id,newTeamCode]` on the table `ft_review` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ft_time_window_id,newTeamCode]` on the table `ft_team_request` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ft_review_ft_id_team_code_newTeamCode_key";

-- DropIndex
DROP INDEX "ft_team_request_ft_time_window_id_team_code_newTeamCode_key";

-- AlterTable
ALTER TABLE "team_permission" DROP CONSTRAINT "team_permission_pkey",
ADD CONSTRAINT "team_permission_pkey" PRIMARY KEY ("permission_name", "newTeamCode");

-- AlterTable
ALTER TABLE "user_team" DROP CONSTRAINT "user_team_pkey",
ADD CONSTRAINT "user_team_pkey" PRIMARY KEY ("user_id", "newTeamCode");

-- CreateIndex
CREATE UNIQUE INDEX "ft_review_ft_id_newTeamCode_key" ON "ft_review"("ft_id", "newTeamCode");

-- CreateIndex
CREATE UNIQUE INDEX "ft_team_request_ft_time_window_id_newTeamCode_key" ON "ft_team_request"("ft_time_window_id", "newTeamCode");


/*
  Warnings:

  - You are about to drop the column `owner_id` on the `catalog_category` table. All the data in the column will be lost.
  - You are about to drop the column `team_id` on the `fa` table. All the data in the column will be lost.
  - You are about to drop the column `team_code` on the `ft` table. All the data in the column will be lost.
  - You are about to drop the column `team_code` on the `ft_review` table. All the data in the column will be lost.
  - You are about to drop the column `team_code` on the `ft_team_request` table. All the data in the column will be lost.
  - You are about to drop the column `team_code` on the `team_permission` table. All the data in the column will be lost.
  - You are about to drop the column `team_id` on the `user_team` table. All the data in the column will be lost.

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
ALTER TABLE "team_permission" DROP COLUMN "team_code";

-- AlterTable
ALTER TABLE "user_team" DROP COLUMN "team_id";


/*
  Warnings:

  - You are about to drop the `team` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "team";


ALTER TABLE "user_team" RENAME COLUMN "newTeamCode" TO "team_code";

ALTER TABLE "team_permission" RENAME COLUMN "newTeamCode" TO "team_code";

ALTER TABLE "ft_team_request" RENAME COLUMN "newTeamCode" TO "team_code";

ALTER TABLE "ft_review" RENAME COLUMN "newTeamCode" TO "team_code";

ALTER TABLE "ft" RENAME COLUMN "newTeamCode" TO "team_code";

ALTER TABLE "fa" RENAME COLUMN "newTeamCode" TO "team_code";

ALTER TABLE "catalog_category" RENAME COLUMN "newTeamCode" TO "owner_code";


-- AlterTable
ALTER TABLE "catalog_category" ADD COLUMN     "teamCode" VARCHAR(20);

-- RenameForeignKey
ALTER TABLE "catalog_category" RENAME CONSTRAINT "catalog_category_newTeamCode_fkey" TO "catalog_category_owner_code_fkey";

-- RenameForeignKey
ALTER TABLE "fa" RENAME CONSTRAINT "fa_newTeamCode_fkey" TO "fa_team_code_fkey";

-- RenameForeignKey
ALTER TABLE "ft" RENAME CONSTRAINT "ft_newTeamCode_fkey" TO "ft_team_code_fkey";

-- RenameForeignKey
ALTER TABLE "ft_review" RENAME CONSTRAINT "ft_review_newTeamCode_fkey" TO "ft_review_team_code_fkey";

-- RenameForeignKey
ALTER TABLE "ft_team_request" RENAME CONSTRAINT "ft_team_request_newTeamCode_fkey" TO "ft_team_request_team_code_fkey";

-- RenameForeignKey
ALTER TABLE "team_permission" RENAME CONSTRAINT "team_permission_newTeamCode_fkey" TO "team_permission_team_code_fkey";

-- RenameForeignKey
ALTER TABLE "user_team" RENAME CONSTRAINT "user_team_newTeamCode_fkey" TO "user_team_team_code_fkey";

-- AddForeignKey
ALTER TABLE "catalog_category" ADD CONSTRAINT "catalog_category_teamCode_fkey" FOREIGN KEY ("teamCode") REFERENCES "new_team"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "ft_review_ft_id_newTeamCode_key" RENAME TO "ft_review_ft_id_team_code_key";

-- RenameIndex
ALTER INDEX "ft_team_request_ft_time_window_id_newTeamCode_key" RENAME TO "ft_team_request_ft_time_window_id_team_code_key";


/*
  Warnings:

  - You are about to drop the column `teamCode` on the `catalog_category` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "catalog_category" DROP CONSTRAINT "catalog_category_teamCode_fkey";

-- AlterTable
ALTER TABLE "catalog_category" DROP COLUMN "teamCode";

ALTER TABLE "new_team" RENAME TO "team";


-- DropForeignKey
ALTER TABLE "catalog_category" DROP CONSTRAINT "catalog_category_owner_code_fkey";

-- AlterTable
ALTER TABLE "catalog_category" ALTER COLUMN "owner_code" DROP NOT NULL;

-- AlterTable
ALTER TABLE "team" RENAME CONSTRAINT "new_team_pkey" TO "team_pkey";

-- AddForeignKey
ALTER TABLE "catalog_category" ADD CONSTRAINT "catalog_category_owner_code_fkey" FOREIGN KEY ("owner_code") REFERENCES "team"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "new_team_code_key" RENAME TO "team_code_key";

-- RenameIndex
ALTER INDEX "new_team_name_key" RENAME TO "team_name_key";


-- RenameColumn
ALTER TABLE "fa" RENAME COLUMN "collaboratorId" TO "collaborator_id";

-- RenameForeignKey
ALTER TABLE "fa" RENAME CONSTRAINT "fa_collaboratorId_fkey" TO "fa_collaborator_id_fkey";


-- DropForeignKey
ALTER TABLE "ft" DROP CONSTRAINT "ft_team_code_fkey";

-- AlterTable
ALTER TABLE "ft" ALTER COLUMN "team_code" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ft" ADD CONSTRAINT "ft_team_code_fkey" FOREIGN KEY ("team_code") REFERENCES "team"("code") ON DELETE SET NULL ON UPDATE CASCADE;


-- DropForeignKey
ALTER TABLE "ft_team_request" DROP CONSTRAINT "ft_team_request_team_code_fkey";

-- DropForeignKey
ALTER TABLE "team_permission" DROP CONSTRAINT "team_permission_team_code_fkey";

-- DropForeignKey
ALTER TABLE "user_team" DROP CONSTRAINT "user_team_team_code_fkey";

-- AddForeignKey
ALTER TABLE "user_team" ADD CONSTRAINT "user_team_team_code_fkey" FOREIGN KEY ("team_code") REFERENCES "team"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_permission" ADD CONSTRAINT "team_permission_team_code_fkey" FOREIGN KEY ("team_code") REFERENCES "team"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ft_team_request" ADD CONSTRAINT "ft_team_request_team_code_fkey" FOREIGN KEY ("team_code") REFERENCES "team"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- DropForeignKey
ALTER TABLE "ft_review" DROP CONSTRAINT "ft_review_team_code_fkey";

-- AddForeignKey
ALTER TABLE "ft_review" ADD CONSTRAINT "ft_review_team_code_fkey" FOREIGN KEY ("team_code") REFERENCES "team"("code") ON DELETE CASCADE ON UPDATE CASCADE;
