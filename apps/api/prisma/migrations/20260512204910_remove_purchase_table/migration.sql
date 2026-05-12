/*
  Warnings:

  - You are about to drop the `purchase` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `purchase_gear_request` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "purchase_gear_request" DROP CONSTRAINT "purchase_gear_request_gear_slug_fkey";

-- DropForeignKey
ALTER TABLE "purchase_gear_request" DROP CONSTRAINT "purchase_gear_request_purchase_id_fkey";

-- DropTable
DROP TABLE "purchase";

-- DropTable
DROP TABLE "purchase_gear_request";
