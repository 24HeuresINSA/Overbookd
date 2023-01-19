import requests

TOKEN = "YOUR_TOKEN"
DOMAIN = "preprod.overbookd.24heures.org"

def deleteLocations(locations):
    for location in locations:
        print(f"deleting {location['name']}")
        requests.delete(f"https://{DOMAIN}/api/signa-location/{location['id']}", headers={"Authorization": f"Bearer {TOKEN}"}).json()

def updateLocations(locations):
    for location in locations:
        print(f"updating #{location['id']} to {location['name']}")
        requests.patch(f"https://{DOMAIN}/api/signa-location/{location['id']}", json=location, headers={"Authorization": f"Bearer {TOKEN}"}).json()


def createLocations(locations):
    for location in locations:
        print(f"creating {location}")
        json = {"name": location}
        requests.post(f"https://{DOMAIN}/api/signa-location/", json=json, headers={"Authorization": f"Bearer {TOKEN}"}).json()

def getAllLocations():
        return requests.get(f"https://{DOMAIN}/api/signa-location/", headers={"Authorization": f"Bearer {TOKEN}"}).json()

def findLocations(locationNames, locations):
    return [location for location in locations if location['name'] in locationNames]

def getOriginalName(toUpdateLocationForm):
    return toUpdateLocationForm["from"]

def findToUpdateNewName(previousName, toUpdateLocationForms):
    for form in toUpdateLocationForms:
        if previousName == form['from']:
            return form['to']

    return previousName

def setNewNames(toUpdateLocationForms, toUpdateLocations):
    return [{"id": location["id"], "name": findToUpdateNewName(location['name'], toUpdateLocationForms) } for location in toUpdateLocations]

def setToUpdateLocations(toUpdateLocationForms, locations):
    toUpdateLocationNames = list(map(getOriginalName, toUpdateLocationForms))
    toUpdateLocations = findLocations(toUpdateLocationNames, locations)
    return setNewNames(toUpdateLocationForms, toUpdateLocations)

def main(toAddLocations, toDeleteLocationNames, toUpdateLocationForms ):
  locations = getAllLocations()
  toDeleteLocations = findLocations(toDeleteLocationNames, locations)
  toUpdateLocations = setToUpdateLocations(toUpdateLocationForms, locations)
  deleteLocations(toDeleteLocations)
  updateLocations(toUpdateLocations)
  createLocations(toAddLocations)