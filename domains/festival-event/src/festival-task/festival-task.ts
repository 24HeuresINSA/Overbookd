import { PreviewFestivalActivity } from "../festival-activity/festival-activity";
import { Feedback } from "../common/feedback";
import { DRAFT } from "../common/status";
import { Adherent } from "../common/adherent";
import { TimeWindow } from "../common/time-window";
import { InquiryRequest } from "../common/inquiry-request";
import { Location } from "../common/location";
import { KeyEvent } from "./festival-task.event";

export type FestivalActivity = {
  id: PreviewFestivalActivity["id"];
  name: PreviewFestivalActivity["name"];
  status: PreviewFestivalActivity["status"];
  location: Location | null;
  timeWindows: TimeWindow[];
  hasSupplyRequest: boolean;
  inquiry: {
    timeWindows: TimeWindow[];
    all: InquiryRequest[];
  };
};

export type Contact = Adherent & {
  phone: string;
};

export type Volunteer = Adherent;

export type Conflict = {
  id: FestivalTask["id"];
  name: FestivalTask["general"]["name"];
};

type WithConflicts = {
  conflicts: Conflict[];
};

export type VolunteerWithConflicts = Volunteer & WithConflicts;

export type VolunteerMobilization = Volunteer | VolunteerWithConflicts;

export type TeamMobilization = { count: number; team: string };

export type Mobilization<
  T extends VolunteerMobilization = VolunteerWithConflicts,
> = TimeWindow & {
  volunteers: T[];
  teams: TeamMobilization[];
  durationSplitInHour: null | number;
};

export type Draft<
  M extends Mobilization<VolunteerMobilization> = Mobilization,
> = {
  id: number;
  status: typeof DRAFT;
  general: {
    name: string;
    administrator: Adherent;
    team: string | null;
  };
  festivalActivity: FestivalActivity;
  instructions: {
    appointment: Location | null;
    contacts: Contact[];
    global: string | null;
    inCharge: {
      volunteers: Volunteer[];
      instruction: string | null;
    };
  };
  history: KeyEvent[];
  feedbacks: Feedback[];
  mobilizations: M[];
  inquiries: InquiryRequest[];
};

export type FestivalTask<
  M extends Mobilization<VolunteerMobilization> = Mobilization,
> = Draft<M>;

export type PreviewDraft = {
  id: Draft["id"];
  status: Draft["status"];
  name: Draft["general"]["name"];
  administrator: Draft["general"]["administrator"];
  team: Draft["general"]["team"];
};

export type Preview = PreviewDraft;
