-- CreateTable
CREATE TABLE "catalog_signage" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(40) NOT NULL,
    "type" "signa_type" NOT NULL,
    "image" TEXT,

    CONSTRAINT "catalog_signage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "catalog_signage_name_key" ON "catalog_signage"("name");
