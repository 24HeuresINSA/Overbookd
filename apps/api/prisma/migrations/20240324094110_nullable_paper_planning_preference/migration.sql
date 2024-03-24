-- AlterTable
ALTER TABLE "preference" ALTER COLUMN "paper_planning" DROP NOT NULL,
ALTER COLUMN "paper_planning" DROP DEFAULT;

UPDATE "preference" SET "paper_planning" = NULL WHERE "paper_planning" = false;
