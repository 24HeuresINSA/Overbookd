-- CreateTable
CREATE TABLE "charisma_group" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "charisma" INTEGER NOT NULL DEFAULT 5,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "charisma_group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_availabilty" (
    "user_id" INTEGER NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE INDEX "charisma_group_start_idx" ON "charisma_group"("start" ASC);

-- CreateIndex
CREATE INDEX "charisma_group_end_idx" ON "charisma_group"("end" ASC);

-- CreateIndex
CREATE INDEX "charisma_group_start_end_idx" ON "charisma_group"("start" ASC, "end" ASC);

-- CreateIndex
CREATE INDEX "user_availabilty_start_idx" ON "user_availabilty"("start" ASC);

-- CreateIndex
CREATE INDEX "user_availabilty_end_idx" ON "user_availabilty"("end" ASC);

-- CreateIndex
CREATE INDEX "user_availabilty_start_end_idx" ON "user_availabilty"("start" ASC, "end" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "user_availabilty_user_id_start_end_key" ON "user_availabilty"("user_id", "start", "end");

-- AddForeignKey
ALTER TABLE "user_availabilty" ADD CONSTRAINT "user_availabilty_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
