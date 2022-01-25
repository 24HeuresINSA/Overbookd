#/bin/bash

case $1 in

"--dev"|"-d") echo "starting dev containers"
         docker-compose -f docker-compose-dev.yml -p dev --env-file docker/dev.env "${@:}"
         ;;

"--utils"|"-u") echo "starting utils containers"
           docker-compose -f docker-compose_utils.yml -p utils up -d
           ;;

"--prod"|"-p") echo "starting prod containers"
          docker-compose -f docker-compose.yml -p prod up -d
          ;;

"--preprod"|"-t") echo "starting preprod containers"
             docker-compose -f docker-compose-preprod.yml up -d
             ;;

"--all"|"-a") echo "starting utils, prod and prepord containers"
         docker-compose -f docker-compose_utils.yml -p utils up -d
         docker-compose -f docker-compose.yml -p prod up -d
         docker-compose -f docker-compose-preprod.yml up -d
         ;;

*) echo "USAGE"
echo "./compose.sh [option]"
echo "You should use one option :"
echo "--dev, -d [docker-compose' options]"
echo "\t Start all needed for development. You need dev.env and ./assets/traefik/tls.yml files to work"
echo "\t You can add additional docker-compose options here (e.g. --build, --detach, --force-recreate. More information here https://docs.docker.com/compose/reference/up/)"
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