-- DropForeignKey
ALTER TABLE "borrow_gear_request" DROP CONSTRAINT "borrow_gear_request_borrow_id_fkey";

-- AddForeignKey
ALTER TABLE "borrow_gear_request" ADD CONSTRAINT "borrow_gear_request_borrow_id_fkey" FOREIGN KEY ("borrow_id") REFERENCES "borrow"("id") ON DELETE CASCADE ON UPDATE CASCADE;
