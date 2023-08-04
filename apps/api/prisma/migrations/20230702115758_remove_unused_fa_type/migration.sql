-- AlterTable
ALTER TABLE "fa" DROP COLUMN "fa_type",
ALTER COLUMN "type" TYPE "fa_type" USING "type"::fa_type,
ALTER COLUMN "status" SET NOT NULL,
DROP COLUMN "water_flow_required";

ALTER TYPE "site_publish_animation_category_type" RENAME TO "animation_category";
