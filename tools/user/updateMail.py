import requests

TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjI3LCJ1c2VySWQiOjIyNywidGVhbXMiOlsiYWRtaW4iLCJoYXJkIiwiaW5mb3JtYXRpcXVlIl0sInBlcm1pc3Npb25zIjpbImFkbWluIiwiY29uZmlnLXdyaXRlIiwiaGFyZCIsImNwIiwidmFsaWRhdGVkLXVzZXIiLCJjYXRhbG9nLXJlYWQiXSwiaWF0IjoxNjgwMjQ1OTk3LCJleHAiOjE2ODAzMzIzOTd9.3eFsS-0eDqeKedJftnCXahxEDSoJeTObVAnbEm0rOVM"
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