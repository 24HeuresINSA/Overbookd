UPDATE fa_electricity_need
SET device = '_', count = 1
WHERE device IS NULL OR count IS NULL;

-- Then, add the non-null constraints on the 'device' and 'count' columns
ALTER TABLE fa_electricity_need
ALTER COLUMN device SET NOT NULL,
ALTER COLUMN count SET NOT NULL,
ALTER COLUMN power SET DEFAULT 1,
ALTER COLUMN count SET DEFAULT 1;