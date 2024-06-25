# Stores

Ce répertoire contient les stores Pinia pour la gestion de l'état dans le projet Nuxt 3.

## Utilisation

Pinia est un modèle de gestion d'état pour Vue, ainsi qu'une bibliothèque. Les stores dans ce répertoire aident à gérer l'état de l'application à l'échelle globale ou spécifique à un composant.

Les stores Pinia sont utilisés pour gérer l'état de l'application. Ils sont réactifs et peuvent être accédés depuis n'importe quel composant de l'application.

Documentation Pinia [ici](https://pinia.vuejs.org/)

## Convention

Chaque fichier dans ce répertoire représente un store Pinia. Le nom du fichier de store doit être au format nom-du-store.ts.
De plus, dans les actions, les méthodes privées doivent être préfixées par un underscore `_`.
