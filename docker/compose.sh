#!/usr/bin/env bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

echo "================================"
echo "= Overbookd containers for dev ="
echo "================================"

case $1 in

        "--start"|"-s")
                echo "Starting dev containers"
                echo "-----------------------"
                MY_GID=$(id -g $USER) MY_UID=$(id -u $USER) docker compose -f $SCRIPT_DIR/docker-compose.yml -p dev --env-file $SCRIPT_DIR/dev.env up -d
                ;;
        "--stop")
                echo "Stopping dev containers"
                echo "-----------------------"
                docker compose -f $SCRIPT_DIR/docker-compose.yml -p dev --env-file $SCRIPT_DIR/dev.env stop
                ;;
        "--down"|"-d")
                echo "Stopping and removing dev containers"
                echo "------------------------------------"
                MY_GID=$(id -g $USER) MY_UID=$(id -u $USER) docker compose -f $SCRIPT_DIR/docker-compose.yml -p dev --env-file $SCRIPT_DIR/dev.env down
                ;;
        "--restart"|"-r")
                echo "Restarting dev containers"
                echo "-------------------------"
                MY_GID=$(id -g $USER) MY_UID=$(id -u $USER) docker compose -f $SCRIPT_DIR/docker-compose.yml -p dev --env-file $SCRIPT_DIR/dev.env restart
                ;;
        "--logs"|"-l")
                echo "Showing dev containers logs"
                echo "---------------------------"
                MY_GID=$(id -g $USER) MY_UID=$(id -u $USER) docker compose -f $SCRIPT_DIR/docker-compose.yml -p dev --env-file $SCRIPT_DIR/dev.env logs --tail 100 -f
                ;;
        "--build")
                echo "Building dev containers"
                echo "-----------------------"
                MY_GID=$(id -g $USER) MY_UID=$(id -u $USER) docker compose -f $SCRIPT_DIR/docker-compose.yml -p dev --env-file $SCRIPT_DIR/dev.env up -d --build
                ;;
        "--prisma"|"-p")
                echo "Prisma command dev containers"
                echo "-----------------------------"
                MY_GID=$(id -g $USER) MY_UID=$(id -u $USER) docker compose -f $SCRIPT_DIR/docker-compose.yml -p dev --env-file $SCRIPT_DIR/dev.env exec backend $2
                ;;
        "--bash")
                echo "Bash command dev containers"
                echo "---------------------------"
                docker run --rm -it --user $(id -g $USER):$(id -u $USER) -v $SCRIPT_DIR/..:/app node:16-alpine sh
                ;;

        "--updateVersion" | "-uv")
                echo "Bash update version dev containers"
                echo "----------------------------------"
                docker run --rm -it --user $(id -g $USER):$(id -u $USER) -v $SCRIPT_DIR/..:/app node:16-alpine sh -c "(cd /app/backend && npm version prerelease --preid=rc) && ( cd /app/frontend && npm version prerelease --preid=rc)"
                ;;

        "--traefik"|"-t") 
                echo "create traefik network"
                echo "----------------------"
                docker network create traefik-public
                ;;

        "-h"|"--help"|*) 
                echo "Usage: ./compose.sh [option]"
                echo "--traefik|-t : Create traefik network"
                echo "--start|-s: start dev containers"
                echo "--stop: stop dev containers"
                echo "--restart|-r: restart dev containers"
                echo "--down|-d: stop dev containers"
                echo "--logs|-l: show dev containers logs"
                echo "--build|-b: build dev containers"
                echo "--prisma|-p: run prisma command in backend container. Example: ./compose.sh --prisma 'npx prisma migrate dev'"
                echo "--bash|-b: run interactive bash terminal in onetime node container. To install dependancies for example. Overbookd folder is mounted in /app"
                echo "--updateVersion|-uv: update version as realese-candidate (rc) of backend and frontend"
                ;;
esac