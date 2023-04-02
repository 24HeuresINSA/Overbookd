from utils import main as updateLocations

toAddLocations = [
    "Amphi Capelle"
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
