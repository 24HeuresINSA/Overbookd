import requests

TOKEN = "YOUR_TOKEN"
DOMAIN = "preprod.overbookd.24heures.org"

def getSofts():
    volunteers = requests.get(f"https://{DOMAIN}/api/user", headers={"Authorization": f"Bearer {TOKEN}"}, timeout=3).json()
    return [volunteer for volunteer in volunteers if "soft" in volunteer["team"]]

def addAvailability(volunteerId: int):
    data = [{"start": "2023-05-08T16:00:00.000Z", "end": "2023-05-08T18:00:00.000Z"}]
    print(f"Add briefing availability for {volunteerId}")
    return requests.post(
        f"https://{DOMAIN}/api/volunteer-availability/{volunteerId}",
        json=data,
        headers={"Authorization": f"Bearer {TOKEN}"},
        timeout=3,
    ).json()

def main():
    softs = getSofts()
    for soft in softs:
        addAvailability(soft["id"])

main()