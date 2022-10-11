# Docker pour Overbookd

Ce dossier contient les fichiers nécessaires pour lancer overbookd pour le dev avec Docker.

## Le script `compose.sh`

Le script `compose.sh` permet de lancer les containers Docker pour le dev. Il se base sur des options que voici (elles sont toujours affichable avec `./compose.sh --help` ou `./compose.sh -h`):

```bash
./compose.sh [option]
You should use one option :
--dev, -d [docker-compose' options]
    Start all needed for development. You need dev.env and ./assets/traefik/tls.yml files to work
    for more info about this option see ./compose.sh --dev --help
--traefik
    Create traefik network
--help, -h
    Show this help

====================
=Containers for dev=
====================
Usage: ./compose.sh [--dev|-d] [--start|-s] [--down|-d] [--restart|-r] [--logs|-l]
--dev|-d: start dev containers
--start|-s: start dev containers
--down|-d: stop dev containers
--restart|-r: restart dev containers
--logs|-l: show dev containers logs
--prisma|-p: run prisma command in backend container. Example: ./compose.sh --dev --prisma 'npx prisma migrate dev'
--bash|-b: run interactive bash terminal in onetime node container. To install dependancies for example. Overbookd folder is mounted in /app
```

## Les fichiers nécessaires

### Le fichier `dev.env`

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

<<<<<<< HEAD
Tous les docker-compose de prod, preprod et cetaitmieuxavant sont dans le [repo  `infra` du group](https://gitlab.com/24-heures-insa/infra). C'est le repo qui est utilisé pour gérer l'infrastucture des applications des 24h de l'INSA.
=======
Tout les docker-compose de prod, preprod et cetaitmieuxavant sont dans le [repo  `infra` du group](https://gitlab.com/24-heures-insa/infra). C'est le repo qui est utilisé pour gérer l'infrastucture des applications des 24h de l'INSA.
>>>>>>> ff557da (feat(Docker): :memo: add links in readme)

## Les liens utiles

### Avec le domaine traefik.me

- Le front : <https://overbookd.traefik.me>
- Le back : <https://overbookd.traefik.me/api>
- Swagger : <https://overbookd.traefik.me/api/swagger>
- Adminer : <https://overbookd.traefik.me/adminer/>, petit lien magique pour autofill <https://overbookd.traefik.me/adminer/?pgsql=overbookd_postgresql&username=overbookd&db=overbookd-48e&ns=public>

#### Avec localhost

- Le front : <http://localhost:3000>
- Le back : <http://localhost:2424>
- Swagger : <http://localhost:2424/swagger>
<<<<<<< HEAD
- Adminer : <http://localhost:8080>, petit lien magique pour autofill <http://localhost:8080/?pgsql=overbookd_postgresql&username=overbookd&db=overbookd-48e&ns=public>
=======
- Adminer : <http://localhost:8080>, petit lien magique pour autofill <http://localhost:8080/?pgsql=overbookd_postgresql&username=overbookd&db=overbookd-48e&ns=public>
>>>>>>> ff557da (feat(Docker): :memo: add links in readme)
