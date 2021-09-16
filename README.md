# OverBookd Frontend

Overbookd is an ERM software specificly developed within the team to supply management needs of the association in the daily life.

This webApp is made to work with this [backend](https://gitlab.com/24-heures-insa/overbookd/backend)

## QuickStart

<!--
Comment on lance cette foutue instance
Ca a quelquechose a voir avec docker-compose
.env d'exemple ?
docker-compose up
-->

### Env vars

To locally deploy the app, make sure you've correctly set up the env vars in the .env file. There is a .env.sample in the repo.
Then use `docker-compose up` to deploy the app.

## Gitflow

There is 3 main branches in this repo

 - master: Hosting production deployment
 - pre-prod: Hosting pre-production deployment
 - develop: Hosting under development version of Overbookd

When contributing to the codebase you have to:
 - Open an issue
 - Branch from develop with the issue ID in the name (ex: 24-fix-random-bugs)
 - Create a merge request from this branch to develop
This leverage consistency and relaibility through the whole process.

## Known bugs

 - No one of course :sweat: