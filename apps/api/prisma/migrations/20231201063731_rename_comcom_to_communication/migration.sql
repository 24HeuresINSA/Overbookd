/*
  Warnings:

  - The values [comcom] on the enum `festival_activity_reviewer` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "festival_activity_reviewer_new" AS ENUM ('humain', 'signa', 'secu', 'matos', 'elec', 'barrieres', 'communication');
ALTER TABLE "festival_activity_review" ALTER COLUMN "team" TYPE "festival_activity_reviewer_new" USING ("team"::text::"festival_activity_reviewer_new");
ALTER TYPE "festival_activity_reviewer" RENAME TO "festival_activity_reviewer_old";
ALTER TYPE "festival_activity_reviewer_new" RENAME TO "festival_activity_reviewer";
DROP TYPE "festival_activity_reviewer_old";
COMMIT;
