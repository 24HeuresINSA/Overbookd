-- AlterTable
ALTER TABLE "fa" DROP COLUMN "fa_type",
ALTER COLUMN "type" TYPE "fa_type" USING "type"::fa_type,
ALTER COLUMN "status" SET NOT NULL;
