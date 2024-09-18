-- CreateEnum
CREATE TYPE "membership" AS ENUM ('VOLUNTEER', 'STAFF');

-- AlterTable
ALTER TABLE "user"
ALTER COLUMN "registration_membership" TYPE "membership"
USING "registration_membership"::text::"membership";

-- DropEnum
DROP TYPE "registration_membership";

-- CreateTable
CREATE TABLE "membership_application" (
    "user_id" INTEGER NOT NULL,
    "edition" INTEGER NOT NULL,
    "membership" "membership" NOT NULL,

    CONSTRAINT "membership_application_pkey" PRIMARY KEY ("user_id","edition","membership")
);

-- AddForeignKey
ALTER TABLE "membership_application" ADD CONSTRAINT "membership_application_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
