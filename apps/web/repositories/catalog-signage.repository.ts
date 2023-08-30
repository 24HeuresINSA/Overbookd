import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { Signage, SignageForm, signageTypes } from "@overbookd/signa";
import { SlugifyService } from "@overbookd/slugify";

export type Context = { $axios: NuxtAxiosInstance };

export class CatalogSignageRepository {
  private static readonly basePath = "signages";

  static searchSignages(context: Context) {
    return context.$axios.get<Signage[]>(this.basePath);
  }

  static createSignage(context: Context, signageForm: SignageForm) {
    return context.$axios.post<Signage>(this.basePath, signageForm);
  }

  static updateSignage(
    context: Context,
    signageId: number,
    signageForm: SignageForm,
  ) {
    return context.$axios.put<Signage>(
      `${this.basePath}/${signageId}`,
      signageForm,
    );
  }

  static deleteSignage(context: Context, signageId: number) {
    return context.$axios.$delete(`${this.basePath}/${signageId}`);
  }
}


export class FakeCatalogSignageRepository {
  private static readonly signages: Signage[] = [
    {
      id: 1,
      name: "44 Radio Scoop",
      slug: "44-radio-scoop",
      type: signageTypes.BACHE,
    },
    {
      id: 2,
      name: "Flèche verte",
      slug: "fleche-verte",
      type: signageTypes.PANNEAU,
    },
    {
      id: 3,
      name: "Affiche 48",
      slug: "affiche-48",
      type: signageTypes.AFFICHE,
    },
    {
      id: 4,
      name: "Panneau bois toilettes",
      slug: "panneau-bois-toilettes",
      type: signageTypes.PANNEAU,
    },
  ];

  static searchSignages(context: Context): Promise<{ data: Signage[] }> {
    console.debug(context); // Pour pas qu'il soit noté comme not used
    return new Promise((resolve) => resolve({ data: this.signages }));
  }

  static createSignage(context: Context, signageForm: SignageForm): Promise<{ data: Signage }> {
    console.debug(context); // Pour pas qu'il soit noté comme not used
    return new Promise((resolve) =>
      resolve({
        data: {
          ...signageForm,
          slug: SlugifyService.apply(signageForm.name),
          id: this.signages.length + 1,
        },
      }),
    );
  }

  static updateSignage(
    context: Context,
    signageId: number,
    signageForm: SignageForm,
  ): Promise<{ data: Signage }> {
    console.debug(context); // Pour pas qu'il soit noté comme not used
    return new Promise((resolve) =>
      resolve({
        data: {
          ...signageForm,
          slug: SlugifyService.apply(signageForm.name),
          id: signageId,
        },
      }),
    );
  }

  static deleteSignage(context: Context, signageId: number) {
    console.debug(context, signageId); // Pour pas qu'ils soit notés comme not used
    return new Promise((resolve) => resolve({}));
  }
}
