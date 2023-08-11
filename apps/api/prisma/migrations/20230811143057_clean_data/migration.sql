-- DropForeignKey
ALTER TABLE "user_team" DROP CONSTRAINT "user_team_user_id_fkey";

-- AddForeignKey
ALTER TABLE "user_team" ADD CONSTRAINT "user_team_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Delete data
DELETE FROM "assignment";
DELETE FROM "charisma_period";
DELETE FROM "collaborator";
DELETE FROM "fa_electricity_need";
DELETE FROM "fa_feedback";
DELETE FROM "fa_refuse";
DELETE FROM "fa_signa_need";
DELETE FROM "fa_site_publish_animation";
DELETE FROM "fa_time_window";
DELETE FROM "fa_validation";
DELETE FROM "fa";
DELETE FROM "friend";
DELETE FROM "ft_feedback";
DELETE FROM "ft_review";
DELETE FROM "ft_team_request";
DELETE FROM "ft_time_span";
DELETE FROM "ft_time_window";
DELETE FROM "ft_user_request";
DELETE FROM "ft";
DELETE FROM "gear_request";
DELETE FROM "inventory_record";
DELETE FROM "period";
DELETE FROM "volunteer_availability";

-- Delete all soft users without vieux users
DELETE FROM "user" WHERE
  id IN
    (SELECT DISTINCT "user".id FROM "user"
    JOIN "user_team" ON "user".id = "user_team".user_id
    JOIN "team" ON "user_team".team_id = "team".id
    WHERE code = 'soft')
AND
  id NOT IN
    (SELECT DISTINCT "user".id from "user"
    JOIN "user_team" ON "user".id = "user_team".user_id
    JOIN "team" ON "user_team".team_id = "team".id
    WHERE code = 'vieux');

-- Change in table team maman in beboo
UPDATE "team" SET code = 'beboo' WHERE code = 'maman';
UPDATE "team" SET name = 'BeBoo' WHERE name = 'maman';

-- Remove all user team except hard, vieux, admin, fen, voiture, camion, conducteur, conducteur-fen
DELETE FROM "user_team" WHERE
  team_id NOT IN
    (SELECT DISTINCT "team".id FROM "team"
    WHERE code IN ('hard', 'vieux', 'admin', 'fen', 'voiture', 'camion', 'conducteur', 'conducteur-fen'));

-- Remove hard team from user having hard and vieux
DELETE FROM "user_team" WHERE
  user_id IN
    (SELECT DISTINCT "user".id FROM "user"
    JOIN "user_team" ON "user".id = "user_team".user_id
    JOIN "team" ON "user_team".team_id = "team".id
    WHERE code = 'hard')
AND
  user_id IN
    (SELECT DISTINCT "user".id FROM "user"
    JOIN "user_team" ON "user".id = "user_team".user_id
    JOIN "team" ON "user_team".team_id = "team".id
    WHERE code = 'vieux')
AND
  team_id IN
    (SELECT DISTINCT "team".id FROM "team"
    WHERE code = 'hard');


-- Change user team hard to vieux
UPDATE "user_team" SET team_id =
  (SELECT DISTINCT "team".id FROM "team"
  WHERE code = 'vieux')
WHERE team_id IN
  (SELECT DISTINCT "team".id FROM "team"
  WHERE code = 'hard');
