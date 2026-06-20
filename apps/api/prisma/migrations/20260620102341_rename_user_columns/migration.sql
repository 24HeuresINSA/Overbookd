-- Rename columns
ALTER TABLE "user"
RENAME COLUMN "birthdate" TO "date_of_birth";

ALTER TABLE "user"
RENAME COLUMN "firstname" TO "first_name";

ALTER TABLE "user"
RENAME COLUMN "lastname" TO "last_name";

ALTER TABLE "user"
RENAME COLUMN "phone" TO "phone_number";

ALTER TABLE "contractor"
RENAME COLUMN "firstname" TO "first_name";

ALTER TABLE "contractor"
RENAME COLUMN "lastname" TO "last_name";

ALTER TABLE "contractor"
RENAME COLUMN "phone" TO "phone_number";
