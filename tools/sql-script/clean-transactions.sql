-- remove all transactions
DELETE FROM "transaction";

-- create a transaction if the amount of the user balance is higher than 0
INSERT INTO "transaction" ("to", amount, context, "type")
SELECT "user".id, "user".balance, 'Initialisation du CP', 'INITIALIZATION'
FROM "user"
WHERE "user".balance > 0;

-- create a transaction if the amount of the user balance is lower than 0 and convert it to positive
INSERT INTO "transaction" ("from", amount, context, "type")
SELECT "user".id, "user".balance * -1, 'Initialisation du CP', 'INITIALIZATION'
FROM "user"
WHERE "user".balance < 0;
