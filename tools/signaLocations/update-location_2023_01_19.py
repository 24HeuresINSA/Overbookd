from utils import *

toAddLocations = [
    "Devant AIP",
    "Croisement Bd Niels Bohr/Rue des Sports",
    "Croisement Bd Niels Bohr/Av. Gaston Berger",
    "Croisement Av. des Arts/Rue des Sports",
]

toDeleteLocationNames = [] + toAddLocations

toUpdateLocationForms = [
  { "from": "Espace VIP", "to": "Trou GM" },
]

def main():
  updateLocations(toAddLocations, toDeleteLocationNames, toUpdateLocationForms)

main()