import {
  PreviewFestivalActivity,
  FestivalActivity,
  DraftFestivalActivity,
  FestivalActivityFactory,
  CreateFestivalActivity,
} from "@overbookd/festival-activity";
import { FestivalActivityRepository } from "./festival-activity.repository";
import { Period } from "@overbookd/period";
import { updateItemToList } from "@overbookd/list";

const barbecue25emeGeneral = {
  description: "Un barbecue pour les vieux",
  timeWindows: [
    Period.init({
      start: new Date("2023-05-15 10:00"),
      end: new Date("2023-05-15 14:00"),
    }),
  ],
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
  private festivalActivityFactory: FestivalActivityFactory;

  constructor() {
    this.festivalActivityFactory = new FestivalActivityFactory();

    const barbecue25emeCreation = this.festivalActivityFactory.create({
      name: "Barbecue 25eme",
      author: noel,
    });
    const barbecue25eme = DraftFestivalActivity.build({
      ...barbecue25emeCreation,
      general: { ...barbecue25emeCreation.general, ...barbecue25emeGeneral },
      inCharge: { ...barbecue25emeCreation.inCharge, team: "vieux" },
      signa: { ...barbecue25emeCreation.signa, location: "Devant le QG" },
    });

    const escapeGame = this.festivalActivityFactory.create({
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

  create(form: CreateFestivalActivity): Promise<DraftFestivalActivity> {
    const festivalActivityFactory = new FestivalActivityFactory();
    const festivalActivity = festivalActivityFactory.create(form);
    this.festivalActivities = [...this.festivalActivities, festivalActivity];
    return Promise.resolve(festivalActivity);
  }

  save(festivalActivity: FestivalActivity): Promise<FestivalActivity> {
    const festivalActivityIndex = this.festivalActivities.findIndex(
      (festivalActivityToUpdate) =>
        festivalActivityToUpdate.id === festivalActivity.id,
    );
    if (festivalActivityIndex == -1) {
      throw new Error("Festival activity not found");
    }

    this.festivalActivities = updateItemToList(
      this.festivalActivities,
      festivalActivityIndex,
      festivalActivity,
    );
    return Promise.resolve(festivalActivity);
  }
}
