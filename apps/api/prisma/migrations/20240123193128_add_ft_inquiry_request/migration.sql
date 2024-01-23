-- CreateTable
CREATE TABLE "festival_task_inquiry_request" (
    "slug" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "drive" TEXT,
    "ft_id" INTEGER NOT NULL,

    CONSTRAINT "festival_task_inquiry_request_pkey" PRIMARY KEY ("slug","ft_id")
);

-- AddForeignKey
ALTER TABLE "festival_task_inquiry_request" ADD CONSTRAINT "festival_task_inquiry_request_slug_fkey" FOREIGN KEY ("slug") REFERENCES "catalog_gear"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_task_inquiry_request" ADD CONSTRAINT "festival_task_inquiry_request_ft_id_fkey" FOREIGN KEY ("ft_id") REFERENCES "festival_task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
