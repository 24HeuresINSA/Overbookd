/*
  Warnings:

  - You are about to drop the column `is_kids` on the `fa` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "fa" DROP COLUMN "is_kids";

-- AlterEnum
ALTER TYPE "site_publish_animation_category_type" ADD VALUE 'Autre';
