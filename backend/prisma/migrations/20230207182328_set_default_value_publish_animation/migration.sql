/*
  Warnings:

  - Made the column `photo_link ` on table `fa_site_publish_animation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `fa_site_publish_animation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `isMajor` on table `fa_site_publish_animation` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "fa_site_publish_animation" ALTER COLUMN "photo_link " SET NOT NULL,
ALTER COLUMN "photo_link " SET DEFAULT '',
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "description" SET DEFAULT '',
ALTER COLUMN "isMajor" SET NOT NULL;
