import requests

TOKEN = "YOUR_TOKEN"
DOMAIN = "overbookd.traefik.me"

def getAllfa():
    return requests.get(f"https://{DOMAIN}/api/fa", headers={"Authorization": f"Bearer {TOKEN}"}).json()

def findGearRequests(fas):
    return [buildFaGearRequest(fa) for fa in fas]

def buildFaGearRequest(fa):
    faId = fa["id"]
    gearRequests = requests.get(f"https://{DOMAIN}/api/fa/{faId}/gear-requests", headers={"Authorization": f"Bearer {TOKEN}"}).json()
    return {"fa": faId, "requests": gearRequests}

def updateFaGearRequest(faGearRequests):
    if len(faGearRequests["requests"]) == 0:
        return
    periodId = -1
    faId = faGearRequests["fa"]
    for index, gearRequest in enumerate(faGearRequests["requests"]):
        gearId = gearRequest["gear"]["id"]
        gearRequestData = {"gearId": gearId, "quantity": gearRequest["quantity"]}
        if index == 0:
            newPeriod = {"start": gearRequest["rentalPeriod"]["start"], "end": gearRequest["rentalPeriod"]["end"]}
            gearRequestData.update(newPeriod)
        else:
            existingPeriod = {"periodId": periodId}
            gearRequestData.update(existingPeriod)
        
        savedGearRequest = requests.post(f"https://{DOMAIN}/api/fa/{faId}/gear-requests", json=gearRequestData, headers={"Authorization": f"Bearer {TOKEN}"}).json()
        periodId = savedGearRequest["rentalPeriod"]["id"]
        
        previousRentaPeriodId = gearRequest["rentalPeriod"]["id"]
        requests.delete(f"https://{DOMAIN}/api/fa/{faId}/gear-requests/{gearId}/rental-period/{previousRentaPeriodId}", headers={"Authorization": f"Bearer {TOKEN}"})

def main():
    fas = getAllfa()
    faGearRequests = findGearRequests(fas)
    for fa in faGearRequests:
        updateFaGearRequest(fa)

main()