-- AlterTable
ALTER TABLE "shared_meal"
RENAME COLUMN "payed_at" TO "closed_at";

-- AlterTable
ALTER TABLE "shared_meal"
ADD COLUMN "created_at" TIMESTAMP(3);

-- Update
UPDATE "shared_meal"
SET "created_at" = COALESCE("closed_at", CURRENT_TIMESTAMP);

-- AlterTable
ALTER TABLE "shared_meal"
ALTER COLUMN "created_at"
SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "shared_meal"
ALTER COLUMN "created_at"
SET NOT NULL;

-- CreateIndex
CREATE INDEX shared_meal_amount_is_null_idx
ON "shared_meal" ("id")
WHERE "amount" IS NULL;

-- CreateIndex
CREATE INDEX shared_meal_amount_is_not_null_idx
ON "shared_meal" ("id")
WHERE "amount" IS NOT NULL;
