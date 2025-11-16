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

## Traefik

Nous utilisons Traefik comme reverse proxy pour gérer les certificats SSL et le routage des requêtes vers les différents services Docker.
Nous utilisons aussi le domaine `traefik.me` qui est géré par ce repo github : <https://github.com/pyrou/traefik.me> qui nous permet d'avoir des sous-domaines dynamiques en `*.traefik.me` pointant vers notre IP locale (127.0.0.1). Cependant pour que le HTTPS puisse fonctionner correctement, il est nécessaire d'avoir un certificat SSL valide pour le domaine `*.traefik.me`. Pour cela, nous utilisons une autorité de certification locale (CA) qui signe les certificats SSL pour les sous-domaines utilisés. Les certificats de cette CA sont stockés dans notre repo infra <https://gitlab.com/24-heures-insa/infra/-/tree/main/data/traefik/certs?ref_type=heads>.
Les certificats signés par cette CA sont ensuite ajoutés aux magasins de certificats de confiance des navigateurs et systèmes utilisés pour accéder aux services hébergés derrière Traefik.
Référe toi à la section suivante qui correspond à ton cas pour ajouter la CA aux certificats de confiance.

### Linux

```bash
sudo wget https://gitlab.com/24-heures-insa/infra/-/raw/main/data/traefik/certs/rootCA.pem -O /usr/local/share/ca-certificates/traefik.me-root-CA-local.crt
sudo update-ca-certificates
sudo apt update
sudo apt install -y libnss3-tools
certutil -d sql:$HOME/.pki/nssdb/ -A -t "C,," -n "traefik-local-ca" -i /usr/local/share/ca-certificates/traefik.me-root-CA-local.crt
```

### Windows

- Télécharger le certificat rootCA.pem depuis <https://gitlab.com/24-heures-insa/infra/-/raw/main/data/traefik/certs/rootCA.pem>
- Ouvrir le fichier téléchargé
- Cliquer sur "Installer le certificat..."
- Choisir "Ordinateur local"
- Ajouter le certificat dans le magasin "Autorités de certification racines de confiance"

Un tuto pour t'aider : <https://support.vertigis.com/hc/en-us/articles/11461054555410-Adding-a-self-signed-certificate-to-Trusted-Root-Certification-Authorities-Store>

### Firefox

Firefox utilise son propre magasin de certificats, il faut donc ajouter la CA manuellement dans Firefox.

- Télécharger le certificat rootCA.pem depuis <https://gitlab.com/24-heures-insa/infra/-/raw/main/data/traefik/certs/rootCA.pem>
- Ouvrir Firefox
- Aller dans les paramètres (about:preferences)
- Chercher "certificats" dans la barre de recherche des paramètres
- Cliquer sur "Afficher les certificats"
- Aller dans l'onglet "Autorités"
- Cliquer sur "Importer..."
- Sélectionner le fichier rootCA.pem téléchargé précédemment
- Cocher "Faire confiance à cette autorité pour identifier des sites web"
- Cliquer sur "OK"

Un tuto pour t'aider : <https://docs.redhat.com/fr/documentation/red_hat_enterprise_linux/7/html/system-level_authentication_guide/using_the_certificates_on_the_token_for_ssl_>

## Les liens utiles

### Avec le domaine traefik.me

- Le front : <https://overbookd.traefik.me>
- Le back : <https://overbookd.traefik.me/api>
- Swagger : <https://overbookd.traefik.me/api/swagger>
- Adminer : <https://overbookd.traefik.me/adminer/>, petit lien magique pour autofill <https://overbookd.traefik.me/adminer/?pgsql=overbookd_postgresql&username=overbookd&db=overbookd-local&ns=public>
