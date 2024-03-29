# Libraries

On y range des modules avec une logique qui peut être utilisée dans plusieurs modules.

Ils sont cependant indépendant et tout comme les [constants](../constants/README.md) définissent un socle sur lequel se reposent les modules [apps](../apps/README.md) et [domains](../domains/README.md).

De part leur indépendance, ils **ne peuvent se référer à (i.e import) aucun autre module**, constants compris.

Étant donné qu'ils exposent des éléments avec de la logique, ils _peuvent_ avoir leur propres [tests unitaires](https://www.linkedin.com/posts/colin-damon_aujourdhui-focus-sur-les-tests-qui-sont-activity-7086955276968321025-uFVh?utm_source=share&utm_medium=member_desktop) _(UT)_ bien que les cas d'usage sont testés dans les [domains](../domains/).
