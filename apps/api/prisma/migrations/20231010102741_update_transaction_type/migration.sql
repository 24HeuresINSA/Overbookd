-- CreateEnum
CREATE TYPE "transaction_reason" AS ENUM ('DEPOSIT', 'TRANSFER', 'BARREL', 'PROVISIONS');

-- AlterTable
ALTER TABLE "transaction" ADD COLUMN     "reason" "transaction_reason" NOT NULL DEFAULT 'TRANSFER';

UPDATE "transaction" SET "reason" = 'DEPOSIT' WHERE "type" = 'DEPOSIT';
UPDATE "transaction" SET "reason" = 'PROVISIONS' WHERE "type" = 'EXPENSE' AND "context" LIKE '%Conso placard:%';
UPDATE "transaction" SET "reason" = 'BARREL' WHERE "type" = 'EXPENSE' AND "context" LIKE '%Conso au local%';

-- AlterTable
ALTER TABLE "transaction" DROP COLUMN "type";

-- DropEnum
DROP TYPE "transaction_type";

-- AlterType
ALTER TYPE "transaction_reason" RENAME TO "transaction_type";

-- AlterTable
ALTER TABLE "transaction" RENAME COLUMN "reason" TO "type";
ALTER TABLE "transaction" ALTER COLUMN "type" TYPE "transaction_type" USING "type"::text::"transaction_type";
