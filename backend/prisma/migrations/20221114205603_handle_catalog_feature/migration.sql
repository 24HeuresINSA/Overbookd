/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Team` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "code" VARCHAR(20);

-- CreateTable
CREATE TABLE "Catalog_Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "parent_id" INTEGER,
    "owner_id" INTEGER,

    CONSTRAINT "Catalog_Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Catalog_Gear" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category_id" INTEGER,

    CONSTRAINT "Catalog_Gear_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Catalog_Category_path_key" ON "Catalog_Category"("path");

-- CreateIndex
CREATE UNIQUE INDEX "Catalog_Gear_slug_key" ON "Catalog_Gear"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Team_code_key" ON "Team"("code");

-- AddForeignKey
ALTER TABLE "Catalog_Category" ADD CONSTRAINT "Catalog_Category_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Catalog_Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Catalog_Category" ADD CONSTRAINT "Catalog_Category_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Catalog_Gear" ADD CONSTRAINT "Catalog_Gear_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Catalog_Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
