/*
  Warnings:

  - The values [ADHERENT] on the enum `registration_membership` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "registration_membership_new" AS ENUM ('VOLUNTEER', 'STAFF');
ALTER TABLE "user" ALTER COLUMN "registration_membership" TYPE "registration_membership_new" USING ("registration_membership"::text::"registration_membership_new");
ALTER TYPE "registration_membership" RENAME TO "registration_membership_old";
ALTER TYPE "registration_membership_new" RENAME TO "registration_membership";
DROP TYPE "registration_membership_old";
COMMIT;
