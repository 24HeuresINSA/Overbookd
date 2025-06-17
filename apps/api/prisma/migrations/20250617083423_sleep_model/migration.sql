-- CreateTable
CREATE TABLE "bed" (
    "id" INTEGER NOT NULL,
    "room_label" TEXT NOT NULL,
    "bed_label" TEXT NOT NULL,
    "sleeper_name" TEXT,
    "sleeper_id" INTEGER,
    "comment" TEXT,
    "wakeup" TIMESTAMP(3),

    CONSTRAINT "bed_pkey" PRIMARY KEY ("id")
);
