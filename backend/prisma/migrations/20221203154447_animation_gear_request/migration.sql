-- CreateTable
CREATE TABLE "Period" (
    "id" SERIAL NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Period_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Animation_Gear_Request" (
    "animationId" INTEGER NOT NULL,
    "rentalPeriodId" INTEGER NOT NULL,
    "gearId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "status" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "Period_start_end_idx" ON "Period"("start", "end");

-- CreateIndex
CREATE UNIQUE INDEX "Animation_Gear_Request_rentalPeriodId_key" ON "Animation_Gear_Request"("rentalPeriodId");

-- CreateIndex
CREATE INDEX "Animation_Gear_Request_status_idx" ON "Animation_Gear_Request"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Animation_Gear_Request_animationId_gearId_key" ON "Animation_Gear_Request"("animationId", "gearId");

-- AddForeignKey
ALTER TABLE "Animation_Gear_Request" ADD CONSTRAINT "Animation_Gear_Request_animationId_fkey" FOREIGN KEY ("animationId") REFERENCES "fa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Animation_Gear_Request" ADD CONSTRAINT "Animation_Gear_Request_rentalPeriodId_fkey" FOREIGN KEY ("rentalPeriodId") REFERENCES "Period"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Animation_Gear_Request" ADD CONSTRAINT "Animation_Gear_Request_gearId_fkey" FOREIGN KEY ("gearId") REFERENCES "Catalog_Gear"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
