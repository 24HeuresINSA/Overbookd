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
