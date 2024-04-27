-- CreateTable
CREATE TABLE "break_period" (
    "volunteer_id" INTEGER NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE INDEX "break_period_start_idx" ON "break_period"("start" ASC);

-- CreateIndex
CREATE INDEX "break_period_end_idx" ON "break_period"("end" ASC);

-- CreateIndex
CREATE INDEX "break_period_start_end_idx" ON "break_period"("start" ASC, "end" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "break_period_volunteer_id_start_end_key" ON "break_period"("volunteer_id", "start", "end");

-- AddForeignKey
ALTER TABLE "break_period" ADD CONSTRAINT "break_period_volunteer_id_fkey" FOREIGN KEY ("volunteer_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
