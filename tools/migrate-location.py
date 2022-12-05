import json
import logging

import requests

"""
Ce script sert a migré les lieux depuis cetaitmieux avant vers la nouvelle version
"""

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("Overbookd - migrate locations from ctmv")

ctmv = "https://cetaitmieuxavant.24heures.org/api"
URL = "https://overbookd.traefik.me/api"

def loginFromctmv(username, password):

    url = f"{ctmv}/login"
    payload = f"username={username.replace('@', '%40')}&password={password}"
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    response = requests.request("POST", url, headers=headers, data=payload)

    logger.info(f"Loggin reponse from mongo backend : {response.text}")

    jsonResponse = json.loads(response.text)
    return jsonResponse["token"]

def login(username, password):

    url = f"{URL}/login"
    payload = json.dumps({
        "email": username,
        "password": password
    })
    headers = {
        'Content-Type': 'application/json'
    }

    response = requests.request(
        "POST", url, headers=headers, data=payload, verify=False) # add verify=False if you have a self signed certificate

    logger.info(f"Loggin reponse from posgresql backend: {response.text}")

    jsonResponse = json.loads(response.text)
    return jsonResponse["access_token"]

def getOldLocations(token):

    url = f"{ctmv}/location"
    payload = {}
    headers = {
      'Authorization': f'Bearer {token}'
    }

    response = requests.request("GET", url, headers=headers, data=payload)

    logger.info(f"Get all locations reponse : {response.text}")

    return json.loads(response.text)


def setNewLocations(token, locationName):

  url = f"{URL}/signa-location"
  payload = json.dumps({
    "name": locationName,
  })
  headers = {
    'Authorization': f'Bearer {token}',
  }

  response = requests.request("POST", url, headers=headers, data=payload)

  logger.info(f"Set new location reponse : {response.text}")


if __name__ == "__main__":

    ctmv_token = loginFromctmv("user", "password")
    token = login("user", "password")

    locations = getOldLocations(ctmv_token)

    for location in locations:
        setNewLocations(token, location["name"])