/*
  Warnings:

  - You are about to drop the column `parent_id` on the `Catalog_Category` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Catalog_Category" DROP CONSTRAINT "Catalog_Category_parent_id_fkey";

-- AlterTable
ALTER TABLE "Catalog_Category" DROP COLUMN "parent_id",
ADD COLUMN     "parent" INTEGER;

-- AddForeignKey
ALTER TABLE "Catalog_Category" ADD CONSTRAINT "Catalog_Category_parent_fkey" FOREIGN KEY ("parent") REFERENCES "Catalog_Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
