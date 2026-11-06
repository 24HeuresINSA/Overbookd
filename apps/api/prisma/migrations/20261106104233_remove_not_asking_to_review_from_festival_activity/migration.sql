BEGIN;

UPDATE "festival_activity_review" AS review
SET "status" = 'APPROVED'::"festival_activity_review_status"
FROM "festival_activity" AS activity
WHERE review."fa_id" = activity."id"
  AND review."status" = 'NOT_ASKING_TO_REVIEW'::"festival_activity_review_status"
  AND activity."status" = 'VALIDATED';

ALTER TYPE "festival_activity_review_status"
RENAME TO "festival_activity_review_status_old";

CREATE TYPE "festival_activity_review_status" AS ENUM (
  'REVIEWING',
  'APPROVED',
  'REJECTED'
);

ALTER TABLE "festival_activity_review"
ALTER COLUMN "status" TYPE "festival_activity_review_status"
USING (
  CASE "status"::text
    WHEN 'NOT_ASKING_TO_REVIEW' THEN 'REVIEWING'
    ELSE "status"::text
  END
)::"festival_activity_review_status";

DROP TYPE "festival_activity_review_status_old";

COMMIT;
