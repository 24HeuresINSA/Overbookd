import json
import time

import requests
from requests.structures import CaseInsensitiveDict

URL = "http://127.0.0.1:2424"
BEARER = ""
headers = CaseInsensitiveDict()
headers["Accept"] = "application/json"
headers["Authorization"] = "Bearer " + BEARER
headers["Content-Type"] = "application/json"

teamConfig = json.load(open("teamConfig.json"))

teams = requests.get(URL + '/team', headers=headers, timeout=5)

for team in teamConfig:
    id = [t for t in teams.json() if t["name"] == team["name"]][0]["id"]
    response = requests.patch(URL + '/team/' + str(id),
                              headers=headers, data=json.dumps(team), timeout=5)
    print(f"Update team {team['name']} reponse : {response.text}")
    time.sleep(1)
