from tokenize import String
import requests
import json
import logging

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
        "POST", url, headers=headers, data=payload, verify=False)

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

    if oldDepart == "pas a l'INSA" or oldDepart == "pas à l'INSA":
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
        return ""

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

def createUser(users, token):

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
            "password": "string"
        })

        response = requests.request(
            "POST", url, headers=headers, data=payload, verify=False)
        logger.info(f"Create user {user['firstname']} {user['lastname']} reponse : {response.text}")

        userID = json.loads(response.text)

        urlWithID = f"{prod}/user/{userID['id']}"
        balance = json.dumps({
             "balance": balanceCatch(user)
        })

        response = requests.request("PUT", urlWithID, headers=headers, data=balance, verify=False)
        logger.info(f"Update user {user['firstname']} {user['lastname']} balance reponse : {response.text}")

if __name__ == "__main__":
    mongoToken = loginFromMongo("user", "password")
    users = getUsersFromMongo(mongoToken)
    hardUsers = getOnlyHardOrVieux(users)
    posgresqlToken = loginFromPosgresql("user", "password")
    createUser(hardUsers, posgresqlToken)
