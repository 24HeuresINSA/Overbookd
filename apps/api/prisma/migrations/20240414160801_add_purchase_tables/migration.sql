-- CreateTable
CREATE TABLE "purchase" (
    "id" INTEGER NOT NULL,
    "seller" TEXT NOT NULL,
    "available_on" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "purchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_gear_request" (
    "purchase_id" INTEGER NOT NULL,
    "gear_slug" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "purchase_gear_request_pkey" PRIMARY KEY ("purchase_id","gear_slug")
);

-- AddForeignKey
ALTER TABLE "purchase_gear_request" ADD CONSTRAINT "purchase_gear_request_purchase_id_fkey" FOREIGN KEY ("purchase_id") REFERENCES "purchase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_gear_request" ADD CONSTRAINT "purchase_gear_request_gear_slug_fkey" FOREIGN KEY ("gear_slug") REFERENCES "catalog_gear"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;
