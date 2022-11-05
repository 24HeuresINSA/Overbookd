import json
import requests
from requests.structures import CaseInsensitiveDict

URL="http://127.0.0.1:2424"
BEARER=""

headers = CaseInsensitiveDict()
headers["Accept"] = "application/json"
headers["Authorization"] = "Bearer " + BEARER
headers["Content-Type"] = "application/json"

# Load users from old version (json file) JSON return with endpoin /user
users = json.load(open("users.json"))

print(f"Number of users in users.json : {len(users)}")

for user in users:    
    payload = json.dumps({
        "userId": user["id"],
        "teams": user["team"],
    })
    print(payload)
    
    response = requests.post(URL + '/team/link', headers=headers, data=payload)
    print(f"Create userTeam for user {user['lastname']} reponse : {response.text}")