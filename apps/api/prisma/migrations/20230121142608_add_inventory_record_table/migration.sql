-- CreateTable
CREATE TABLE "inventory_record" (
    "gear_id" INTEGER NOT NULL,
    "storage" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "inventory_record_gear_id_storage_key" ON "inventory_record"("gear_id", "storage");

-- AddForeignKey
ALTER TABLE "inventory_record" ADD CONSTRAINT "inventory_record_gear_id_fkey" FOREIGN KEY ("gear_id") REFERENCES "Catalog_Gear"("id") ON DELETE CASCADE ON UPDATE CASCADE;
