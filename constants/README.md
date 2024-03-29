# Constants

On y range des modules qui expose uniquement des constantes (et les types associés si nécessaire) pour différent contextes de l'application.

De cette manière il est possible d'avoir plusieurs constantes avec le même nom dans différents modules et c'est le contexte de l'application qui permettra de savoir depuis quel module on souhaite récupérer la constante.

Comme les modules définissent eux même des constantes dans leur contexte, ils sont indépendant et **ne peuvent se référer à (i.e import) aucun autre module**. En revanche ils sont les fondations sur lesquels se reposent les modules [domains](../domains/README.md) et [apps](../apps/README.md).

Ces modules **n'embarquent aucune logique** ils sont donc dépourvus de tests.
