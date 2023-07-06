/*
  Warnings:

  - The primary key for the `collaborator` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `collaborator` table. All the data in the column will be lost.
  - You are about to drop the `fa_collaborator` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `fa_id` to the `collaborator` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "fa_collaborator" DROP CONSTRAINT "fa_collaborator_collaborator_id_fkey";

-- DropForeignKey
ALTER TABLE "fa_collaborator" DROP CONSTRAINT "fa_collaborator_fa_id_fkey";

-- AlterTable
ALTER TABLE "collaborator" DROP CONSTRAINT "collaborator_pkey",
DROP COLUMN "id",
ADD COLUMN     "fa_id" INTEGER NOT NULL,
ADD CONSTRAINT "collaborator_pkey" PRIMARY KEY ("fa_id");

-- DropTable
DROP TABLE "fa_collaborator";

-- AddForeignKey
ALTER TABLE "collaborator" ADD CONSTRAINT "collaborator_fa_id_fkey" FOREIGN KEY ("fa_id") REFERENCES "fa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "collaborator" ALTER COLUMN "firstname" DROP NOT NULL,
ALTER COLUMN "lastname" DROP NOT NULL,
ALTER COLUMN "phone" DROP NOT NULL;
