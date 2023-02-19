-- CreateEnum
CREATE TYPE "request_type" AS ENUM ('USER', 'TEAM');

-- CreateTable
CREATE TABLE "ft_timespan" (
    "id" SERIAL NOT NULL,
    "time_window_id" INTEGER NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ft_timespan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ft_timespan" ADD CONSTRAINT "ft_timespan_time_window_id_fkey" FOREIGN KEY ("time_window_id") REFERENCES "ft_time_windows"("id") ON DELETE CASCADE ON UPDATE CASCADE;
