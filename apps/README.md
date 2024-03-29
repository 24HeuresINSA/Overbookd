# Apps

On y range tous les modules qui sont amenés à être exposés à des utilisateurs finaux. Que ça soit les membres de l'association, les bénévoles ou même les développeurs et administrateurs des outils informatiques.

Aucun module ne peut se référer à une app, elles sont à la fin de la chaine de développement et par conséquent aucun autre module ne doit en dépendre.

Cette règle est également valable pour les modules app entre eux (ex: l'api ne peut pas se référer à l'appli web).

Dans son implémentation, une app peut se reposer sur tous les autres modules:

- [constants](../constants/README.md) pour des valeurs fixes
- [libraries](../libraries/README.md) pour des comportements génériques
- [domains](../domains/README.md) pour la logique de l'application
- [utils](../utils/README.md) pour faciliter l'expérience développeur

Comme ce sont les modules exposés aux utilisateurs, ce sont les seuls à pouvoir proposer en plus des [tests unitaires](https://www.linkedin.com/posts/colin-damon_aujourdhui-focus-sur-les-tests-qui-sont-activity-7086955276968321025-uFVh?utm_source=share&utm_medium=member_desktop) _(UT)_ des [test d'intégration](https://www.linkedin.com/posts/colin-damon_aujourdhui-on-va-parler-des-tests-qui-ont-activity-7087317647091986432-HOXK?utm_source=share&utm_medium=member_desktop) _(IT)_, des [tests de composant](https://www.linkedin.com/posts/colin-damon_aujourdhui-on-aborde-les-tests-les-moins-activity-7088042424387649536-UnpW?utm_source=share&utm_medium=member_desktop) _(CT)_ ou des [tests de bout en bout](https://www.linkedin.com/posts/colin-damon_on-commence-la-semaine-en-parlant-des-tests-activity-7089129577918124032-hfN3?utm_source=share&utm_medium=member_desktop) _(e2e)_.
