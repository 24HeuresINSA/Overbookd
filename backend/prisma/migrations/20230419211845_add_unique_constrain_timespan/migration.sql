/*
  Warnings:

  - A unique constraint covering the columns `[time_window_id,start,end]` on the table `ft_timespan` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ft_timespan_time_window_id_start_end_key" ON "ft_timespan"("time_window_id", "start", "end");
