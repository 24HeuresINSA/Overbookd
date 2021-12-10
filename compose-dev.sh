#/bin/bash

case $1 in

"--dev") echo "starting dev containers"
         docker-compose -f docker-compose-dev.yml -p dev --env-file docker/dev.env "${@:}"
         ;;

"--utils") echo "starting utils containers"
           docker-compose -f docker-compose_utils.yml -p utils up -d
           ;;

"--prod") echo "starting prod containers"
          docker-compose -f docker-compose.yml -p prod up -d
          ;;

"--preprod") echo "starting prod containers"
             docker-compose -f docker-compose-preprod.yml up -d
             ;;

"--all") echo "starting utils, prod and prepord containers"
         docker-compose -f docker-compose_utils.yml -p utils up -d
         docker-compose -f docker-compose.yml -p prod up -d
         docker-compose -f docker-compose-preprod.yml up -d
         ;;

*) echo "no command"
;;
esac