export class SimilarBarrelExist extends Error {
  constructor(slug: string) {
    super(`Un fût de ${slug} est déjà configuré.`);
  }
}
export class BarrelNotConfigured extends Error {
  constructor(slug: string) {
    super(`Aucun fût de ${slug} n'est encore configuré`);
  }
}
