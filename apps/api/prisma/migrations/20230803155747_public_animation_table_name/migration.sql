-- RenameTable
ALTER TABLE "fa_site_publish_animation" RENAME TO "public_animation";

-- AlterTable
ALTER TABLE "public_animation" RENAME CONSTRAINT "fa_site_publish_animation_pkey" TO "public_animation_pkey";

-- RenameForeignKey
ALTER TABLE "public_animation" RENAME CONSTRAINT "fa_site_publish_animation_fa_id_fkey" TO "public_animation_fa_id_fkey";
