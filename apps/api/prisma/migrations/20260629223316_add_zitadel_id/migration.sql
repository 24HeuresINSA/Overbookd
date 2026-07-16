/*
  Warnings:

  - You are about to drop the column `reset_password_expires` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `reset_password_token` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[zitadel_id]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "user_reset_password_token_key";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "reset_password_expires",
DROP COLUMN "reset_password_token",
DROP COLUMN "last_login",
ADD COLUMN     "zitadel_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "user_zitadel_id_key" ON "user"("zitadel_id");
