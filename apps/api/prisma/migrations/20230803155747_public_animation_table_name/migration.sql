/*
  Warnings:

  - You are about to drop the `fa_site_publish_animation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "fa_site_publish_animation" DROP CONSTRAINT "fa_site_publish_animation_fa_id_fkey";

-- DropTable
DROP TABLE "fa_site_publish_animation";

-- CreateTable
CREATE TABLE "public_animation" (
    "fa_id" INTEGER NOT NULL,
    "photo_link" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "is_flagship" BOOLEAN NOT NULL DEFAULT false,
    "categories" "animation_category"[],

    CONSTRAINT "public_animation_pkey" PRIMARY KEY ("fa_id")
);

-- AddForeignKey
ALTER TABLE "public_animation" ADD CONSTRAINT "public_animation_fa_id_fkey" FOREIGN KEY ("fa_id") REFERENCES "fa"("id") ON DELETE CASCADE ON UPDATE CASCADE;
