import {
  PreviewFestivalActivity,
  FestivalActivity,
  DraftFestivalActivity,
  FestivalActivityFactory,
} from "@overbookd/festival-activity";
import { FestivalActivityRepository } from "./festival-activity.repository";
import { Period } from "@overbookd/period";

const barbecue25emeGeneral = {
  name: "Barbecue 25eme",
  description: "Un barbecue pour les vieux",
  categories: [],
  toPublish: false,
  photoLink: null,
  isFlagship: false,
  timeWindows: [
    Period.init({
      start: new Date("2023-05-15 10:00"),
      end: new Date("2023-05-15 14:00"),
    }),
  ],
};

const barbecue25emeSigna = {
  location: "Devant le QG",
  signages: [],
};

const noel = {
  id: 1,
  lastname: "Ertsemud",
  firstname: "Noel",
};

export class InMemoryFestivalActivityRepository
  implements FestivalActivityRepository
{
  private festivalActivities: FestivalActivity[];

  constructor() {
    const festivalActivityFactory = new FestivalActivityFactory();
    const barbecue25emeCreation = festivalActivityFactory.create({
      name: "Barbecue 25eme",
      author: noel,
    });
    const barbecue25eme = DraftFestivalActivity.build({
      ...barbecue25emeCreation,
      general: barbecue25emeGeneral,
      inCharge: { ...barbecue25emeCreation.inCharge, team: "vieux" },
      signa: barbecue25emeSigna,
    });

    const escapeGame = festivalActivityFactory.create({
      name: "Barbecue 25eme",
      author: noel,
    });

    this.festivalActivities = [escapeGame, barbecue25eme];
  }

  findAll(): Promise<PreviewFestivalActivity[]> {
    return Promise.resolve(
      this.festivalActivities.map((festivalActivity) => ({
        id: festivalActivity.id,
        name: festivalActivity.general.name,
        status: festivalActivity.status,
        adherent: festivalActivity.inCharge.adherent,
        team: festivalActivity.inCharge.team,
      })),
    );
  }

  findById(id: number): Promise<FestivalActivity | null> {
    return Promise.resolve(
      this.festivalActivities.find(
        (festivalActivity) => festivalActivity.id === id,
      ),
    );
  }

  save(festivalActivity: FestivalActivity): Promise<FestivalActivity> {
    const festivalActivityToUpdate = this.findById(festivalActivity.id);
    if (!festivalActivityToUpdate) {
      throw new Error("Festival activity not found");
    }

    const updatedFestivalActivity = {
      ...festivalActivityToUpdate,
      ...festivalActivity,
    };
    this.festivalActivities = this.festivalActivities.map((festivalActivity) =>
      festivalActivity.id === updatedFestivalActivity.id
        ? updatedFestivalActivity
        : festivalActivity,
    );
    return Promise.resolve(updatedFestivalActivity);
  }
}
