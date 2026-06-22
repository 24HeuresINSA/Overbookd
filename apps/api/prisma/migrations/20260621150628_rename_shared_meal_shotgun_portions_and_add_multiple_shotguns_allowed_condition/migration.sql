-- AlterTable
ALTER TABLE "shared_meal" ADD COLUMN     "are_multiple_shotguns_allowed" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "shotgun"
RENAME COLUMN "portion" TO "portions";
