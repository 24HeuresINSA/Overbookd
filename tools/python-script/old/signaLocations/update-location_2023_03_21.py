from utils import main as updateLocations

toAddLocations = [
    "Bâtiment Gustave Ferrié (GE)",
    "Entre GE et GEN",
    "Creux GM"
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
