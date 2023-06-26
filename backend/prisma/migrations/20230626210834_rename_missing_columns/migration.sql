ALTER TABLE "fa" RENAME COLUMN "in_charge" TO "user_in_charge_id";

-- RenameForeignKey
ALTER TABLE "fa" RENAME CONSTRAINT "fa_in_charge_fkey" TO "fa_user_in_charge_id_fkey";
