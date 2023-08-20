-- DropForeignKey
ALTER TABLE "user_team" DROP CONSTRAINT "user_team_user_id_fkey";

-- AddForeignKey
ALTER TABLE "user_team" ADD CONSTRAINT "user_team_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
