#!/usr/bin/env bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

case $1 in

"--dev"|"-d") echo "starting dev containers"
        case $2 in
        "--start"|"-s")
                MY_GID=$(id -g $USER) MY_UID=$(id -u $USER) docker-compose -f $SCRIPT_DIR/docker-compose-dev.yml -p dev --env-file $SCRIPT_DIR/dev.env up -d
                ;;
        "--down"|"-d")
                MY_GID=$(id -g $USER) MY_UID=$(id -u $USER) docker-compose -f $SCRIPT_DIR/docker-compose-dev.yml -p dev --env-file $SCRIPT_DIR/dev.env down
                ;;
        "--restart"|"-r")
                MY_GID=$(id -g $USER) MY_UID=$(id -u $USER) docker-compose -f $SCRIPT_DIR/docker-compose-dev.yml -p dev --env-file $SCRIPT_DIR/dev.env restart
                ;;
        "--logs"|"-l")
                MY_GID=$(id -g $USER) MY_UID=$(id -u $USER) docker-compose -f $SCRIPT_DIR/docker-compose-dev.yml -p dev --env-file $SCRIPT_DIR/dev.env logs -f
                ;;
        "-h"|"--help"|*)
                echo "Usage: ./compose.sh [--dev|-d] [--start|-s] [--down|-d] [--restart|-r] [--logs|-l]"
                echo "--dev|-d: start dev containers"
                echo "--start|-s: start dev containers"
                echo "--down|-d: stop dev containers"
                echo "--restart|-r: restart dev containers"
                echo "--logs|-l: show dev containers logs"
                ;;
        esac
         ;;

"--utils"|"-u") echo "starting utils containers"
           docker-compose -f $SCRIPT_DIR/docker-compose_utils.yml -p utils --env-file $SCRIPT_DIR/.env up -d
           ;;

"--prod"|"-p") echo "starting prod containers"
          docker-compose -f $SCRIPT_DIR/docker-compose.yml -p prod --env-file $SCRIPT_DIR/.env up -d
          ;;

"--preprod"|"-t") echo "starting preprod containers"
             docker-compose -f $SCRIPT_DIR/docker-compose-preprod.yml -p preprod --env-file $SCRIPT_DIR/.env up -d
             ;;

"--all"|"-a") echo "starting utils, prod and prepord containers"
         docker-compose -f $SCRIPT_DIR/docker-compose_utils.yml -p utils --env-file $SCRIPT_DIR/.env up -d
         docker-compose -f $SCRIPT_DIR/docker-compose.yml -p prod --env-file $SCRIPT_DIR/.env up -d
         docker-compose -f $SCRIPT_DIR/docker-compose-preprod.yml -p preprod --env-file $SCRIPT_DIR/.env up -d
         ;;

"-h"|"--help"|*) echo "USAGE"
echo "./compose.sh [option]"
echo "You should use one option :"
echo "--dev, -d [docker-compose' options]"
echo "\t Start all needed for development. You need dev.env and ./assets/traefik/tls.yml files to work"
echo "\t for more info about this option see ./compose.sh --dev --help"
echo "--utils, -u"
echo "\t Strat Traefik and Watchtower services"
echo "--pord, -p"
echo "\t Start production container (i.e. Backend, Frontend, MongoDB) with https://overbookd.${DOMAIN} url'. You need .env file to work"
echo "--preprod, -t"
echo "\t Start preprod container (i.e. Backend, Frontend, MongoDB) with https://preprod.overbookd.${DOMAIN} url'. You need .env file to work "
echo "--all, -a"
echo "\t Start all needed for production and pre-preprodution (i.e. Traefik, Watchtower, Backend, Frontend, MongoDB). You need .env file to work"
;;
esac