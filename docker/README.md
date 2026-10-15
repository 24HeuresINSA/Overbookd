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

### Le fichier .env

Avant de lancer le projet, il faut avoir un fichier `.env` avec les bonnes valeurs. Pour ce faire 2 options sont possibles, récupérer le fichier `.env`depuis le vault OU le remplir à la main.

#### Avec le cli bitwarden

```bash
# Installation du cli bitwarden (compatibilité avec vaultwarden)
npm install -g @bitwarden/cli
# Configuration de l'insance à utiliser
bw config server https://vault.libreon.fr
# Connexion au vault, l'email et le mot de passe vont être demandés
export BW_SESSION="$(bw login --raw)"
# Recupérer le contenue de l'entrée du vault
bw get notes 50204af9-2eef-4417-8f72-e6043b6740dd > docker/.env
```

#### Avec le fichier d'exemple

Copier et modifier les valeurs du fichier `.env`

```bash
cp docker/.env.example docker/.env
```

### Utiliser Podman en développement

Les commandes `pnpm dev:*` utilisent le CLI `docker`. Avec Podman, installer sa couche de compatibilité Docker (par exemple `podman-docker`) ainsi que `podman-compose` pour conserver les mêmes commandes.

Sur Linux avec Podman rootless, activer le socket utilisateur :

```bash
systemctl --user enable --now podman.socket
```

Ajouter les paramètres suivants au fichier local `docker/.env` :

```dotenv
CONTAINER_SOCKET_PATH=/run/user/${MY_UID}/podman/podman.sock
PODMAN_COMPOSE_IN_POD=false
APP_USERNS_MODE=keep-id
```

Le mode `keep-id` est appliqué uniquement aux services `api` et `web`, qui doivent écrire dans le dépôt monté depuis l'hôte. Le regroupement en pod est désactivé pour que le namespace du pod ne remplace pas ce réglage. Ne pas définir `PODMAN_USERNS=keep-id` globalement : les autres services, notamment PostgreSQL, doivent conserver leur utilisateur de démarrage par défaut.

Avec Docker, laisser ces paramètres non définis pour conserver le comportement habituel. Après modification du mode utilisateur, recréer les conteneurs concernés pour appliquer le réglage.

#### Autoriser les ports 80 et 443 avec Podman rootless

Traefik publie les ports 80 et 443 pour conserver les mêmes URL qu'avec Docker. Sur Linux, si ces ports sont réservés aux processus privilégiés, autoriser leur utilisation sans privilèges :

```bash
sudo sysctl -w net.ipv4.ip_unprivileged_port_start=80
```

Pour conserver ce réglage après un redémarrage :

```bash
echo 'net.ipv4.ip_unprivileged_port_start=80' | sudo tee /etc/sysctl.d/90-rootless-container-ports.conf
sudo sysctl --system
```

Attention : ce réglage s'applique à tout le système, pas seulement à Podman. Il permet à tous les processus non privilégiés de réserver les ports disponibles à partir de 80, notamment les ports 80 à 1023 habituellement privilégiés. Les ports inférieurs à 80 restent privilégiés. Ce réglage n'est pas nécessaire avec Docker rootful et n'est pas appliqué automatiquement par les scripts du projet.

Selon la configuration SELinux, l'accès aux montages peut également nécessiter une configuration locale.

### Le fichier `assets/traefik/tls.yml`

Contient les certificats TLS pour le dev. Il est fourni dans se repo.
Sans lui, le domaine `24h.localhost` ne sera pas de confiance.
Les certificats sont automatiquement téléchargés avec le container `certs-downloader:` et sont stockés dans le volume `certs` au chemin `/etc/ssl/traefik`.

### Les données PostgreSQL

Les données de la base de données sont stockées dans le volume nommé `postgresql-data`, géré par Docker ou Podman. Chaque moteur utilise son propre volume, ce qui évite les conflits de permissions entre Docker et Podman rootless.

Le volume est conservé lors d'un `pnpm dev:down`. Attention : `docker compose down --volumes` (ou son équivalent Podman, avec les mêmes options de projet) supprime les volumes du projet, dont les données PostgreSQL.

L'ancien dossier `docker/data/dev/postgresql` n'est plus utilisé. Ses données ne sont pas migrées automatiquement : après ce changement, lancer `pnpm db:reset` pour appliquer les migrations et initialiser les données de développement. Cette commande réinitialise la base de données.

## Les docker-compose de prod, preprod et cetaitmieuxavant

Tous les docker-compose de prod, preprod et cetaitmieuxavant sont dans le [repo  `infra` du group](https://gitlab.com/24-heures-insa/infra). C'est le repo qui est utilisé pour gérer l'infrastucture des applications des 24h de l'INSA.

## Traefik

Nous utilisons Traefik comme reverse proxy pour gérer les certificats SSL et le routage des requêtes vers les différents services Docker.

Nous utilisons aussi les domaines en `*.24h.localhost` pointant vers notre IP locale (127.0.0.1). Cependant pour que le HTTPS puisse fonctionner correctement, il est nécessaire d'avoir un certificat SSL valide pour le domaine `*.24h.localhost`. Pour cela, nous utilisons une autorité de certification locale (CA) qui signe les certificats SSL pour les sous-domaines utilisés. Les certificats de cette CA sont stockés dans notre repo infra <https://gitlab.com/24-heures-insa/infra/-/tree/main/data/traefik/certs?ref_type=heads>.
Les certificats signés par cette CA sont ensuite ajoutés aux magasins de certificats de confiance des navigateurs et systèmes utilisés pour accéder aux services hébergés derrière Traefik.
Référe toi à la section suivante qui correspond à ton cas pour ajouter la CA aux certificats de confiance.

### Linux

```bash
sudo wget https://gitlab.com/24-heures-insa/infra/-/raw/main/data/traefik/certs/rootCA.pem -O /usr/local/share/ca-certificates/24h.localhost-root-CA-local.crt
sudo update-ca-certificates
sudo apt update
sudo apt install -y libnss3-tools
certutil -d sql:$HOME/.pki/nssdb/ -A -t "C,," -n "traefik-local-ca" -i /usr/local/share/ca-certificates/24h.localhost-root-CA-local.crt
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

### Avec le domaine 24h.localhost

- Le front : <https://overbookd.24h.localhost>
- Le back : <https://overbookd.24h.localhost/api>
- Swagger : <https://overbookd.24h.localhost/api/swagger>
- Adminer : <https://overbookd.24h.localhost/adminer/>, petit lien magique pour autofill <https://overbookd.24h.localhost/adminer/?pgsql=overbookd-postgresql&username=overbookd&db=overbookd-local&ns=public>
