-- CreateEnum
CREATE TYPE "Status" AS ENUM ('DRAFT', 'SUBMITTED', 'VALIDATED', 'REFUSED');

-- CreateEnum
CREATE TYPE "fa_type" AS ENUM ('Concert', 'Course', 'Divertissement', 'Initiation', 'Tournoi', 'Vente', 'Prevention', 'Spectacle', 'Autre');

-- CreateEnum
CREATE TYPE "locationType" AS ENUM ('DEPOT', 'STOCKAGE', 'MAGASIN', 'SIGNA', 'AUTRE');

-- CreateEnum
CREATE TYPE "electricity_type" AS ENUM ('PC16', 'P17_16A_MONO', 'P17_16A_TRI', 'P17_32A_MONO', 'P17_32A_TRI', 'P17_32A_TETRA');

-- CreateEnum
CREATE TYPE "signa_type" AS ENUM ('BANNIERE', 'PANCARTE', 'PANNEAU');

-- CreateEnum
CREATE TYPE "subject_type" AS ENUM ('REFUSED', 'VALIDATED', 'COMMENT');

-- CreateEnum
CREATE TYPE "time_windows_type" AS ENUM ('ANIM', 'MATOS');

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "fa_validator" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "ft_validator" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "fa" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "fa_type_name" "fa_type",
    "type" VARCHAR(255),
    "team_id" INTEGER,
    "in_charge" INTEGER,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "location_id" INTEGER,
    "status" "Status" DEFAULT 'DRAFT',
    "description" TEXT,
    "is_publishable" BOOLEAN DEFAULT false,
    "is_major" BOOLEAN DEFAULT false,
    "is_kids" BOOLEAN DEFAULT false,
    "security_needs" TEXT,
    "is_pass_required" BOOLEAN,
    "number_of_pass" INTEGER,
    "water_needs" TEXT,
    "water_flow_required" INTEGER,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "fa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fa_validation" (
    "fa_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "team_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "fa_validation_pkey" PRIMARY KEY ("fa_id","user_id")
);

-- CreateTable
CREATE TABLE "fa_collaborators" (
    "fa_id" INTEGER NOT NULL,
    "collaborator_id" INTEGER NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "fa_collaborators_pkey" PRIMARY KEY ("fa_id","collaborator_id")
);

-- CreateTable
CREATE TABLE "fa_refuse" (
    "fa_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "team_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "fa_refuse_pkey" PRIMARY KEY ("fa_id","user_id")
);

-- CreateTable
CREATE TABLE "location" (
    "id" SERIAL NOT NULL,
    "type" "locationType" NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collaborator" (
    "id" SERIAL NOT NULL,
    "firstname" VARCHAR(30) NOT NULL,
    "lastname" VARCHAR(30) NOT NULL,
    "phone" VARCHAR(30) NOT NULL,
    "email" VARCHAR(30),
    "company" VARCHAR(30),
    "comment" TEXT,

    CONSTRAINT "collaborator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fa_electricity_needs" (
    "id" SERIAL NOT NULL,
    "fa_id" INTEGER NOT NULL,
    "electricity_type" "electricity_type" NOT NULL,
    "power" INTEGER NOT NULL,
    "comment" TEXT,

    CONSTRAINT "fa_electricity_needs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fa_signa_needs" (
    "id" SERIAL NOT NULL,
    "fa_id" INTEGER NOT NULL,
    "signa_type" "signa_type" NOT NULL,
    "text" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "comment" TEXT,

    CONSTRAINT "fa_signa_needs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fa_comments" (
    "id" SERIAL NOT NULL,
    "fa_id" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "subject" "subject_type" NOT NULL,
    "author" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fa_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "time_windows" (
    "id" SERIAL NOT NULL,
    "fa_id" INTEGER NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "type" "time_windows_type" NOT NULL,

    CONSTRAINT "time_windows_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "collaborator_firstname_lastname_key" ON "collaborator"("firstname", "lastname");

-- AddForeignKey
ALTER TABLE "fa" ADD CONSTRAINT "fa_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fa" ADD CONSTRAINT "fa_in_charge_fkey" FOREIGN KEY ("in_charge") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fa" ADD CONSTRAINT "fa_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fa_validation" ADD CONSTRAINT "fa_validation_fa_id_fkey" FOREIGN KEY ("fa_id") REFERENCES "fa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fa_validation" ADD CONSTRAINT "fa_validation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fa_validation" ADD CONSTRAINT "fa_validation_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fa_collaborators" ADD CONSTRAINT "fa_collaborators_fa_id_fkey" FOREIGN KEY ("fa_id") REFERENCES "fa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fa_collaborators" ADD CONSTRAINT "fa_collaborators_collaborator_id_fkey" FOREIGN KEY ("collaborator_id") REFERENCES "collaborator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fa_refuse" ADD CONSTRAINT "fa_refuse_fa_id_fkey" FOREIGN KEY ("fa_id") REFERENCES "fa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fa_refuse" ADD CONSTRAINT "fa_refuse_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fa_refuse" ADD CONSTRAINT "fa_refuse_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fa_electricity_needs" ADD CONSTRAINT "fa_electricity_needs_fa_id_fkey" FOREIGN KEY ("fa_id") REFERENCES "fa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fa_signa_needs" ADD CONSTRAINT "fa_signa_needs_fa_id_fkey" FOREIGN KEY ("fa_id") REFERENCES "fa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fa_comments" ADD CONSTRAINT "fa_comments_fa_id_fkey" FOREIGN KEY ("fa_id") REFERENCES "fa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fa_comments" ADD CONSTRAINT "fa_comments_author_fkey" FOREIGN KEY ("author") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_windows" ADD CONSTRAINT "time_windows_fa_id_fkey" FOREIGN KEY ("fa_id") REFERENCES "fa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
