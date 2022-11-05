import requests
import json
import logging

"""
Ce script sert a migrer les utilisateurs 'hard' et 'vieux' de la base de donnees mongo vers la base de donnees postgresql
il faut exporter les mots de passe des utilisateurs de la base de donnees mongo dans un fichier data.json avec le format suivant :
[
    {
        "email": "email1",
        "password": "password1"
    },
    {
        "email": "email2",
        "password": "password2"
    },
    ...
]
"""

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("Overbookd - Migrate Users from Mongo to Postgres")

ctmv = "https://cetaitmieuxavant.24heures.org/api"
prod = "https://overbookd.traefik.me/api"


def loginFromMongo(username, password):

    url = f"{ctmv}/login"
    payload = f"username={username.replace('@', '%40')}&password={password}"
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    response = requests.request("POST", url, headers=headers, data=payload)

    logger.info(f"Loggin reponse from mongo backend : {response.text}")

    jsonResponse = json.loads(response.text)
    return jsonResponse["token"]


def getUsersFromMongo(token):

    url = f"{ctmv}/user"
    payload = {}
    headers = {
        'Authorization': f'Bearer {token}'
    }

    response = requests.request("GET", url, headers=headers, data=payload)
    responseJson = json.loads(response.text)

    logger.debug(f"Get users reponse : {responseJson}")
    logger.info(f"Get {len(responseJson)} users from Mongo")

    return json.loads(response.text)


def getOnlyHardOrVieux(users):

    hardUsers = []
    for user in users:
        if "hard" in user["team"] or "vieux" in user["team"]:
            hardUsers.append(user)

    logger.debug(f"Hards users : {hardUsers}")
    logger.info(f"Number of hard users : {len(hardUsers)}")

    return hardUsers


def loginFromPosgresql(username, password):

    url = f"{prod}/login"
    payload = json.dumps({
        "username": username,
        "password": password
    })
    headers = {
        'Content-Type': 'application/json'
    }

    response = requests.request(
        "POST", url, headers=headers, data=payload) # add verify=False if you have a self signed certificate

    logger.info(f"Loggin reponse from posgresql backend: {response.text}")

    jsonResponse = json.loads(response.text)
    return jsonResponse["access_token"]


def newYearFormat(user):

    try:
        oldYear = user["year"]
    except KeyError:
        oldYear = "AUTRE"

    try:
        oldYear = int(oldYear)
        if oldYear > 5:
            newYear = "VIEUX"
        else:
            newYear = f"A{oldYear}"
    except ValueError:
        newYear = "AUTRE"
    return newYear


def newDepartFormat(user):
    try:
        oldDepart = user["departement"]
    except KeyError:
        oldDepart = "AUTRE"

    if oldDepart == "pas a l'INSA" or oldDepart == "pas à l'INSA" or oldDepart == "Pas à l'INSA":
        return "AUTRE"
    else:
        return oldDepart


def nicknameCatch(user):
    try:
        return user["nickname"]
    except KeyError:
        return ""


def birthdayCatch(user):
    try:
        return user["birthdate"]
    except KeyError:
        return "2022-10-10T00:00:00.000Z"


def phoneCatch(user):
    try:
        return str(user["phone"])
    except KeyError:
        return ""


def balanceCatch(user):
    try:
        return user["balance"]
    except KeyError:
        return 0

def getPassword(user, usersPassword):
    try:
        for userPassword in usersPassword:
            if user["email"] == userPassword["email"]:
                return userPassword["password"]
    except KeyError:
        return "ChangeMOI"
    
    return "ChangeMOI"


def createUser(users, token):

    with open("tools/data.json", "r") as f:
        usersPassword = json.loads(f.read())

    logger.info(f"Number of users in data.json : {len(usersPassword)}")

    url = f"{prod}/user"
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {token}'
    }

    for user in users:
        payload = json.dumps({
            "firstname": user["firstname"],
            "lastname": user["lastname"],
            "nickname": nicknameCatch(user),
            "email": user["email"],
            "birthdate": birthdayCatch(user),
            "phone": phoneCatch(user),
            "department": newDepartFormat(user),
            "year": newYearFormat(user),
            "password": "ChangeMOI",
        })

        response = requests.request(
            "POST", url, headers=headers, data=payload) # add verify=False if you have a self signed certificate
        logger.info(
            f"Create user {user['firstname']} {user['lastname']} reponse : {response.text}")

        userID = json.loads(response.text)

        urlWithID = f"{prod}/user/{userID['id']}"
        balance = json.dumps({
            "balance": balanceCatch(user),
            "password": getPassword(user, usersPassword),
        })

        response = requests.request(
            "PUT", urlWithID, headers=headers, data=balance) # add verify=False if you have a self signed certificate
        logger.info(
            f"Update user {user['firstname']} {user['lastname']} balance reponse : {response.text}")


if __name__ == "__main__":
    mongoToken = loginFromMongo("user", "password")
    users = getUsersFromMongo(mongoToken)
    hardUsers = getOnlyHardOrVieux(users)
    posgresqlToken = loginFromPosgresql("user", "password")
    createUser(hardUsers, posgresqlToken)
