/*
  Warnings:

  - You are about to drop the column `owner_id` on the `catalog_category` table. All the data in the column will be lost.
  - You are about to drop the column `team_id` on the `fa` table. All the data in the column will be lost.
  - The primary key for the `team` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `team` table. All the data in the column will be lost.
  - The primary key for the `user_team` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `team_id` on the `user_team` table. All the data in the column will be lost.
  - You are about to drop the `fa_refuse` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `fa_validation` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `code` on table `team` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `team_code` to the `user_team` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "catalog_category" DROP CONSTRAINT "catalog_category_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "fa" DROP CONSTRAINT "fa_team_id_fkey";

-- DropForeignKey
ALTER TABLE "fa_refuse" DROP CONSTRAINT "fa_refuse_fa_id_fkey";

-- DropForeignKey
ALTER TABLE "fa_refuse" DROP CONSTRAINT "fa_refuse_team_id_fkey";

-- DropForeignKey
ALTER TABLE "fa_refuse" DROP CONSTRAINT "fa_refuse_user_id_fkey";

-- DropForeignKey
ALTER TABLE "fa_validation" DROP CONSTRAINT "fa_validation_fa_id_fkey";

-- DropForeignKey
ALTER TABLE "fa_validation" DROP CONSTRAINT "fa_validation_team_id_fkey";

-- DropForeignKey
ALTER TABLE "fa_validation" DROP CONSTRAINT "fa_validation_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_team" DROP CONSTRAINT "user_team_team_id_fkey";

-- AlterTable
ALTER TABLE "catalog_category" DROP COLUMN "owner_id",
ADD COLUMN     "owner_code" TEXT;

-- AlterTable
ALTER TABLE "fa" DROP COLUMN "team_id",
ADD COLUMN     "team_code" TEXT;

-- AlterTable
ALTER TABLE "team" DROP CONSTRAINT "team_pkey",
DROP COLUMN "id",
ALTER COLUMN "code" SET NOT NULL,
ADD CONSTRAINT "team_pkey" PRIMARY KEY ("code");

-- AlterTable
ALTER TABLE "user_team" DROP CONSTRAINT "user_team_pkey",
DROP COLUMN "team_id",
ADD COLUMN     "team_code" TEXT NOT NULL,
ADD CONSTRAINT "user_team_pkey" PRIMARY KEY ("user_id", "team_code");

-- DropTable
DROP TABLE "fa_refuse";

-- DropTable
DROP TABLE "fa_validation";

-- AddForeignKey
ALTER TABLE "user_team" ADD CONSTRAINT "user_team_team_code_fkey" FOREIGN KEY ("team_code") REFERENCES "team"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fa" ADD CONSTRAINT "fa_team_code_fkey" FOREIGN KEY ("team_code") REFERENCES "team"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catalog_category" ADD CONSTRAINT "catalog_category_owner_code_fkey" FOREIGN KEY ("owner_code") REFERENCES "team"("code") ON DELETE SET NULL ON UPDATE CASCADE;
