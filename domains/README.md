# Domains

C'est **le dossier le plus important** de l'application. On y range les modules qui s'occupent de traiter la logique métier de l'application (i.e. la logique spécifique à l'application et à notre manière de travailler).

On découpe les modules en fonctions du contexte de l'application pour éviter les quiproquo sur le nom de certains éléments, par exemple un bénévole ne veut pas dire la même chose lorsque l'on gère les inscriptions et lorsque l'on réalise l'affectation. Les modules du [domains](./README.md) sont donc **indépendant les uns des autres**.

Les modules du domains peuvent se baser sur les [constants](../constants/README.md) et les [libraries](../libraries/README.md) pour construire leur logique.

Puisqu'ils embarquent la logique spécifique de l'application, il est primordial que tous les modules se reposent sur des [tests unitaires](https://www.linkedin.com/posts/colin-damon_aujourdhui-focus-sur-les-tests-qui-sont-activity-7086955276968321025-uFVh?utm_source=share&utm_medium=member_desktop) _(UT)_ afin de s'assurer du comportement et de vérifier que ce qui est codé correspond à notre manière d'organiser le festival.
