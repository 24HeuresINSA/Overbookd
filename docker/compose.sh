#!/usr/bin/env bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

case $1 in

"--dev"|"-d")
        echo "===================="
        echo "=Containers for dev="
        echo "===================="
        case $2 in
        "--start"|"-s")
                echo "Starting dev containers"
                echo "-----------------------"
                MY_GID=$(id -g $USER) MY_UID=$(id -u $USER) docker compose -f $SCRIPT_DIR/docker-compose-dev.yml -p dev --env-file $SCRIPT_DIR/dev.env up -d
                ;;
        "--stop")
                echo "Stopping dev containers"
                echo "-----------------------"
                docker compose -f $SCRIPT_DIR/docker-compose-dev.yml -p dev --env-file $SCRIPT_DIR/dev.env stop
                ;;
        "--down"|"-d")
                echo "Stopping and removing dev containers"
                echo "------------------------------------"
                MY_GID=$(id -g $USER) MY_UID=$(id -u $USER) docker compose -f $SCRIPT_DIR/docker-compose-dev.yml -p dev --env-file $SCRIPT_DIR/dev.env down
                ;;
        "--restart"|"-r")
                echo "Restarting dev containers"
                echo "-------------------------"
                MY_GID=$(id -g $USER) MY_UID=$(id -u $USER) docker compose -f $SCRIPT_DIR/docker-compose-dev.yml -p dev --env-file $SCRIPT_DIR/dev.env restart
                ;;
        "--logs"|"-l")
                echo "Showing dev containers logs"
                echo "---------------------------"
                MY_GID=$(id -g $USER) MY_UID=$(id -u $USER) docker compose -f $SCRIPT_DIR/docker-compose-dev.yml -p dev --env-file $SCRIPT_DIR/dev.env logs --tail 100 -f
                ;;
        "--build"|"-b")
                echo "Building dev containers"
                echo "-----------------------"
                MY_GID=$(id -g $USER) MY_UID=$(id -u $USER) docker compose -f $SCRIPT_DIR/docker-compose-dev.yml -p dev --env-file $SCRIPT_DIR/dev.env up -d --build
                ;;
        "--prisma"|"-p")
                echo "Prisma command dev containers"
                echo "-----------------------------"
                MY_GID=$(id -g $USER) MY_UID=$(id -u $USER) docker compose -f $SCRIPT_DIR/docker-compose-dev.yml -p dev --env-file $SCRIPT_DIR/dev.env exec backend $3
                ;;
        "--bash"|"-b")
                echo "Bash command dev containers"
                echo "---------------------------"
                docker run --rm -it --user $(id -g $USER):$(id -u $USER) -v $SCRIPT_DIR/..:/app node:16.14-alpine3.15 sh
                ;;
        "-h"|"--help"|*)
                echo "Usage: ./compose.sh [--dev|-d] [--start|-s] [--down|-d] [--restart|-r] [--logs|-l]"
                echo "--dev|-d: start dev containers"
                echo "--start|-s: start dev containers"
                echo "--down|-d: stop dev containers"
                echo "--restart|-r: restart dev containers"
                echo "--logs|-l: show dev containers logs"
                echo "--prisma|-p: run prisma command in backend container. Example: ./compose.sh --dev --prisma 'npx prisma migrate dev'"
                echo "--bash|-b: run interactive bash terminal in onetime node container. To install dependancies for example. Overbookd folder is mounted in /app"
                ;;
        esac
         ;;

"--traefik") echo "create traefik network"
        docker network create traefik-public
        ;;

"-h"|"--help"|*) echo "USAGE"
echo "./compose.sh [option]"
echo "You should use one option :"
echo "--dev, -d [docker-compose' options]"
echo "    Start all needed for development. You need dev.env and ./assets/traefik/tls.yml files to work"
echo "    for more info about this option see ./compose.sh --dev --help"
echo "--traefik"
echo "    Create traefik network"
echo "--help, -h"
echo "    Show this help"
;;
esac