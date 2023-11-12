export class SimilarBarrelExist extends Error {
  constructor(slug: string) {
    const message = `Un fût de ${slug} est déjà configuré.`;
    super(message);
  }
}
export class BarrelNotConfigured extends Error {
  constructor(slug: string) {
    const message = `Aucun fût de ${slug} n'est encore configuré`;
    super(message);
  }
}
