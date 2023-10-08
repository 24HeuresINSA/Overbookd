These scripts are made for the Team update.
The purpose of this update is to replace a team with the name id by a team with int id.

The setTeamTable script will set the new team attributes (icon and colours).
The teams are already present with a valid ID.

The script setUserTeamTable will fill the User_Team table because the migration will truncate it.
To do this, we retrieve all current OB users with their teams before the migration (endpoint /user).
We store it in the users.json file. We also copy the admin bearer before the migration.
(As the migration will empty the User_Team table. Nobody will be admin anymore. But with an admin bearer retrieved before the migration, which is valid for 24 hours. We can do the update).
