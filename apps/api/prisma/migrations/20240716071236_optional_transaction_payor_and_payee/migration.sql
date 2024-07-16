-- DropForeignKey
ALTER TABLE "transaction" DROP CONSTRAINT "transaction_from_fkey";

-- DropForeignKey
ALTER TABLE "transaction" DROP CONSTRAINT "transaction_to_fkey";

-- AlterTable
ALTER TABLE "transaction" ALTER COLUMN "from" DROP NOT NULL,
ALTER COLUMN "to" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_from_fkey" FOREIGN KEY ("from") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_to_fkey" FOREIGN KEY ("to") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
