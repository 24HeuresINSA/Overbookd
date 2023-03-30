/*
  Warnings:

  - The values [ANIMATION,NETTOYAGE] on the enum `task_category` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "task_category_new" AS ENUM ('STATIQUE', 'BAR', 'MANUTENTION', 'FUN', 'RELOU');
ALTER TABLE "ft" ALTER COLUMN "category" TYPE "task_category_new" USING ("category"::text::"task_category_new");
ALTER TYPE "task_category" RENAME TO "task_category_old";
ALTER TYPE "task_category_new" RENAME TO "task_category";
DROP TYPE "task_category_old";
COMMIT;
