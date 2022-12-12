/*
  Warnings:

  - You are about to drop the column `is_publishable` on the `fa` table. All the data in the column will be lost.
  - You are about to drop the column `photo_link` on the `fa` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "site_publish_animation_category_type" AS ENUM ('Divertissement', 'Culture', 'Sport', 'Enfant');

-- AlterTable
ALTER TABLE "fa" DROP COLUMN "is_publishable",
DROP COLUMN "photo_link";

-- CreateTable
CREATE TABLE "fa_site_publish_animation" (
    "id" SERIAL NOT NULL,
    "fa_id" INTEGER NOT NULL,
    "photo_link" TEXT,
    "description" TEXT,
    "categories" "site_publish_animation_category_type"[],

    CONSTRAINT "fa_site_publish_animation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "fa_site_publish_animation_fa_id_key" ON "fa_site_publish_animation"("fa_id");

-- AddForeignKey
ALTER TABLE "fa_site_publish_animation" ADD CONSTRAINT "fa_site_publish_animation_fa_id_fkey" FOREIGN KEY ("fa_id") REFERENCES "fa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
