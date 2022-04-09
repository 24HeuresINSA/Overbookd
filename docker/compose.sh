#/bin/bash

dev() {
    SCRIPT_PATH=$(cd $(dirname $0); pwd)
    case $1 in
        "start")
            docker-compose -f "$SCRIPT_PATH"/docker-compose-dev.yml -p dev --env-file "$SCRIPT_PATH"/dev.env up -d
            ;;
        "down")
            docker-compose -f "$SCRIPT_PATH"/docker-compose-dev.yml -p dev --env-file "$SCRIPT_PATH"/dev.env down
            ;;
        "restart")
            docker-compose -f "$SCRIPT_PATH"/docker-compose-dev.yml -p dev --env-file "$SCRIPT_PATH"/dev.env restart
            ;;
        "logs")
            docker-compose -f "$SCRIPT_PATH"/docker-compose-dev.yml -p dev --env-file "$SCRIPT_PATH"/dev.env logs
            ;;
        "up-build")
            docker-compose -f "$SCRIPT_PATH"/docker-compose-dev.yml -p dev --env-file "$SCRIPT_PATH"/dev.env up -d --build
            ;;
        *)
            echo "Usage: $0 {start|down|restart|logs|up-build}"
            exit 1
            ;;
    esac
}


case $1 in
    "--utils"|"-u") 
        echo "starting utils containers"
        docker-compose -f docker-compose_utils.yml -p utils up -d
        ;;

    "--prod"|"-p") 
        echo "starting prod containers"
        docker-compose -f docker-compose.yml -p prod up -d
        ;;

    "--preprod"|"-t") 
        echo "starting preprod containers"
        docker-compose -f docker-compose-preprod.yml up -d
        ;;

    "--all"|"-a") 
        echo "starting utils, prod and prepord containers"
        docker-compose -f docker-compose_utils.yml -p utils up -d
        docker-compose -f docker-compose.yml -p prod up -d
        docker-compose -f docker-compose-preprod.yml up -d
        ;;

    "--help"|"-h")
        echo "USAGE"
        echo "./compose.sh [option]"
        echo "By default, dev containers will be started"
        echo "You should use one option :"
        echo "start|down|restart|logs|up-build"
        echo "\t Start all needed for development. You need dev.env and ./assets/traefik/tls.yml files to work"
        echo "--utils, -u"
        echo "\t Strat Traefik and Watchtower services"
        echo "--pord, -p"
        echo "\t Start production container (i.e. Backend, Frontend, MongoDB) with https://overbookd.${DOMAIN} url'. You need .env file to work"
        echo "--preprod, -t"
        echo "\t Start preprod container (i.e. Backend, Frontend, MongoDB) with https://preprod.overbookd.${DOMAIN} url'. You need .env file to work "
        echo "--all, -a"
        echo "\t Start all needed for production and pre-preprodution (i.e. Traefik, Watchtower, Backend, Frontend, MongoDB). You need .env file to work"
        ;;
    *) 
        echo "starting dev containers"
        dev "$@"
        ;;


esac