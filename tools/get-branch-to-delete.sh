#!/usr/bin/env bash

# Se script perme de récupérer les branches à supprimer a partir
# des MR qui sont fermés, notamment les branches lié au depandabot.
# Pour chaque branch, la suppression doit etre confirmé par l'utilisateur.

NC='\033[0m' # No Color
BLUE='\033[0;34m'


# Get all closed and merged MRs from dependabot 
CLOSED_MR=$(curl --silent --location --request GET 'https://gitlab.com/api/v4/projects/24-heures-insa%2Foverbookd-mono/merge_requests?state=closed&labels=dependencies')

# Filter json object to get only the source branch name

BRANCHES=$(echo $CLOSED_MR | jq -r '.[] | .source_branch')

for branch in $BRANCHES;
do
    echo -e "${BLUE}Going to delete ${branch}${NC}"
    while true;
    do
        read -p "Do you want to proceed? (y/n) " yn

        case $yn in 
            [yY]es | [yY] )
                git push origin --delete $branch
                break;;
            [nN]o | [nN] ) 
                echo "Continue verification..."
                break;;
            * ) 
            echo "Invalid response"
            ;;
        esac
    done
done