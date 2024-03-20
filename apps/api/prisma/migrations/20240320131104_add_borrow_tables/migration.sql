-- CreateTable
CREATE TABLE "borrow" (
    "id" INTEGER NOT NULL,
    "lender" TEXT NOT NULL,
    "available_on" TIMESTAMP(3) NOT NULL,
    "unavailable_on" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "borrow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "borrow_gear_request" (
    "borrow_id" INTEGER NOT NULL,
    "gear_slug" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "borrow_gear_request_pkey" PRIMARY KEY ("borrow_id","gear_slug")
);

-- AddForeignKey
ALTER TABLE "borrow_gear_request" ADD CONSTRAINT "borrow_gear_request_borrow_id_fkey" FOREIGN KEY ("borrow_id") REFERENCES "borrow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "borrow_gear_request" ADD CONSTRAINT "borrow_gear_request_gear_slug_fkey" FOREIGN KEY ("gear_slug") REFERENCES "catalog_gear"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;
