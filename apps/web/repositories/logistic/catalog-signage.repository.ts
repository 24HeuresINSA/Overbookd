import type { Signage, SignageForm } from "@overbookd/signa";
import { ImageRepository } from "~/utils/http/image.repository";
import { HttpClient } from "~/utils/http/http-client";

export class CatalogSignageRepository {
  private static readonly basePath = "signages";

  static fetchSignages() {
    return HttpClient.get<Signage[]>(this.basePath);
  }

  static async getSignageImage(signageId: number): Promise<string | Error> {
    const path = `${this.basePath}/${signageId}/image`;
    return ImageRepository.getImage(path);
  }

  static createSignage(signageForm: SignageForm) {
    return HttpClient.post<Signage>(this.basePath, signageForm);
  }

  static updateSignage(signageId: number, signageForm: SignageForm) {
    return HttpClient.put<Signage>(
      `${this.basePath}/${signageId}`,
      signageForm,
    );
  }

  static deleteSignage(signageId: number) {
    return HttpClient.delete(`${this.basePath}/${signageId}`);
  }

  static uploadSignageImage(signageId: number, signageImage: FormData) {
    return HttpClient.post<Signage>(
      `${this.basePath}/${signageId}/image`,
      signageImage,
    );
  }
}
