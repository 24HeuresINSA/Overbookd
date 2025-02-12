import { FestivalActivity } from "@overbookd/festival-event";

export type PreviewForSigna = {
  id: FestivalActivity["id"];
  name: FestivalActivity["general"]["name"];
  team: FestivalActivity["inCharge"]["team"];
  location: FestivalActivity["signa"]["location"];
  signages: FestivalActivity["signa"]["signages"];
};

export class SignaPreview {
  static toCsv(previews: PreviewForSigna[]): string {
    const csvHeader = [
      "Id FA",
      "Nom FA",
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
          preview.team,
          preview.location?.name ?? "",
          signage.catalogItem?.name ?? "",
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
