import { BaseSignage, FestivalActivity } from "@overbookd/festival-event";
import { statusLabels } from "@overbookd/festival-event-constants";
import { CSVBuilder } from "@overbookd/csv";

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
    const data = previews.flatMap((preview) => {
      return preview.signages.flatMap((signage) => {
        const { id, name, status: rawStatus, team, locationName } = preview;
        const status = statusLabels.get(rawStatus);
        const activity = { id, name, status, team, locationName };
        return { signage, activity };
      });
    });

    return CSVBuilder.from(data)
      .select([
        "activity.id",
        "activity.name",
        "activity.status",
        "activity.team",
        "activity.locationName",
        "signage.catalogName",
        "signage.type",
        "signage.quantity",
        "signage.text",
        "signage.size",
        "signage.comment",
      ])
      .translate([
        ["activity.id", "Id FA"],
        ["activity.name", "Nom FA"],
        ["activity.status", "Statut FA"],
        ["activity.team", "Équipe"],
        ["activity.locationName", "Lieu"],
        ["signage.catalogName", "Nom catalogue"],
        ["signage.type", "Type"],
        ["signage.quantity", "Quantité"],
        ["signage.text", "Texte"],
        ["signage.size", "Taille"],
        ["signage.comment", "Commentaire"],
      ])
      .build();
  }
}
