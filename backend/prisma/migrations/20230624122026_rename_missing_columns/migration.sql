-- RenameColumn
ALTER TABLE "ft_team_request" RENAME COLUMN "time_windows_id" TO "ft_time_window_id";
-- RenameForeignKey
ALTER TABLE "ft_team_request" RENAME CONSTRAINT "ft_team_request_time_windows_id_fkey" TO "ft_team_request_ft_time_window_id_fkey";
-- RenameIndex
ALTER INDEX "ft_team_request_time_windows_id_team_code_key" RENAME TO "ft_team_request_ft_time_window_id_team_code_key";

-- RenameColumn
ALTER TABLE "ft_user_request" RENAME COLUMN "ft_time_windows_id" TO "ft_time_window_id";
-- RenameForeignKey
ALTER TABLE "ft_user_request" RENAME CONSTRAINT "ft_user_request_ft_time_windows_id_fkey" TO "ft_user_request_ft_time_window_id_fkey";
-- RenameIndex
ALTER INDEX "ft_user_request_ft_time_windows_id_user_id_key" RENAME TO "ft_user_request_ft_time_window_id_user_id_key";
