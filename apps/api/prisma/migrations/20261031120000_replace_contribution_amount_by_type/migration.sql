-- CreateEnum
CREATE TYPE "contribution_type" AS ENUM ('MEMBER', 'DONATOR');

-- AlterTable
ALTER TABLE "contribution" ADD COLUMN "type" "contribution_type" NOT NULL DEFAULT 'MEMBER';

-- Migrate existing contributions: 1€ is a member, anything else is a donator
UPDATE "contribution" SET "type" = 'DONATOR' WHERE "amount" <> 100;

-- AlterTable
ALTER TABLE "contribution" DROP COLUMN "amount";
