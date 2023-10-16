import {
  LiteFestivalActivity,
  FestivalActivity,
} from "@overbookd/festival-activity";
import { FestivalActivityRepository } from "./festival-activity.repository";
import { Period } from "@overbookd/period";

const barbecue25eme: FestivalActivity = {
  id: 1,
  status: "DRAFT",
  general: {
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
  },
  inCharge: {
    adherent: {
      id: 2,
      lastname: "Mouyno",
      firstname: "Lea",
    },
    team: "vieux",
    contractors: [],
  },
  signa: {
    location: "Devant le QG",
    signages: [],
  },
  security: {
    specialNeed: null,
  },
  supply: {
    electricity: [],
    water: null,
  },
  inquiry: {
    timeWindows: [],
    gears: [],
    electricity: [],
    barriers: [],
  },
};

const escapeGame: FestivalActivity = {
  id: 2,
  status: "IN_REVIEW",
  general: {
    name: "Escape Game",
    description: "Un escape game pour les enfants",
    categories: ["ENFANTS"],
    toPublish: true,
    photoLink: "https://lien-photo-escape-game.jpg",
    isFlagship: true,
    timeWindows: [
      Period.init({
        start: new Date("2023-05-15 13:00"),
        end: new Date("2023-05-15 18:00"),
      }),
    ],
  },
  inCharge: {
    adherent: {
      id: 1,
      lastname: "Ertsemud",
      firstname: "Noel",
    },
    team: "culture",
    contractors: [],
  },
  signa: {
    location: "CGU",
    signages: [],
  },
  security: {
    specialNeed: null,
  },
  supply: {
    electricity: [],
    water: null,
  },
  inquiry: {
    timeWindows: [],
    gears: [],
    electricity: [],
    barriers: [],
  },
};

const festivalActivities: FestivalActivity[] = [escapeGame, barbecue25eme];

export class InMemoryFestivalActivityRepository
  implements FestivalActivityRepository
{
  private readonly festivalActivities: FestivalActivity[] = festivalActivities;

  findAll(): Promise<LiteFestivalActivity[]> {
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
}
