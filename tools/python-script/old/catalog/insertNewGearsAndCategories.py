import csv
import os
from typing import Dict, List

import requests

TOKEN = "YOUR_TOKEN"
DOMAIN = "preprod.overbookd.24heures.org"


def fetchExistingCategories():
    categoryList = requests.get(
        f"https://{DOMAIN}/api/categories", headers={"Authorization": f"Bearer {TOKEN}"}, timeout=5).json()
    categories = dict()
    for category in categoryList:
        categories.update({category.get("path"): {"path": category.get(
            "path"), "id": category.get("id"), "owner": category.get("owner").get("code")}})

    return categories


def getCategoryId(categoryName: str) -> int:
    categories = requests.get(f"https://{DOMAIN}/api/categories", headers={
                              "Authorization": f"Bearer {TOKEN}"}, params={"name": categoryName}, timeout=5).json()
    [category] = [category for category in categories if category.get(
        "path") == categoryName]
    return int(category.get("id"))


def createNewCategories(categories: Dict) -> Dict:
    for category in categories.values():
        if category.get("id") is not None:
            continue
        path = category.get("path")
        [parent, name] = path.split("->")
        parentId = getCategoryId(parent)
        savedCategory = createCategory(name, parentId)
        category.update({"id": int(savedCategory.get("id"))})

    return categories


def createGears(gears: List, categories: Dict):
    for gear in gears:
        categoryId = categories.get(gear.get("category")).get("id")
        gearName = gear.get("name")
        isPonctual = gear.get("isPonctualUsage")
        createGear(gearName, categoryId, isPonctual)


def createCategory(name: str, parent: int = None):
    print(f"Try to  create category {name} with {parent} as parent")
    data = {"name": name.upper()}
    if (parent):
        data.update({"parent": parent})
    return requests.post(f"https://{DOMAIN}/api/categories", json=data, headers={"Authorization": f"Bearer {TOKEN}"}, timeout=5).json()


def createGear(name: str, category: int, ponctualGear: bool = False):
    print(f"Try to create gear {name} with {category} as category")
    return requests.post(f"https://{DOMAIN}/api/gears", json={"name": name, "category": category, "isPonctualUsage": ponctualGear}, headers={"Authorization": f"Bearer {TOKEN}"}, timeout=5).json()


def extractFromFile(categories: Dict, filename: str = "catalog-fa-after-inventory.csv"):
    real_path = os.path.realpath(__file__)
    dir_path = os.path.dirname(real_path)
    gears = list()
    with open(os.path.join(dir_path, filename), newline='') as catalog:
        reader = csv.DictReader(catalog)
        for gear in reader:
            categoryPath = gear['Path']
            gearName = gear['Nom']
            owner = gear['Resp']
            ponctualGear = int(gear['Appoint'])
            gears.append({'name': gearName, 'category': categoryPath,
                         "isPonctualUsage": ponctualGear == 1})
            if categories.get(categoryPath) is not None:
                continue
            categories.update(
                {categoryPath: {"path": categoryPath, "owner": owner}})
    return [categories, gears]


def createAll():
    filename = "catalog-ft-after-inventory.csv"
    categories = fetchExistingCategories()
    [categories, gears] = extractFromFile(categories, filename)
    categories = createNewCategories(categories)

    createGears(gears, categories)


createAll()
