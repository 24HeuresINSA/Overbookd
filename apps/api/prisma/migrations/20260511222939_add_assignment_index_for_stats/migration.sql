-- CreateIndex
CREATE INDEX "assignee_user_id_idx" ON "assignee"("user_id");

-- CreateIndex
CREATE INDEX "assignee_festival_task_id_idx" ON "assignee"("festival_task_id");

-- CreateIndex
CREATE INDEX "assignee_assignment_id_idx" ON "assignee"("assignment_id");

-- CreateIndex
CREATE INDEX "friend_requestor_id_idx" ON "friend"("requestor_id");

-- CreateIndex
CREATE INDEX "friend_friend_id_idx" ON "friend"("friend_id");
