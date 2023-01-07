-- CreateEnum
CREATE TYPE "Ft_Status" AS ENUM ('DRAFT', 'SUBMITTED', 'VALIDATED', 'REFUSED', 'READY');

-- CreateEnum
CREATE TYPE "Validation_Status" AS ENUM ('VALIDATED', 'REFUSED');

-- CreateTable
CREATE TABLE "Ft" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status" "Ft_Status" NOT NULL,
    "is_static" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "in_charge" INTEGER,
    "location_id" INTEGER,

    CONSTRAINT "Ft_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ft_Comments" (
    "id" SERIAL NOT NULL,
    "Ft_id" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "subject" "subject_type" NOT NULL,
    "author" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ft_Comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ft_Time_Windows" (
    "id" SERIAL NOT NULL,
    "Ft_id" INTEGER NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ft_Time_Windows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ft_User_Assignment" (
    "Ft_Time_Windows_id" INTEGER NOT NULL,
    "User_id" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Ft_Generic_Assignment" (
    "Ft_Time_Windows_id" INTEGER NOT NULL,
    "Team_id" INTEGER NOT NULL,
    "number" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Ft_Valdation_Refuse" (
    "Ft_id" INTEGER NOT NULL,
    "team_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "Validation_Status" NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Ft_User_Assignment_Ft_Time_Windows_id_User_id_key" ON "Ft_User_Assignment"("Ft_Time_Windows_id", "User_id");

-- CreateIndex
CREATE UNIQUE INDEX "Ft_Generic_Assignment_Ft_Time_Windows_id_Team_id_key" ON "Ft_Generic_Assignment"("Ft_Time_Windows_id", "Team_id");

-- CreateIndex
CREATE UNIQUE INDEX "Ft_Valdation_Refuse_Ft_id_team_id_key" ON "Ft_Valdation_Refuse"("Ft_id", "team_id");

-- AddForeignKey
ALTER TABLE "Ft" ADD CONSTRAINT "Ft_in_charge_fkey" FOREIGN KEY ("in_charge") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ft" ADD CONSTRAINT "Ft_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "Signa_Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ft_Comments" ADD CONSTRAINT "Ft_Comments_Ft_id_fkey" FOREIGN KEY ("Ft_id") REFERENCES "Ft"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ft_Comments" ADD CONSTRAINT "Ft_Comments_author_fkey" FOREIGN KEY ("author") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ft_Time_Windows" ADD CONSTRAINT "Ft_Time_Windows_Ft_id_fkey" FOREIGN KEY ("Ft_id") REFERENCES "Ft"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ft_User_Assignment" ADD CONSTRAINT "Ft_User_Assignment_Ft_Time_Windows_id_fkey" FOREIGN KEY ("Ft_Time_Windows_id") REFERENCES "Ft_Time_Windows"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ft_User_Assignment" ADD CONSTRAINT "Ft_User_Assignment_User_id_fkey" FOREIGN KEY ("User_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ft_Generic_Assignment" ADD CONSTRAINT "Ft_Generic_Assignment_Ft_Time_Windows_id_fkey" FOREIGN KEY ("Ft_Time_Windows_id") REFERENCES "Ft_Time_Windows"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ft_Generic_Assignment" ADD CONSTRAINT "Ft_Generic_Assignment_Team_id_fkey" FOREIGN KEY ("Team_id") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ft_Valdation_Refuse" ADD CONSTRAINT "Ft_Valdation_Refuse_Ft_id_fkey" FOREIGN KEY ("Ft_id") REFERENCES "Ft"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ft_Valdation_Refuse" ADD CONSTRAINT "Ft_Valdation_Refuse_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
