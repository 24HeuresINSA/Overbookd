import { BaseSignage, FestivalActivity } from "@overbookd/festival-event";
import { statusLabels } from "@overbookd/festival-event-constants";

export type PreviewForSigna = {
  id: FestivalActivity["id"];
  name: FestivalActivity["general"]["name"];
  status: FestivalActivity["status"];
  team: FestivalActivity["inCharge"]["team"];
  locationName: FestivalActivity["signa"]["location"]["name"];
  signages: (BaseSignage & { catalogName?: string })[];
};

export class SignaPreview {
  static toCsv(previews: PreviewForSigna[]): string {
    const csvHeader = [
      "Id FA",
      "Nom FA",
      "Statut FA",
      "Equipe",
      "Lieu",
      "Nom catalogue",
      "Type",
      "Quantité",
      "Texte",
      "Taille",
      "Commentaire",
    ].join(";");

    const csvContent = previews.flatMap((preview) => {
      return preview.signages.flatMap((signage) => {
        return [
          preview.id,
          preview.name,
          statusLabels.get(preview.status) ?? "",
          preview.team,
          preview.locationName ?? "",
          signage.catalogName ?? "",
          signage.type,
          signage.quantity,
          signage.text,
          signage.size,
          signage?.comment ?? "",
        ].join(";");
      });
    });

    const csv = [csvHeader, ...csvContent].join("\n");
    const regex = new RegExp(/undefined/i, "g");

    return csv.replace(regex, "");
  }
}
