-- CreateEnum
CREATE TYPE "festival_activity_status" AS ENUM ('DRAFT', 'IN_REVIEW');

-- CreateEnum
CREATE TYPE "signage_type" AS ENUM ('BACHE', 'PANNEAU', 'AFFICHE');

-- CreateEnum
CREATE TYPE "electricity_connection" AS ENUM ('PC16_Prise_classique', 'P17_16A_MONO', 'P17_16A_TRI', 'P17_16A_TETRA', 'P17_32A_MONO', 'P17_32A_TRI', 'P17_32A_TETRA', 'P17_63A_MONO', 'P17_63A_TRI', 'P17_63A_TETRA', 'P17_125A_TETRA');

-- CreateTable
CREATE TABLE "FestivalActivity" (
    "id" INTEGER NOT NULL,
    "status" "festival_activity_status" NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "description" TEXT,
    "to_publish" BOOLEAN NOT NULL,
    "photo_link" TEXT,
    "is_flagship" BOOLEAN NOT NULL,
    "categories" VARCHAR(20)[],
    "team_code" VARCHAR(20),
    "adherent_id" INTEGER,
    "location" VARCHAR(50),
    "special_need" TEXT,
    "water" TEXT
);

-- CreateTable
CREATE TABLE "festival_activity_time_window" (
    "id" VARCHAR(30) NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "fa_id" INTEGER NOT NULL,

    CONSTRAINT "festival_activity_time_window_pkey" PRIMARY KEY ("fa_id","id")
);

-- CreateTable
CREATE TABLE "contractor" (
    "id" INTEGER NOT NULL,
    "firstname" VARCHAR(30) NOT NULL,
    "lastname" VARCHAR(30) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "email" VARCHAR(30),
    "company" VARCHAR(30),
    "comment" TEXT,
    "fa_id" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "festival_activity_signage" (
    "id" VARCHAR(30) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "text" VARCHAR(30) NOT NULL,
    "size" VARCHAR(30) NOT NULL,
    "type" "signage_type" NOT NULL,
    "comment" TEXT,
    "fa_id" INTEGER NOT NULL,

    CONSTRAINT "festival_activity_signage_pkey" PRIMARY KEY ("fa_id","id")
);

-- CreateTable
CREATE TABLE "festival_activity_electricity_supply" (
    "id" VARCHAR(30) NOT NULL,
    "connection" "electricity_connection" NOT NULL,
    "device" VARCHAR(30) NOT NULL,
    "power" INTEGER NOT NULL,
    "count" INTEGER NOT NULL,
    "comment" TEXT,
    "festival_supply_id" INTEGER NOT NULL,

    CONSTRAINT "festival_activity_electricity_supply_pkey" PRIMARY KEY ("festival_supply_id","id")
);

-- CreateTable
CREATE TABLE "inquiry_request" (
    "slug" VARCHAR(30) NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "fa_id" INTEGER NOT NULL,

    CONSTRAINT "inquiry_request_pkey" PRIMARY KEY ("slug","fa_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FestivalActivity_id_key" ON "FestivalActivity"("id");

-- CreateIndex
CREATE UNIQUE INDEX "contractor_fa_id_id_key" ON "contractor"("fa_id", "id");

-- AddForeignKey
ALTER TABLE "FestivalActivity" ADD CONSTRAINT "FestivalActivity_team_code_fkey" FOREIGN KEY ("team_code") REFERENCES "team"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FestivalActivity" ADD CONSTRAINT "FestivalActivity_adherent_id_fkey" FOREIGN KEY ("adherent_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_activity_time_window" ADD CONSTRAINT "fa_general" FOREIGN KEY ("fa_id") REFERENCES "FestivalActivity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_activity_time_window" ADD CONSTRAINT "fa_inquiry" FOREIGN KEY ("fa_id") REFERENCES "FestivalActivity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contractor" ADD CONSTRAINT "contractor_fa_id_fkey" FOREIGN KEY ("fa_id") REFERENCES "FestivalActivity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_activity_signage" ADD CONSTRAINT "festival_activity_signage_fa_id_fkey" FOREIGN KEY ("fa_id") REFERENCES "FestivalActivity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_activity_electricity_supply" ADD CONSTRAINT "festival_activity_electricity_supply_festival_supply_id_fkey" FOREIGN KEY ("festival_supply_id") REFERENCES "FestivalActivity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiry_request" ADD CONSTRAINT "inquiry_request_slug_fkey" FOREIGN KEY ("slug") REFERENCES "catalog_gear"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiry_request" ADD CONSTRAINT "inquiry_request_fa_id_fkey" FOREIGN KEY ("fa_id") REFERENCES "FestivalActivity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
