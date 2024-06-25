# Middleware

Ce dossier contient les middleware globaux utilisés dans le projet Nuxt 3. Les middleware dans Nuxt.js permettent de définir des fonctions personnalisées qui s'exécutent avant le rendu d'une page ou d'un groupe de pages, permettant de gérer la logique telle que l'authentification, l'autorisation, le routage et d'autres comportements globaux.

Chaque fichier middleware peut être nommé avec un préfixe numérique pour définir l'ordre dans lequel ils doivent être exécutés. Par exemple, `01-auth.ts`, `02-user.ts`, etc.
Si le nom du middleware est précisé avec `global`, il sera exécuté sur chaque page.

Documentation Nuxt [ici](https://nuxt.com/docs/guide/directory-structure/middleware)
