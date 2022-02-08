TOKEN=$(curl --location --request POST $BASE_URL'login' --header 'Content-Type: application/x-www-form-urlencoded' --data-urlencode 'username='$USERNAME --data-urlencode 'password='$PASSWORD | cut -d: -f2 | sed -e 's/"//g' -e 's/}//g')
RES=$(curl --location --request PUT $BASE_URL'config' --header 'Authorization: Bearer '$TOKEN --header 'Content-Type: application/json' -d "@config/config.json")
echo $RES
if [ "$RES" != "OK" ]; then exit -1; fi
