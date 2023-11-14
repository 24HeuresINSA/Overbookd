-- CreateTable
CREATE TABLE "barrel" (
    "slug" TEXT NOT NULL,
    "drink" TEXT NOT NULL,
    "price" INTEGER NOT NULL,

    CONSTRAINT "barrel_pkey" PRIMARY KEY ("slug")
);
