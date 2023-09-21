# Docker pour Overbookd

Ce dossier contient les fichiers nécessaires pour lancer overbookd pour le dev avec Docker.

## Les alias de commande sont dans le package.json root

Avec `pnpm`, tu peux lancer les containers Docker pour le dev. Il se base sur les scripts du fichier `package.json` à la racine du projet.

```bash
pnpm dev:init : setup traefik network and init dev containers
pnpm dev:start : start dev containers
pnpm dev:stop : stop dev containers
pnpm dev:restart : restart dev containers
pnpm dev:down : stop dev containers
pnpm dev:logs : show dev containers logs
pnpm dev:build : build dev containers
pnpm db:exec '[prisma command]': run prisma command in api container. Example: npm run db:exec 'prisma generate'
pnpm dev:bash : run interactive bash terminal in onetime node container. To install dependancies for example. Overbookd folder is mounted in /overbookd
pnpm prerelease : update version as realese-candidate (rc) of api and web
```

## Les fichiers nécessaires

### Le fichier `.env`

Contient toutes les variables d'environnement nécessaires pour le dev. Il est fourni dans se repo.

### Le fichier `assets/traefik/tls.yml`

Contient les certificats TLS pour le dev. Il est fourni dans se repo.
Sans lui, le domaine `traefik.me` ne sera pas de confiance.
Les certificats sont automatiquement téléchargés avec le container `certs-downloader:` et sont stockés dans le volume `certs` au chemin `/etc/ssl/traefik`.

### Le dossier `data`

Contient les données de la base de données et les photos de profils. La structure est la suivantes :

```txt
data\
    postgresql\
        (all postgresql data)
    images\
        (all profile pictures)
```

## Les docker-compose de prod, preprod et cetaitmieuxavant

Tous les docker-compose de prod, preprod et cetaitmieuxavant sont dans le [repo  `infra` du group](https://gitlab.com/24-heures-insa/infra). C'est le repo qui est utilisé pour gérer l'infrastucture des applications des 24h de l'INSA.

## Les liens utiles

### Avec le domaine traefik.me

- Le front : <https://overbookd.traefik.me>
- Le back : <https://overbookd.traefik.me/api>
- Swagger : <https://overbookd.traefik.me/api/swagger>
- Adminer : <https://overbookd.traefik.me/adminer/>, petit lien magique pour autofill <https://overbookd.traefik.me/adminer/?pgsql=overbookd_postgresql&username=overbookd&db=overbookd-local&ns=public>
