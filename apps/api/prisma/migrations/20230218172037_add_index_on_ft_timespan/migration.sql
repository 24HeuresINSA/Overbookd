-- DropEnum
DROP TYPE "request_type";

-- CreateIndex
CREATE INDEX "ft_timespan_start_idx" ON "ft_timespan"("start" ASC);

-- CreateIndex
CREATE INDEX "ft_timespan_end_idx" ON "ft_timespan"("end" DESC);

-- CreateIndex
CREATE INDEX "ft_timespan_start_end_idx" ON "ft_timespan"("start" ASC, "end" ASC);
