-- CreateTable
CREATE TABLE "charisma_period" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "charisma" INTEGER NOT NULL DEFAULT 5,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "charisma_period_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "volunteer_availabilty" (
    "user_id" INTEGER NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE INDEX "charisma_period_start_idx" ON "charisma_period"("start" ASC);

-- CreateIndex
CREATE INDEX "charisma_period_end_idx" ON "charisma_period"("end" ASC);

-- CreateIndex
CREATE INDEX "charisma_period_start_end_idx" ON "charisma_period"("start" ASC, "end" ASC);

-- CreateIndex
CREATE INDEX "volunteer_availabilty_start_idx" ON "volunteer_availabilty"("start" ASC);

-- CreateIndex
CREATE INDEX "volunteer_availabilty_end_idx" ON "volunteer_availabilty"("end" ASC);

-- CreateIndex
CREATE INDEX "volunteer_availabilty_start_end_idx" ON "volunteer_availabilty"("start" ASC, "end" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "volunteer_availabilty_user_id_start_end_key" ON "volunteer_availabilty"("user_id", "start", "end");

-- AddForeignKey
ALTER TABLE "volunteer_availabilty" ADD CONSTRAINT "volunteer_availabilty_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
