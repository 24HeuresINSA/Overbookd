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
