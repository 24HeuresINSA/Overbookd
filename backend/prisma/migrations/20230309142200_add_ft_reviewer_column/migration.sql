-- AlterTable
ALTER TABLE "ft" ADD COLUMN     "reviewer_id" INTEGER;

-- AddForeignKey
ALTER TABLE "ft" ADD CONSTRAINT "ft_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
