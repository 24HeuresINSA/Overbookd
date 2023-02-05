-- CreateIndex
CREATE INDEX "ft_time_windows_start_idx" ON "ft_time_windows"("start" ASC);

-- CreateIndex
CREATE INDEX "ft_time_windows_end_idx" ON "ft_time_windows"("end" DESC);
