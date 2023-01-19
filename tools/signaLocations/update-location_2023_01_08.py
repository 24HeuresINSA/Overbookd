from utils import main as updateLocations

toAddLocations =[
    "Pelouse derrière Cambridge",
    "Pas tes oignons",
]

toDeleteLocationNames = [
  "Carrefour au nord de GCU",
  "Urhino",
  "Devant l'AIP",
  "Jardin partagé Le Doua Vert",
  "Trou GM"
] + toAddLocations

toUpdateLocationForms = [
  { "from": "Devant GCU", "to": "Pelouse GCU" },
]

def main():
  updateLocations(toAddLocations, toDeleteLocationNames, toUpdateLocationForms)

main()