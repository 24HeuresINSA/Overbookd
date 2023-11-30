-- DropForeignKey
ALTER TABLE "FestivalActivity" DROP CONSTRAINT "FestivalActivity_adherent_id_fkey";

-- DropForeignKey
ALTER TABLE "FestivalActivity" DROP CONSTRAINT "FestivalActivity_location_id_fkey";

-- DropForeignKey
ALTER TABLE "FestivalActivity" DROP CONSTRAINT "FestivalActivity_team_code_fkey";

-- DropForeignKey
ALTER TABLE "contractor" DROP CONSTRAINT "contractor_fa_id_fkey";

-- DropForeignKey
ALTER TABLE "festival_activity_electricity_supply" DROP CONSTRAINT "festival_activity_electricity_supply_festival_supply_id_fkey";

-- DropForeignKey
ALTER TABLE "festival_activity_review" DROP CONSTRAINT "festival_activity_review_fa_id_fkey";

-- DropForeignKey
ALTER TABLE "festival_activity_signage" DROP CONSTRAINT "festival_activity_signage_fa_id_fkey";

-- DropForeignKey
ALTER TABLE "festival_activity_time_window_general" DROP CONSTRAINT "festival_activity_time_window_general_fa_id_fkey";

-- DropForeignKey
ALTER TABLE "festival_activity_time_window_inquiry" DROP CONSTRAINT "festival_activity_time_window_inquiry_fa_id_fkey";

-- DropForeignKey
ALTER TABLE "inquiry_request" DROP CONSTRAINT "inquiry_request_fa_id_fkey";

-- DropTable
ALTER TABLE "FestivalActivity" RENAME TO "festival_activity";

-- CreateIndex
CREATE UNIQUE INDEX "festival_activity_id_key" ON "festival_activity"("id");

-- AddForeignKey
ALTER TABLE "festival_activity" ADD CONSTRAINT "festival_activity_team_code_fkey" FOREIGN KEY ("team_code") REFERENCES "team"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_activity" ADD CONSTRAINT "festival_activity_adherent_id_fkey" FOREIGN KEY ("adherent_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_activity" ADD CONSTRAINT "festival_activity_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "signa_location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_activity_time_window_general" ADD CONSTRAINT "festival_activity_time_window_general_fa_id_fkey" FOREIGN KEY ("fa_id") REFERENCES "festival_activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_activity_time_window_inquiry" ADD CONSTRAINT "festival_activity_time_window_inquiry_fa_id_fkey" FOREIGN KEY ("fa_id") REFERENCES "festival_activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contractor" ADD CONSTRAINT "contractor_fa_id_fkey" FOREIGN KEY ("fa_id") REFERENCES "festival_activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_activity_signage" ADD CONSTRAINT "festival_activity_signage_fa_id_fkey" FOREIGN KEY ("fa_id") REFERENCES "festival_activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_activity_electricity_supply" ADD CONSTRAINT "festival_activity_electricity_supply_festival_supply_id_fkey" FOREIGN KEY ("festival_supply_id") REFERENCES "festival_activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiry_request" ADD CONSTRAINT "inquiry_request_fa_id_fkey" FOREIGN KEY ("fa_id") REFERENCES "festival_activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_activity_review" ADD CONSTRAINT "festival_activity_review_fa_id_fkey" FOREIGN KEY ("fa_id") REFERENCES "festival_activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
