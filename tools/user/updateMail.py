import requests

TOKEN = "YOUR_TOKEN"
DOMAIN = "overbookd.traefik.me"


def getAllUsers():
    return requests.get(f"https://{DOMAIN}/api/user", headers={"Authorization": f"Bearer {TOKEN}"}, timeout=5,).json()


def updateUserMail(userMail):
    userId = userMail["id"]
    mail = userMail["email"].lower()
    requests.put(f"https://{DOMAIN}/api/user/{userId}/mail", json=mail,
                 headers={"Authorization": f"Bearer {TOKEN}"}, timeout=5)
    print(f"User {userId} updated")


def main():
    users = getAllUsers()
    for user in users:
        updateUserMail(user)


main()
