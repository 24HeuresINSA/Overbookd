-- CreateTable
CREATE TABLE "catalog_signage" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(40) NOT NULL,
    "image" TEXT,
    "category_id" INTEGER,

    CONSTRAINT "catalog_signage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "catalog_signage_name_key" ON "catalog_signage"("name");

-- AddForeignKey
ALTER TABLE "catalog_signage" ADD CONSTRAINT "catalog_signage_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "catalog_category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
