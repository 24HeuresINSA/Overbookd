-- CreateEnum
CREATE TYPE "festival_activity_status" AS ENUM ('DRAFT', 'IN_REVIEW');

-- CreateEnum
CREATE TYPE "signage_type" AS ENUM ('BACHE', 'PANNEAU', 'AFFICHE');

-- CreateEnum
CREATE TYPE "electricity_connection" AS ENUM ('PC16_Prise_classique', 'P17_16A_MONO', 'P17_16A_TRI', 'P17_16A_TETRA', 'P17_32A_MONO', 'P17_32A_TRI', 'P17_32A_TETRA', 'P17_63A_MONO', 'P17_63A_TRI', 'P17_63A_TETRA', 'P17_125A_TETRA');

-- CreateEnum
CREATE TYPE "festival_activity_review_status" AS ENUM ('REVIEWING', 'NOT_ASKING_TO_REVIEW');

-- CreateTable
CREATE TABLE "festival_activity" (
    "id" SERIAL NOT NULL,
    "status" "festival_activity_status" NOT NULL,

    CONSTRAINT "festival_activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "festival_activity_general" (
    "fa_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "to_publish" BOOLEAN NOT NULL DEFAULT false,
    "photo_link" TEXT,
    "is_flagship" BOOLEAN NOT NULL DEFAULT false,
    "categories" TEXT[],

    CONSTRAINT "festival_activity_general_pkey" PRIMARY KEY ("fa_id")
);

-- CreateTable
CREATE TABLE "festival_activity_time_window" (
    "id" TEXT NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "fa_id" INTEGER,
    "festivalActivityInquiryFaId" INTEGER,

    CONSTRAINT "festival_activity_time_window_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "festival_activity_in_charge" (
    "fa_id" INTEGER NOT NULL,
    "team" TEXT,
    "adherent_id" INTEGER,

    CONSTRAINT "festival_activity_in_charge_pkey" PRIMARY KEY ("fa_id")
);

-- CreateTable
CREATE TABLE "Contractor" (
    "id" SERIAL NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "company" TEXT,
    "comment" TEXT,
    "fa_id" INTEGER,

    CONSTRAINT "Contractor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "festival_activity_signa" (
    "fa_id" INTEGER NOT NULL,
    "location" TEXT,

    CONSTRAINT "festival_activity_signa_pkey" PRIMARY KEY ("fa_id")
);

-- CreateTable
CREATE TABLE "festival_activity_signage" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "size" VARCHAR(50) NOT NULL,
    "type" "signage_type" NOT NULL,
    "comment" TEXT,
    "fa_signa_id" INTEGER NOT NULL,

    CONSTRAINT "festival_activity_signage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "festival_activity_security" (
    "fa_id" INTEGER NOT NULL,
    "special_need" TEXT,

    CONSTRAINT "festival_activity_security_pkey" PRIMARY KEY ("fa_id")
);

-- CreateTable
CREATE TABLE "festival_activity_supply" (
    "fa_id" INTEGER NOT NULL,
    "water" TEXT,

    CONSTRAINT "festival_activity_supply_pkey" PRIMARY KEY ("fa_id")
);

-- CreateTable
CREATE TABLE "festival_activity_electricity_supply" (
    "id" TEXT NOT NULL,
    "connection" "electricity_connection" NOT NULL,
    "device" TEXT NOT NULL,
    "power" INTEGER NOT NULL,
    "count" INTEGER NOT NULL,
    "comment" TEXT,
    "festival_supply_id" INTEGER,

    CONSTRAINT "festival_activity_electricity_supply_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "festival_activity_inquiry" (
    "fa_id" INTEGER NOT NULL,

    CONSTRAINT "festival_activity_inquiry_pkey" PRIMARY KEY ("fa_id")
);

-- CreateTable
CREATE TABLE "inquiry_request" (
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "fa_id" INTEGER,

    CONSTRAINT "inquiry_request_pkey" PRIMARY KEY ("slug")
);

-- CreateTable
CREATE TABLE "festival_activity_reviews" (
    "fa_id" INTEGER NOT NULL,
    "humain" "festival_activity_review_status" NOT NULL,
    "signa" "festival_activity_review_status" NOT NULL,
    "secu" "festival_activity_review_status" NOT NULL,
    "matos" "festival_activity_review_status" NOT NULL,
    "elec" "festival_activity_review_status" NOT NULL,
    "barrieres" "festival_activity_review_status" NOT NULL,
    "comcom" "festival_activity_review_status" NOT NULL,

    CONSTRAINT "festival_activity_reviews_pkey" PRIMARY KEY ("fa_id")
);

-- AddForeignKey
ALTER TABLE "festival_activity_general" ADD CONSTRAINT "festival_activity_general_fa_id_fkey" FOREIGN KEY ("fa_id") REFERENCES "festival_activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_activity_time_window" ADD CONSTRAINT "festival_activity_time_window_fa_id_fkey" FOREIGN KEY ("fa_id") REFERENCES "festival_activity_general"("fa_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_activity_time_window" ADD CONSTRAINT "festival_activity_time_window_festivalActivityInquiryFaId_fkey" FOREIGN KEY ("festivalActivityInquiryFaId") REFERENCES "festival_activity_inquiry"("fa_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_activity_in_charge" ADD CONSTRAINT "festival_activity_in_charge_fa_id_fkey" FOREIGN KEY ("fa_id") REFERENCES "festival_activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_activity_in_charge" ADD CONSTRAINT "festival_activity_in_charge_adherent_id_fkey" FOREIGN KEY ("adherent_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contractor" ADD CONSTRAINT "Contractor_fa_id_fkey" FOREIGN KEY ("fa_id") REFERENCES "festival_activity_in_charge"("fa_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_activity_signa" ADD CONSTRAINT "festival_activity_signa_fa_id_fkey" FOREIGN KEY ("fa_id") REFERENCES "festival_activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_activity_signage" ADD CONSTRAINT "festival_activity_signage_fa_signa_id_fkey" FOREIGN KEY ("fa_signa_id") REFERENCES "festival_activity_signa"("fa_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_activity_security" ADD CONSTRAINT "festival_activity_security_fa_id_fkey" FOREIGN KEY ("fa_id") REFERENCES "festival_activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_activity_supply" ADD CONSTRAINT "festival_activity_supply_fa_id_fkey" FOREIGN KEY ("fa_id") REFERENCES "festival_activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_activity_electricity_supply" ADD CONSTRAINT "festival_activity_electricity_supply_festival_supply_id_fkey" FOREIGN KEY ("festival_supply_id") REFERENCES "festival_activity_supply"("fa_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_activity_inquiry" ADD CONSTRAINT "festival_activity_inquiry_fa_id_fkey" FOREIGN KEY ("fa_id") REFERENCES "festival_activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiry_request" ADD CONSTRAINT "inquiry_request_slug_fkey" FOREIGN KEY ("slug") REFERENCES "catalog_gear"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiry_request" ADD CONSTRAINT "inquiry_request_fa_id_fkey" FOREIGN KEY ("fa_id") REFERENCES "festival_activity_inquiry"("fa_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_activity_reviews" ADD CONSTRAINT "festival_activity_reviews_fa_id_fkey" FOREIGN KEY ("fa_id") REFERENCES "festival_activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
