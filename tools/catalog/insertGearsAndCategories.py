import csv
import os
import requests

TOKEN = "YOUR_JWT"
DOMAIN = "preprod.overbookd.24heures.org"

def cleanAll():
    categories = requests.get(f"https://{DOMAIN}/api/categories", headers={"Authorization": f"Bearer {TOKEN}"}).json()
    gears = requests.get(f"https://{DOMAIN}/api/gears", headers={"Authorization": f"Bearer {TOKEN}"}).json()
    for category in categories:
        print(f"deleting {category['name']}")
        requests.delete(f"https://{DOMAIN}/api/categories/{category['id']}", headers={"Authorization": f"Bearer {TOKEN}"})

    for gear in gears:
        print(f"deleting {gear['name']}")
        requests.delete(f"https://{DOMAIN}/api/gears/{gear['id']}", headers={"Authorization": f"Bearer {TOKEN}"})


    

def createCategory(name: str, parent: str = None):
    print(f"Try to create category {name} with {parent} as parent")
    data = {"name": name, "owner": name.lower()}
    if(parent):
        data.update({"parent": int(parent)})
    return requests.post(f"https://{DOMAIN}/api/categories", json=data, headers={"Authorization": f"Bearer {TOKEN}"}).json()

def createGear(name: str, category: str):
    print(f"Try to create gear {name} with {category} as category")
    return requests.post(f"https://{DOMAIN}/api/gears", json={"name": name, "category": int(category)}, headers={"Authorization": f"Bearer {TOKEN}"}).json()

def extractFromFile():
    real_path = os.path.realpath(__file__)
    dir_path = os.path.dirname(real_path)
    toCreate = dict()
    with open(os.path.join(dir_path, 'catalog-fa.csv'), newline='') as catalog:
        reader = csv.DictReader(catalog)
        for gear in reader:
            main = gear['Main']
            sub = gear['Sub']
            gearName = gear['Description']

            if toCreate.get(main):
                if sub:
                    if toCreate[main]["categories"].get(sub):
                        toCreate[main]["categories"][sub]["gears"].add(gearName)
                    else:
                        toCreate[main]["categories"].update({sub: {"gears": {gearName}}})
                else:
                    toCreate[main]["gears"].add(gearName)
            else:
                if sub:
                    toCreate.update({main: { "categories": {sub: { "gears": {gearName}}}}})
                else:
                    toCreate.update({main: { "categories": {}, "gears": {gearName}}})
    return toCreate

def createAll():
    toCreate = extractFromFile()

    for [categoryName, categoryTree] in toCreate.items():
        res = createCategory(categoryName)
        gears = categoryTree.get("gears", [])
        for gear in gears:
            createGear(gear, res.get("id"))
        for [subCategoryName, subCategoryTree] in categoryTree["categories"].items():
            subres = createCategory(subCategoryName, res.get("id"))
            gears = subCategoryTree.get("gears", [])
            for gear in gears:
                createGear(gear, subres.get("id"))

cleanAll()
createAll()
