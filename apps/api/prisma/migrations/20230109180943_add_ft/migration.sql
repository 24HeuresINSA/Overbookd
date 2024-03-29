-- CreateEnum
CREATE TYPE "ft_status" AS ENUM ('DRAFT', 'SUBMITTED', 'VALIDATED', 'REFUSED', 'READY');

-- CreateEnum
CREATE TYPE "ft_subject_type" AS ENUM ('REFUSED', 'SUBMIT', 'VALIDATED', 'COMMENT', 'READY');

-- CreateEnum
CREATE TYPE "review_status" AS ENUM ('VALIDATED', 'REFUSED');

-- CreateTable
CREATE TABLE "ft" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status" "ft_status" NOT NULL,
    "parent_fa_id" INTEGER,
    "is_static" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "user_in_charge_id" INTEGER,
    "location_id" INTEGER,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ft_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ft_comments" (
    "id" SERIAL NOT NULL,
    "ft_id" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "subject" "ft_subject_type" NOT NULL,
    "author_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ft_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ft_time_windows" (
    "id" SERIAL NOT NULL,
    "ft_id" INTEGER NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ft_time_windows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ft_user_request" (
    "ft_time_windows_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "ft_team_request" (
    "time_windows_id" INTEGER NOT NULL,
    "team_id" INTEGER NOT NULL,
    "number" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "ft_review" (
    "ft_id" INTEGER NOT NULL,
    "team_code" TEXT NOT NULL,
    "status" "review_status" NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ft_user_request_ft_time_windows_id_user_id_key" ON "ft_user_request"("ft_time_windows_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "ft_team_request_time_windows_id_team_id_key" ON "ft_team_request"("time_windows_id", "team_id");

-- CreateIndex
CREATE UNIQUE INDEX "ft_review_ft_id_team_code_key" ON "ft_review"("ft_id", "team_code");

-- AddForeignKey
ALTER TABLE "ft" ADD CONSTRAINT "ft_parent_fa_id_fkey" FOREIGN KEY ("parent_fa_id") REFERENCES "fa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ft" ADD CONSTRAINT "ft_user_in_charge_id_fkey" FOREIGN KEY ("user_in_charge_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ft" ADD CONSTRAINT "ft_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "Signa_Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ft_comments" ADD CONSTRAINT "ft_comments_ft_id_fkey" FOREIGN KEY ("ft_id") REFERENCES "ft"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ft_comments" ADD CONSTRAINT "ft_comments_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ft_time_windows" ADD CONSTRAINT "ft_time_windows_ft_id_fkey" FOREIGN KEY ("ft_id") REFERENCES "ft"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ft_user_request" ADD CONSTRAINT "ft_user_request_ft_time_windows_id_fkey" FOREIGN KEY ("ft_time_windows_id") REFERENCES "ft_time_windows"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ft_user_request" ADD CONSTRAINT "ft_user_request_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ft_team_request" ADD CONSTRAINT "ft_team_request_time_windows_id_fkey" FOREIGN KEY ("time_windows_id") REFERENCES "ft_time_windows"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ft_team_request" ADD CONSTRAINT "ft_team_request_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ft_review" ADD CONSTRAINT "ft_review_ft_id_fkey" FOREIGN KEY ("ft_id") REFERENCES "ft"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ft_review" ADD CONSTRAINT "ft_review_team_code_fkey" FOREIGN KEY ("team_code") REFERENCES "Team"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
