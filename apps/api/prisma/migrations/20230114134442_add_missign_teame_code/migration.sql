-- AlterTable
ALTER TABLE "ft" ADD COLUMN     "team_code" TEXT;

-- AddForeignKey
ALTER TABLE "ft" ADD CONSTRAINT "ft_team_code_fkey" FOREIGN KEY ("team_code") REFERENCES "Team"("code") ON DELETE SET NULL ON UPDATE CASCADE;
