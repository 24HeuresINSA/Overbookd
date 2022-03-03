#!/bin/bash

if ! command -v jq &> /dev/null
then
    echo "jq should install"
    exit
fi

echo "Start"

REFDATE=$(date --date="10 days ago"  '+%Y-%m-%d')

echo "Get pipeline before $REFDATE"


PAGES=$(curl -k -D - -X "HEAD" --header "PRIVATE-TOKEN: $GITLAB_API_TOKEN" "https://gitlab.com/api/v4/CI_PROJECT_IDs/$CI_PROJECT_ID/pipelines?per_page=100&updated_before=$REFDATE" 2> /dev/null |grep '^x-total-pages'|sed -e 's/^.*[a-z]:.\([0-9][0-9]*\).*$/\1/g')

for PAGE in $(seq 0 $PAGES);
do 
    for PIPELINE in $(curl --header "PRIVATE-TOKEN: $GITLAB_API_TOKEN" "https://gitlab.com/api/v4/projects/$CI_PROJECT_ID/pipelines?per_page=100&updated_before=$REFDATE&page=$PAGE" | jq '.[].id'); 
    do
        echo "Deleting pipeline $PIPELINE"
        curl --header "PRIVATE-TOKEN: $GITLAB_API_TOKEN" --request "DELETE" "https://gitlab.com/api/v4/projects/$CI_PROJECT_ID/pipelines/$PIPELINE"
    done

done
