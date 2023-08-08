UPDATE "fa_signa_need"
SET "signa_type" = 'BACHE'
WHERE "signa_type" = 'BANNIERE';

UPDATE "fa_signa_need"
SET "signa_type" = 'AFFICHE'
WHERE "signa_type" = 'PANCARTE';

BEGIN;
CREATE TYPE "signa_type_new" AS ENUM ('BACHE', 'PANNEAU', 'AFFICHE');
ALTER TABLE "fa_signa_need" ALTER COLUMN "signa_type" TYPE "signa_type_new" USING ("signa_type"::text::"signa_type_new");
ALTER TYPE "signa_type" RENAME TO "signa_type_old";
ALTER TYPE "signa_type_new" RENAME TO "signa_type";
DROP TYPE "signa_type_old";
COMMIT;

-- AlterTable
ALTER TABLE "fa_signa_need" ADD COLUMN "size" VARCHAR(50);
