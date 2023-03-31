import requests

TOKEN = "YOUR_TOKEN"
DOMAIN = "overbookd.traefik.me"

def getAllUsers():
    return requests.get(f"https://{DOMAIN}/api/user", headers={"Authorization": f"Bearer {TOKEN}"}, timeout=5).json()

def findUserMail(user):
    return {"user": user["id"], "mail": user["mail"]}

def updateUserMail(userMail):
    userId = userMail["user"]
    mail = userMail["mail"].lower()
    requests.put(f"https://{DOMAIN}/api/user/{userId}/mail", json=mail, headers={"Authorization": f"Bearer {TOKEN}"}, timeout=5)

def main():
    users = getAllUsers()
    userMails = findUserMail(users)
    for user in userMails:
        updateUserMail(user)
    
main()