# Docker pour Overbookd

Ce dossier contient les fichiers nécessaires pour lancer overbookd pour le dev avec Docker (ou Podman pour les plus aventureux/libristes).

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

Avant de lancer le projet, il faut avoir un fichier `.env` avec les bonnes valeurs. Pour ce faire 2 options sont possibles, récupérer le fichier `.env` depuis le vault OU le remplir à la main.

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

### Le fichier `assets/traefik/tls.yml`

Contient les certificats TLS pour le dev. Il est fourni dans se repo.
Sans lui, le domaine `24h.localhost` ne sera pas de confiance.
Les certificats sont automatiquement téléchargés avec le container `certs-downloader:` et sont stockés dans le volume `certs` au chemin `/etc/ssl/traefik`.

### Le dossier `data`

Contient les données de la base de données PostgreSQL. La structure est la suivante :

```txt
data\
    dev\
        postgresql\
            (all postgresql data)
```

> Au passage d'un moteur de conteneurs à l'autre, des conflits dans la gestion de l'appartenance (UID/GID) des données entre Docker et Podman apparaissent. Le plus simple pour régler le problème est de supprimer le répertoire `docker/data/dev/postgresql` pour qu'il soit recréé par le moteur nouvellement utilisé. Ça implique un reset de la DB cependant.

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

## Utiliser Podman en développement

Les commandes `pnpm dev:*` utilisent la CLI `docker`. Pour utiliser Podman à la place, il faut installer sa couche de compatibilité Docker et Docker Compose. (par exemple `podman`, `podman-docker` et `podman-compose` sous Fedora)

Une fois installé, il faut activer le socket utilisateur. Sur une distribution Linux/systemd avec Podman rootless :

```bash
systemctl --user enable --now podman.socket
```

Ajouter les variables suivantes au fichier local `docker/.env` :

- `CONTAINER_SOCKET_PATH=/run/user/${MY_UID}/podman/podman.sock` : pour pointer compose vers le socket Podman rootless (différent du chemin par défaut Docker)

- `PODMAN_COMPOSE_IN_POD=false` : désactive le regroupement en pod de `podman-compose`, pour que `keep-id` s'applique correctement sans que le namespace du pod ne remplace ce réglage

- `APP_USERNS_MODE=keep-id` : applique le paramètre `keep-id` aux conteneurs `api` et `web`, afin de conserver le même UID entre host et guest

> Ne pas définir `PODMAN_USERNS=keep-id` globalement : les autres services, notamment PostgreSQL, doivent conserver leur utilisateur de démarrage par défaut.

Avec Docker, laisser ces paramètres non définis pour conserver le comportement habituel. Au passage de l'un à l'autre, il faudra recréer les conteneurs concernés.

### Autoriser les ports 80 et 443 avec Podman rootless

Traefik publie les ports 80 et 443 pour conserver éviter de devoir préciser les ports de dev dans les URL. Toutefois, Linux réserve ces ports aux processus privilégiés par défaut, ce qui entre en conflit avec la nature rootless de Podman. 

Pour changer le réglage ponctuellement :

```bash
sudo sysctl -w net.ipv4.ip_unprivileged_port_start=80
```

Pour conserver ce réglage après un redémarrage :

```bash
echo 'net.ipv4.ip_unprivileged_port_start=80' | sudo tee /etc/sysctl.d/90-rootless-container-ports.conf
sudo sysctl --system
```

Attention : ce réglage s'applique à tout le système, pas seulement à Podman. Il permet à tous les processus non privilégiés de réserver les ports disponibles de 80 à 1023, qui sont habituellement privilégiés. Ce réglage n'est pas nécessaire avec Docker rootful et n'est pas appliqué automatiquement par les scripts du projet.

### SELinux (pour Fedora, entre autres)

La configuration actuelle des conteneurs respecte les principes de fonctionnement de SELinux. (points de montage avec l'option `:z`)

> Testé sur ma machine (Fedora 44 ARM64). Si ça ne fonctionne pas chez vous, faites signe !

## Les liens utiles

### Avec le domaine 24h.localhost

- Le front : <https://overbookd.24h.localhost>
- Le back : <https://overbookd.24h.localhost/api>
- Swagger : <https://overbookd.24h.localhost/api/swagger>
- Adminer : <https://overbookd.24h.localhost/adminer/>, petit lien magique pour autofill <https://overbookd.24h.localhost/adminer/?pgsql=overbookd-postgresql&username=overbookd&db=overbookd-local&ns=public>
