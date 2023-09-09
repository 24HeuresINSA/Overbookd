-- Delete data
DELETE FROM "assignment";
DELETE FROM "charisma_period";
DELETE FROM "collaborator";
DELETE FROM "fa_electricity_need";
DELETE FROM "fa_feedback";
DELETE FROM "fa_signa_need";
DELETE FROM "public_animation";
DELETE FROM "fa_time_window";
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

-- Change in table team maman in beboo
UPDATE "team" SET code = 'beboo' WHERE code = 'maman';
UPDATE "team" SET name = 'BeBoo' WHERE name = 'maman';

-- Add new team benevole
INSERT INTO "team" (code, name, color, icon) VALUES
('benevole', 'bénévole', '#09A1C4', 'mdi-account');

-- Set too false all has_payed_contributions to false for all user
UPDATE "user" SET has_payed_contributions = false;

-- Remove all user team except hard, vieux, admin, fen, voiture, camion, conducteur, conducteur-fen
DELETE FROM "user_team" WHERE
  team_code NOT IN
    (SELECT DISTINCT "team".code FROM "team"
    WHERE code IN ('hard', 'vieux', 'admin', 'fen', 'voiture', 'camion', 'conducteur', 'conducteur-fen'));

-- Remove hard team from user having hard and vieux
DELETE FROM "user_team" WHERE
  user_id IN
    (SELECT DISTINCT "user".id FROM "user"
    JOIN "user_team" ON "user".id = "user_team".user_id
    JOIN "team" ON "user_team".team_code = "team".code
    WHERE code = 'hard')
AND
  user_id IN
    (SELECT DISTINCT "user".id FROM "user"
    JOIN "user_team" ON "user".id = "user_team".user_id
    JOIN "team" ON "user_team".team_code = "team".code
    WHERE code = 'vieux')
AND
  team_code IN
    (SELECT DISTINCT "team".code FROM "team"
    WHERE code = 'hard');


-- Change user team hard to vieux
UPDATE "user_team" SET team_code =
  (SELECT DISTINCT "team".code FROM "team"
  WHERE code = 'vieux')
WHERE team_code IN
  (SELECT DISTINCT "team".code FROM "team"
  WHERE code = 'hard');

-- Add benevole team to vieux user
INSERT INTO "user_team" ("user_id", "team_code")
SELECT "user_id", 'benevole'
FROM "user_team"
WHERE "team_code" = 'vieux';
