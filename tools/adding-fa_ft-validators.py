import json
import logging
import requests

"""
Ce script sert a setter les validateurs pour les FA et les FT
"""

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("Overbookd - set validators for FA and FT")

URL = "https://preprod.overbookd.24heures.org/api"


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
        "POST", url, headers=headers, data=payload)  # add verify=False if you have a self signed certificate

    logger.info(f"Loggin reponse from posgresql backend: {response.text}")

    jsonResponse = json.loads(response.text)
    return jsonResponse["access_token"]


def getAllTeam(token):

    url = f"{URL}/team"
    payload = {}
    headers = {
        'Authorization': f'Bearer {token}'
    }

    response = requests.request("GET", url, headers=headers, data=payload)

    logger.info(f"Get all teams reponse : {response.text}")

    return json.loads(response.text)


def setValidatorForTeam(token, team, isFAValidator, isFTValidator):

    url = f"{URL}/team/{team['id']}"
    payload = json.dumps({
        "name": team["name"],
        "fa_validator": isFAValidator,
        "ft_validator": isFTValidator
    })
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }

    response = requests.request("PATCH", url, headers=headers, data=payload)

    logger.info(f"Set validator for team reponse : {response.text}")

if __name__ == '__main__':

    token = login("user", "password")
    teams = getAllTeam(token)

    for team in teams:
        if team["name"] in ["humain", "matos"]:
            setValidatorForTeam(token, team, True, True)
            logger.warn(f"Set validator for team {team['name']}")
        elif team["name"] in ["signa", "secu", "barrieres", "elec"]:
            setValidatorForTeam(token, team, True, False)
            logger.warn(f"Set validator for team {team['name']}")
        else:
            setValidatorForTeam(token, team, False, False)