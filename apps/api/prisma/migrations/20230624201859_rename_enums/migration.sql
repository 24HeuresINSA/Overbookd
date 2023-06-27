ALTER TYPE "TransactionType" RENAME TO "transaction_type";
ALTER TYPE "Year" RENAME TO "year";
ALTER TYPE "Department" RENAME TO "department";
ALTER TYPE "Status" RENAME TO "fa_status";
ALTER TYPE "subject_type" RENAME TO "fa_feedback_subject_type";
ALTER TYPE "ft_subject_type" RENAME TO "ft_feedback_subject_type";
ALTER TYPE "time_windows_type" RENAME TO "time_window_type";

-- AlterTable
ALTER TABLE "fa_time_window" DROP COLUMN "type";
-- DropEnum
DROP TYPE "time_window_type";