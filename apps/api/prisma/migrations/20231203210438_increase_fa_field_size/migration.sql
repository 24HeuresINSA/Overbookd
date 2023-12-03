/*
  Warnings:

  - The primary key for the `festival_activity_electricity_supply` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `festival_activity_signage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `inquiry_request` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "inquiry_request" DROP CONSTRAINT "inquiry_request_slug_fkey";

-- AlterTable
ALTER TABLE "contractor" ALTER COLUMN "firstname" SET DATA TYPE TEXT,
ALTER COLUMN "lastname" SET DATA TYPE TEXT,
ALTER COLUMN "phone" SET DATA TYPE TEXT,
ALTER COLUMN "email" SET DATA TYPE TEXT,
ALTER COLUMN "company" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "festival_activity" ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "categories" SET DATA TYPE TEXT[];

-- AlterTable
ALTER TABLE "festival_activity_electricity_supply" DROP CONSTRAINT "festival_activity_electricity_supply_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "device" SET DATA TYPE TEXT,
ADD CONSTRAINT "festival_activity_electricity_supply_pkey" PRIMARY KEY ("festival_supply_id", "id");

-- AlterTable
ALTER TABLE "festival_activity_signage" DROP CONSTRAINT "festival_activity_signage_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "text" SET DATA TYPE TEXT,
ALTER COLUMN "size" SET DATA TYPE TEXT,
ADD CONSTRAINT "festival_activity_signage_pkey" PRIMARY KEY ("fa_id", "id");

-- AlterTable
ALTER TABLE "inquiry_request" DROP CONSTRAINT "inquiry_request_pkey",
ALTER COLUMN "slug" SET DATA TYPE TEXT,
ADD CONSTRAINT "inquiry_request_pkey" PRIMARY KEY ("slug", "fa_id");

-- AddForeignKey
ALTER TABLE "inquiry_request" ADD CONSTRAINT "inquiry_request_slug_fkey" FOREIGN KEY ("slug") REFERENCES "catalog_gear"("slug") ON DELETE CASCADE ON UPDATE CASCADE;
