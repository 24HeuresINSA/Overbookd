-- RenameTable
ALTER TABLE "assignment" RENAME TO "old_assignment";

-- RenameForeignKey
ALTER TABLE "old_assignment" RENAME CONSTRAINT "assignment_assignee_id_fkey" TO "old_assignment_assignee_id_fkey";

-- RenameForeignKey
ALTER TABLE "old_assignment" RENAME CONSTRAINT "assignment_team_request_id_fkey" TO "old_assignment_team_request_id_fkey";

-- RenameForeignKey
ALTER TABLE "old_assignment" RENAME CONSTRAINT "assignment_time_span_id_fkey" TO "old_assignment_time_span_id_fkey";

-- RenameForeignKey
ALTER TABLE "old_assignment" RENAME CONSTRAINT "assignment_user_request_id_fkey" TO "old_assignment_user_request_id_fkey";

-- RenamePrimaryKey
ALTER TABLE "old_assignment" RENAME CONSTRAINT "assignment_pkey" TO "old_assignment_pkey";

-- RenameIndex
ALTER INDEX "assignment_time_span_id_assignee_id_key" RENAME TO "old_assignment_time_span_id_assignee_id_key";
