
-- RenameColumn
ALTER TABLE "time_slot" RENAME COLUMN "group_name" TO "slot_name";

-- DropColumn
ALTER TABLE "time_slot" DROP COLUMN "is_hard_only";

-- DropForeignKey
ALTER TABLE "team_permission" DROP CONSTRAINT "team_permission_team_code_fkey";

-- AddForeignKey
ALTER TABLE "team_permission" ADD CONSTRAINT "team_permission_team_code_fkey" FOREIGN KEY ("team_code") REFERENCES "team"("code") ON DELETE CASCADE ON UPDATE CASCADE;
