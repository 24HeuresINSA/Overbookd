ALTER TABLE "User" RENAME TO "user";
ALTER TABLE "Team" RENAME TO "team";
ALTER TABLE "User_Team" RENAME TO "user_team";
ALTER TABLE "Permission" RENAME TO "permission";
ALTER TABLE "Team_Permission" RENAME TO "team_permission";
ALTER TABLE "TimeSlot" RENAME TO "time_slot";
ALTER TABLE "Availabilities" RENAME TO "availability";
ALTER TABLE "Transaction" RENAME TO "transaction";
ALTER TABLE "fa_collaborators" RENAME TO "fa_collaborator";
ALTER TABLE "Signa_Location" RENAME TO "signa_location";
ALTER TABLE "fa_electricity_needs" RENAME TO "fa_electricity_need";
ALTER TABLE "fa_signa_needs" RENAME TO "fa_signa_need";
ALTER TABLE "fa_comments" RENAME TO "fa_feedback";
ALTER TABLE "time_windows" RENAME TO "fa_time_window";
ALTER TABLE "Catalog_Category" RENAME TO "catalog_category";
ALTER TABLE "Catalog_Gear" RENAME TO "catalog_gear";
ALTER TABLE "Configuration" RENAME TO "configuration";
ALTER TABLE "Period" RENAME TO "period";
ALTER TABLE "ft_time_windows" RENAME TO "ft_time_window";
ALTER TABLE "Assignment" RENAME TO "assignment";
ALTER TABLE "Friend" RENAME TO "friend";
ALTER TABLE "ft_timespan" RENAME TO "ft_time_span";

-- AlterTable
ALTER TABLE "assignment" RENAME CONSTRAINT "Assignment_pkey" TO "assignment_pkey";

-- AlterTable
ALTER TABLE "availability" RENAME CONSTRAINT "Availabilities_pkey" TO "availability_pkey";

-- AlterTable
ALTER TABLE "catalog_category" RENAME CONSTRAINT "Catalog_Category_pkey" TO "catalog_category_pkey";

-- AlterTable
ALTER TABLE "catalog_gear" RENAME CONSTRAINT "Catalog_Gear_pkey" TO "catalog_gear_pkey";

-- AlterTable
ALTER TABLE "configuration" RENAME CONSTRAINT "Configuration_pkey" TO "configuration_pkey";

-- AlterTable
ALTER TABLE "fa_collaborator" RENAME CONSTRAINT "fa_collaborators_pkey" TO "fa_collaborator_pkey";

-- AlterTable
ALTER TABLE "fa_electricity_need" RENAME CONSTRAINT "fa_electricity_needs_pkey" TO "fa_electricity_need_pkey";

-- AlterTable
ALTER TABLE "fa_feedback" RENAME CONSTRAINT "fa_comments_pkey" TO "fa_feedback_pkey";

-- AlterTable
ALTER TABLE "fa_signa_need" RENAME CONSTRAINT "fa_signa_needs_pkey" TO "fa_signa_need_pkey";

-- AlterTable
ALTER TABLE "fa_time_window" RENAME CONSTRAINT "time_windows_pkey" TO "fa_time_window_pkey";

-- AlterTable
ALTER TABLE "friend" RENAME CONSTRAINT "Friend_pkey" TO "friend_pkey";

-- AlterTable
ALTER TABLE "ft_time_window" RENAME CONSTRAINT "ft_time_windows_pkey" TO "ft_time_window_pkey";

-- AlterTable
ALTER TABLE "period" RENAME CONSTRAINT "Period_pkey" TO "period_pkey";

-- AlterTable
ALTER TABLE "permission" RENAME CONSTRAINT "Permission_pkey" TO "permission_pkey";

-- AlterTable
ALTER TABLE "signa_location" RENAME CONSTRAINT "Signa_Location_pkey" TO "signa_location_pkey";

-- AlterTable
ALTER TABLE "team" RENAME CONSTRAINT "Team_pkey" TO "team_pkey";

-- AlterTable
ALTER TABLE "team_permission" RENAME CONSTRAINT "Team_Permission_pkey" TO "team_permission_pkey";

-- AlterTable
ALTER TABLE "time_slot" RENAME CONSTRAINT "TimeSlot_pkey" TO "time_slot_pkey";

-- AlterTable
ALTER TABLE "transaction" RENAME CONSTRAINT "Transaction_pkey" TO "transaction_pkey";

-- AlterTable
ALTER TABLE "user" RENAME CONSTRAINT "User_pkey" TO "user_pkey";

-- AlterTable
ALTER TABLE "user_team" RENAME CONSTRAINT "User_Team_pkey" TO "user_team_pkey";

-- RenameForeignKey
ALTER TABLE "assignment" RENAME CONSTRAINT "Assignment_assignee_id_fkey" TO "assignment_assignee_id_fkey";

-- RenameForeignKey
ALTER TABLE "assignment" RENAME CONSTRAINT "Assignment_team_request_id_fkey" TO "assignment_team_request_id_fkey";

-- RenameForeignKey
ALTER TABLE "assignment" RENAME CONSTRAINT "Assignment_timespanId_fkey" TO "assignment_timespanId_fkey";

-- RenameForeignKey
ALTER TABLE "assignment" RENAME CONSTRAINT "Assignment_user_request_id_fkey" TO "assignment_user_request_id_fkey";

-- RenameForeignKey
ALTER TABLE "availability" RENAME CONSTRAINT "Availabilities_timeslot_id_fkey" TO "availability_timeslot_id_fkey";

-- RenameForeignKey
ALTER TABLE "availability" RENAME CONSTRAINT "Availabilities_user_id_fkey" TO "availability_user_id_fkey";

-- RenameForeignKey
ALTER TABLE "catalog_category" RENAME CONSTRAINT "Catalog_Category_owner_id_fkey" TO "catalog_category_owner_id_fkey";

-- RenameForeignKey
ALTER TABLE "catalog_category" RENAME CONSTRAINT "Catalog_Category_parent_fkey" TO "catalog_category_parent_fkey";

-- RenameForeignKey
ALTER TABLE "catalog_gear" RENAME CONSTRAINT "Catalog_Gear_category_id_fkey" TO "catalog_gear_category_id_fkey";

-- RenameForeignKey
ALTER TABLE "fa_collaborator" RENAME CONSTRAINT "fa_collaborators_collaborator_id_fkey" TO "fa_collaborator_collaborator_id_fkey";

-- RenameForeignKey
ALTER TABLE "fa_collaborator" RENAME CONSTRAINT "fa_collaborators_fa_id_fkey" TO "fa_collaborator_fa_id_fkey";

-- RenameForeignKey
ALTER TABLE "fa_electricity_need" RENAME CONSTRAINT "fa_electricity_needs_fa_id_fkey" TO "fa_electricity_need_fa_id_fkey";

-- RenameForeignKey
ALTER TABLE "fa_feedback" RENAME CONSTRAINT "fa_comments_author_fkey" TO "fa_feedback_author_fkey";

-- RenameForeignKey
ALTER TABLE "fa_feedback" RENAME CONSTRAINT "fa_comments_fa_id_fkey" TO "fa_feedback_fa_id_fkey";

-- RenameForeignKey
ALTER TABLE "fa_signa_need" RENAME CONSTRAINT "fa_signa_needs_fa_id_fkey" TO "fa_signa_need_fa_id_fkey";

-- RenameForeignKey
ALTER TABLE "fa_time_window" RENAME CONSTRAINT "time_windows_fa_id_fkey" TO "fa_time_window_fa_id_fkey";

-- RenameForeignKey
ALTER TABLE "friend" RENAME CONSTRAINT "Friend_friend_id_fkey" TO "friend_friend_id_fkey";

-- RenameForeignKey
ALTER TABLE "friend" RENAME CONSTRAINT "Friend_requestor_id_fkey" TO "friend_requestor_id_fkey";

-- RenameForeignKey
ALTER TABLE "ft_time_window" RENAME CONSTRAINT "ft_time_windows_ft_id_fkey" TO "ft_time_window_ft_id_fkey";

-- RenameForeignKey
ALTER TABLE "team_permission" RENAME CONSTRAINT "Team_Permission_permission_name_fkey" TO "team_permission_permission_name_fkey";

-- RenameForeignKey
ALTER TABLE "team_permission" RENAME CONSTRAINT "Team_Permission_team_code_fkey" TO "team_permission_team_code_fkey";

-- RenameForeignKey
ALTER TABLE "transaction" RENAME CONSTRAINT "Transaction_from_fkey" TO "transaction_from_fkey";

-- RenameForeignKey
ALTER TABLE "transaction" RENAME CONSTRAINT "Transaction_to_fkey" TO "transaction_to_fkey";

-- RenameForeignKey
ALTER TABLE "user_team" RENAME CONSTRAINT "User_Team_team_id_fkey" TO "user_team_team_id_fkey";

-- RenameForeignKey
ALTER TABLE "user_team" RENAME CONSTRAINT "User_Team_user_id_fkey" TO "user_team_user_id_fkey";

-- RenameIndex
ALTER INDEX "Assignment_timespanId_assignee_id_key" RENAME TO "assignment_timespanId_assignee_id_key";

-- RenameIndex
ALTER INDEX "Catalog_Category_path_key" RENAME TO "catalog_category_path_key";

-- RenameIndex
ALTER INDEX "Catalog_Gear_is_ponctual_usage_idx" RENAME TO "catalog_gear_is_ponctual_usage_idx";

-- RenameIndex
ALTER INDEX "Catalog_Gear_slug_key" RENAME TO "catalog_gear_slug_key";

-- RenameIndex
ALTER INDEX "Configuration_key_key" RENAME TO "configuration_key_key";

-- RenameIndex
ALTER INDEX "ft_time_windows_end_idx" RENAME TO "ft_time_window_end_idx";

-- RenameIndex
ALTER INDEX "ft_time_windows_start_idx" RENAME TO "ft_time_window_start_idx";

-- RenameIndex
ALTER INDEX "Period_start_end_idx" RENAME TO "period_start_end_idx";

-- RenameIndex
ALTER INDEX "Permission_name_key" RENAME TO "permission_name_key";

-- RenameIndex
ALTER INDEX "Team_code_key" RENAME TO "team_code_key";

-- RenameIndex
ALTER INDEX "Team_name_key" RENAME TO "team_name_key";

-- RenameIndex
ALTER INDEX "User_email_key" RENAME TO "user_email_key";

-- RenameIndex
ALTER INDEX "User_reset_password_token_key" RENAME TO "user_reset_password_token_key";
