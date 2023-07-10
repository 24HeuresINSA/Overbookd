-- AlterTable
ALTER TABLE "ft_team_request" ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "ft_team_request_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ft_user_request" ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "ft_user_request_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "Assignment" (
    "id" SERIAL NOT NULL,
    "timespanId" INTEGER NOT NULL,
    "user_request_id" INTEGER,
    "team_request_id" INTEGER,
    "assignee_id" INTEGER NOT NULL,

    CONSTRAINT "Assignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Assignment_user_request_id_key" ON "Assignment"("user_request_id");

-- CreateIndex
CREATE UNIQUE INDEX "Assignment_timespanId_assignee_id_key" ON "Assignment"("timespanId", "assignee_id");

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_timespanId_fkey" FOREIGN KEY ("timespanId") REFERENCES "ft_timespan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_user_request_id_fkey" FOREIGN KEY ("user_request_id") REFERENCES "ft_user_request"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_team_request_id_fkey" FOREIGN KEY ("team_request_id") REFERENCES "ft_team_request"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_assignee_id_fkey" FOREIGN KEY ("assignee_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
