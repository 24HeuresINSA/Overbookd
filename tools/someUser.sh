#!/usr/bin/env bash

# Le script permet de créer des utilisateurs génériques avec leur roles respectifs
# Il prend en parametre le nom d'un utilisateur, son mot de passe et un endpoint
# Cet utilisateur doit etre créé au préalable dans la base de données et avoir les 
# permissions nécessaires pour créer des utilisateurs et leur donner des roles
# Il sont créé avec la structure suivante:
# ('firstname1:lastname1:role1,role2,role3' 'firstname2:lastname2:role1,role2,role3' ...)
# Les utilisateurs créés ont les crédenitals suivantes:
#  - email : firstname.lastname@24h.me
#  - password : fistname.lastname

NC='\033[0m' # No Color
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'

# ./someUser.sh user password baseURL
if [ $# -ne 3 ];
then
    echo -e "${RED}No arguments supplied or too many arguments supplied${NC}" >&2
    echo "Usage: ./someUser.sh user password baseURL"
    exit 1
fi

# Check if jq is installed
if ! [ -x "$(command -v jq)" ]; 
then
  echo -e "${RED}Error: jq is not installed.${NC}" >&2
  echo -e "Please install jq with your package manager." >&2
  echo -e "For example: sudo apt install jq" >&2
  exit 1
fi

# Check if curl is installed
if ! [ -x "$(command -v curl)" ]; 
then
  echo -e "${RED}Error: curl is not installed.${NC}" >&2
  echo -e "Please install curl with your package manager." >&2
  echo -e "For example: sudo apt install curl" >&2
  exit 1
fi

login(){
    # Login to the API

    # Args
    # $1 : username
    # $2 : password

    # Vars
    # BASE_URL : the base url of the API

    # Returns
    # $TOKEN : the access token to use for the API

    CREDS="{\"email\":\"${1}\",\"password\":\"${2}\"}"
    TOKEN_RESP=$(curl --silent -X 'POST' "${BASE_URL}/login" -H 'accept: application/json' -H 'Content-Type: application/json' -d "$(echo $CREDS | jq -r)")
    TOKEN=$(echo $TOKEN_RESP | jq -r '.access_token')
}

userJson(){
    # Create the json for the user

    # Args
    # $1 : firstname
    # $2 : lastname

    # Returns
    # $USER_JSON : the json for the user creation

    USER_JSON="{\"firstname\": \"${1}\",\"lastname\": \"${2}\",\"nickname\": \"${1}.${2}\",\"email\": \"${1}.${2}@24h.me\",\"birthdate\": \"2022-10-20T15:51:45.695Z\",\"phone\": \"06123445678\",\"department\": \"TC\",\"year\": \"A1\",\"password\": \"${1}.${2}\"}"
}

teamsJson(){
    # Create the json for the teams

    # Args
    # $1 : list of teams (i.e "role1,role2,role3")

    # Returns
    # $TEAMS_JSON : the json for the teams creation

    TEAMS_JSON="{\"teams\": ["
    teamArray=(${1//,/ })
    for i in "${!teamArray[@]}";
    do
        TEAMS_JSON+="\"${teamArray[$i]}\""
        if [ $i -lt $((${#teamArray[@]}-1)) ]; then
            TEAMS_JSON+=","
        fi
    done
    TEAMS_JSON+="]}"

    echo $TEAMS_JSON
}

addTeam(){
    # Add a team to a user

    # Args
    # $1 : list of teams (i.e "role1,role2,role3")

    # Vars
    # $ID : the id of the user
    # $TOKEN : the access token to use for the API
    # $BASE_URL : the base url of the API

    teamsJson $1
    ## URL="${BASE_URL}/users/$ID"
    # Oui mais on n'a pas l'endpoint pour ajouter une équipe
    echo "OUI OUI ON FAIT LA REQUETE"
}

createUser(){
    # Create a user

    # Args
    # $1 : firstname
    # $2 : lastname

    # Vars
    # $BASE_URL : the base url of the API

    # Returns
    # $ID : the id of the user created

    userJson $1 $2
    RESP=$(curl --silent -X 'POST' "${BASE_URL}/user" -H 'accept: application/json' -H 'Content-Type: application/json' -d "$(echo $USER_JSON | jq -r)")
    ID=$(echo $RESP | jq -r '.id')
}

BASE_URL=$3

echo "Login..."
echo -e "${BLUE}-----------------------------------------------------------------${NC}"
login $1 $2


# Definition des utilisateurs

TEAM_BASE_ORGA="hard,orga"

HARD="hard:hard:hard"
SOFT="soft:soft:soft"
ADMIN="admin:admin:hard,admin"
CONFIANCE="confiance:confiance:confiance"
VIEUX="vieux:vieux:vieux"
BUREAU="bureau:bureau:bureau"
LOG_MATOS="log:matos:${TEAM_BASE_ORGA},log,matos"
LOG_ELEC="log:elec:${TEAM_BASE_ORGA},log,elec"
SECU="secu:secu:${TEAM_BASE_ORGA},secu"
PAYANT="payant:payant:${TEAM_BASE_ORGA},payant"
HUMAIN="humain:humain:${TEAM_BASE_ORGA},humain"
BAR="bar:bar:${TEAM_BASE_ORGA},bar"
BARRIERES="barrieres:barrieres:${TEAM_BASE_ORGA},barrieres"
CATERING="catering:catering:${TEAM_BASE_ORGA},catering"
MAMAN="maman:maman:${TEAM_BASE_ORGA},maman"
SCENE="scene:scene:${TEAM_BASE_ORGA},scene"
SIGNA="signa:signa:${TEAM_BASE_ORGA},signa"
COMMUNICATION="comm:comm:hard,communication"
CONCERT="concert:concert:hard,concert"
COURSES="courses:courses:hard,courses"
CULTURE="culture:culture:hard,culture"
DD="dd:dd:hard,dd"
DECO="deco:deco:hard,deco"
COMSA="comsa:comsa:hard,informatique"
PLAIZIR="plaizir:plaizir:hard,plaizir"
SPONSO="sponso:sponso:hard,sponso"
SPORTS="sports:sports:hard,sports"


USERS=($HARD $SOFT $ADMIN $CONFIANCE $VIEUX $BUREAU $LOG_MATOS $LOG_ELEC $SECU $PAYANT $HUMAIN $BAR $BARRIERES $CATERING $MAMAN $SCENE $SIGNA $COMMUNICATION $CONCERT $COURSES $CULTURE $DD $DECO $COMSA $PLAIZIR $SPONSO $SPORTS)

# Main loop

for i in ${USERS[@]};
do
    tmp=(${i//:/ })
    echo "Create user ${tmp[0]} ${tmp[1]}..."
    createUser ${tmp[0]} ${tmp[1]}
    echo -e "${GREEN}Successfull created user ${tmp[0]} ${tmp[1]} with id $ID ${NC}"
    echo "Add team ${tmp[1]}..."
    addTeam ${tmp[2]}
    echo -e "${GREEN}Successfull added team ${tmp[1]} to user ${tmp[0]}${NC}"
    echo -e "${BLUE}-----------------------------------------------------------------${NC}"
done
