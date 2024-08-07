-- Delete data
DELETE FROM "assignment";
DELETE FROM "borrow";
DELETE FROM "break_period";
DELETE FROM "charisma_period";
DELETE FROM "contractor";
DELETE FROM "festival_activity";
DELETE FROM "festival_task";
DELETE FROM "notification"
DELETE FROM "purchase"
DELETE FROM "volunteer_availability"
DELETE FROM "charisma_event_participation";

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
