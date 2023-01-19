from utils import main as updateLocations

toAddLocations =[
    "Derrière TC",
    "Parking Infirmerie",
    "Pelouse Gaston Berger",
    "TC"
]

toDeleteLocationNames = [
  "Derrière Gaston Berger",
  "Local Clubelek",
  "Lokal",
  "Pas tes oignons !",
] + toAddLocations

toUpdateLocationForms = [
  { "from": "Le lieu de la signa", "to": "Lieu de la signa - CRL" },
  { "from": "Petite Scène", "to": "Scène Nord" },
  { "from": "Pierre de Fermat", "to": "Pierre de Fermat / Myriam Mirzakhani" },
]

def main():
  updateLocations(toAddLocations, toDeleteLocationNames, toUpdateLocationForms)

main()