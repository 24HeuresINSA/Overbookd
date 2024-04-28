-- CreateIndex
CREATE INDEX "ft_is_deleted_idx" ON "ft"("is_deleted");

-- CreateIndex
CREATE INDEX "transaction_is_deleted_idx" ON "transaction"("is_deleted");

-- CreateIndex
CREATE INDEX "user_is_deleted_idx" ON "user"("is_deleted");
