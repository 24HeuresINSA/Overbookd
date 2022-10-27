-- CreateEnum
CREATE TYPE "Status" AS ENUM ('DRAFT', 'SUBMITTED', 'VALIDATED', 'REFUSED');

-- CreateEnum
CREATE TYPE "LocationType" AS ENUM ('DEPOT', 'STOCKAGE', 'MAGASIN', 'SIGNA', 'AUTRE');

-- CreateEnum
CREATE TYPE "ElectricityType" AS ENUM ('ELECTRICITY', 'WATER', 'GAS', 'OTHER');

-- CreateEnum
CREATE TYPE "SignaType" AS ENUM ('BANNIERE', 'PANCARTE', 'PANNEAU');

-- CreateEnum
CREATE TYPE "Security_pass_schedules" AS ENUM ('JOUR', 'NUIT', 'JOUR_NUIT');

-- CreateEnum
CREATE TYPE "subject_type" AS ENUM ('REFUSED', 'VALIDATED', 'COMMENT');

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "fa_validator" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "ft_validator" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "FA" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "type" VARCHAR(255) NOT NULL,
    "team_id" VARCHAR(255) NOT NULL,
    "in_charge" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "location_id" INTEGER,
    "status" "Status" NOT NULL DEFAULT 'DRAFT',
    "description" TEXT NOT NULL,
    "is_publishable" BOOLEAN NOT NULL,
    "is_major" BOOLEAN NOT NULL,
    "is_kids" BOOLEAN NOT NULL,
    "security_needs" TEXT,
    "water_flow_required" INTEGER,

    CONSTRAINT "FA_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FA_type" (
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "FA_type_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "FA_validation" (
    "fa_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "FA_validation_pkey" PRIMARY KEY ("fa_id","user_id")
);

-- CreateTable
CREATE TABLE "FA_Collaborators" (
    "fa_id" INTEGER NOT NULL,
    "collaborator_id" INTEGER NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "FA_Collaborators_pkey" PRIMARY KEY ("fa_id","collaborator_id")
);

-- CreateTable
CREATE TABLE "FA_refuse" (
    "fa_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "FA_refuse_pkey" PRIMARY KEY ("fa_id","user_id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" SERIAL NOT NULL,
    "type" "LocationType" NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Collaborator" (
    "id" SERIAL NOT NULL,
    "firstname" VARCHAR(30) NOT NULL,
    "lastname" VARCHAR(30) NOT NULL,
    "phone" VARCHAR(30) NOT NULL,
    "email" VARCHAR(30),
    "company" VARCHAR(30),
    "comment" TEXT,

    CONSTRAINT "Collaborator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FA_Electricity_needs" (
    "id" SERIAL NOT NULL,
    "fa_id" INTEGER NOT NULL,
    "electricity_type" "ElectricityType" NOT NULL,
    "power" INTEGER NOT NULL,
    "comment" TEXT,

    CONSTRAINT "FA_Electricity_needs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FA_signa_needs" (
    "id" SERIAL NOT NULL,
    "fa_id" INTEGER NOT NULL,
    "signa_type" "SignaType" NOT NULL,
    "text" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "FA_signa_needs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Security_pass" (
    "id" SERIAL NOT NULL,
    "fa_id" INTEGER NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "phone" VARCHAR(30),
    "license_plate" VARCHAR(30),
    "email" VARCHAR(30) NOT NULL,
    "comment" TEXT,
    "entity" VARCHAR(30) NOT NULL,
    "reason" VARCHAR(30) NOT NULL,
    "schedule" "Security_pass_schedules" NOT NULL,

    CONSTRAINT "Security_pass_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FA_Comment" (
    "id" SERIAL NOT NULL,
    "fa_id" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "subject" "subject_type" NOT NULL,
    "author" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "team_id" VARCHAR(255) NOT NULL,

    CONSTRAINT "FA_Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimeWindow" (
    "id" SERIAL NOT NULL,
    "fa_id" INTEGER NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TimeWindow_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FA" ADD CONSTRAINT "FA_type_fkey" FOREIGN KEY ("type") REFERENCES "FA_type"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FA" ADD CONSTRAINT "FA_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FA" ADD CONSTRAINT "FA_in_charge_fkey" FOREIGN KEY ("in_charge") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FA" ADD CONSTRAINT "FA_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FA_validation" ADD CONSTRAINT "FA_validation_fa_id_fkey" FOREIGN KEY ("fa_id") REFERENCES "FA"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FA_validation" ADD CONSTRAINT "FA_validation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FA_Collaborators" ADD CONSTRAINT "FA_Collaborators_fa_id_fkey" FOREIGN KEY ("fa_id") REFERENCES "FA"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FA_Collaborators" ADD CONSTRAINT "FA_Collaborators_collaborator_id_fkey" FOREIGN KEY ("collaborator_id") REFERENCES "Collaborator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FA_refuse" ADD CONSTRAINT "FA_refuse_fa_id_fkey" FOREIGN KEY ("fa_id") REFERENCES "FA"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FA_refuse" ADD CONSTRAINT "FA_refuse_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FA_Electricity_needs" ADD CONSTRAINT "FA_Electricity_needs_fa_id_fkey" FOREIGN KEY ("fa_id") REFERENCES "FA"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FA_signa_needs" ADD CONSTRAINT "FA_signa_needs_fa_id_fkey" FOREIGN KEY ("fa_id") REFERENCES "FA"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Security_pass" ADD CONSTRAINT "Security_pass_fa_id_fkey" FOREIGN KEY ("fa_id") REFERENCES "FA"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FA_Comment" ADD CONSTRAINT "FA_Comment_fa_id_fkey" FOREIGN KEY ("fa_id") REFERENCES "FA"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FA_Comment" ADD CONSTRAINT "FA_Comment_author_fkey" FOREIGN KEY ("author") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FA_Comment" ADD CONSTRAINT "FA_Comment_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeWindow" ADD CONSTRAINT "TimeWindow_fa_id_fkey" FOREIGN KEY ("fa_id") REFERENCES "FA"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
