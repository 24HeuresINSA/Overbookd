from utils import main as updateLocations

toAddLocations = [
    "Magasin"
]

toDeleteLocationNames = [] + toAddLocations

toUpdateLocationForms = []


def main():
    updateLocations(
        toAddLocations,
        toDeleteLocationNames,
        toUpdateLocationForms
    )


main()
