import requests

TOKEN = "YOUR_TOKEN"
DOMAIN = "preprod.overbookd.24heures.org"


def create_benevole_team():
    team = {
        "name": "bénévole",
        "code": "benevole",
        "color": "#09A1C4",
        "icon": "mdi-account",
    }
    print(f"creation of the benevole team")
    requests.post(f"https://{DOMAIN}/api/teams", json=team, headers={
        "Authorization": f"Bearer {TOKEN}"}, timeout=5).json()


def add_benevole_team_to_users():
    users = requests.get(f"https://{DOMAIN}/api/users", headers={
        "Authorization": f"Bearer {TOKEN}"}, timeout=5).json()

    # filter users who have a team with a code in benevole_teams
    benevole_teams = ['hard', 'soft', 'vieux']
    filtered_users = [user for user in users if any(
        team['team_code'] in benevole_teams for team in user['teams'])]

    # add benevole team to filtered users
    for user in filtered_users:
        payload = {
            "userId": user['id'],
            "teams": user['teams']
        }
        payload["teams"].append("benevole")

        print(f"add benevole team to user {user['id']}")
        requests.post(f"https://{DOMAIN}/api/teams/link", json=payload, headers={
            "Authorization": f"Bearer {TOKEN}"}, timeout=5).json()


def main():
    create_benevole_team()
    add_benevole_team_to_users()
