import { PreviewFestivalActivity } from "../festival-activity/festival-activity";
import { Feedback } from "../common/feedback";
import { DRAFT } from "../common/status";
import { Adherent } from "../common/adherent";
import { TimeWindow } from "../common/time-window";
import { InquiryRequest } from "../common/inquiry-request";
import { Location } from "../common/location";
import { CREATED } from "../common/action";

export type FestivalActivity = {
  id: PreviewFestivalActivity["id"];
  name: PreviewFestivalActivity["name"];
  status: PreviewFestivalActivity["status"];
  timeWindows: TimeWindow[];
  inquiry: {
    timeWindows: TimeWindow[];
    all: InquiryRequest[];
  };
};

export type Contact = Adherent & {
  phone: string;
};

export type Volunteer = Adherent;

export type TeamMobilization = { count: number; team: string };

export type Mobilization = TimeWindow & {
  volunteers: Volunteer[];
  teams: TeamMobilization[];
  durationSplitInHour: null | number;
};

export type Draft = {
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
  mobilizations: Mobilization[];
  inquiries: InquiryRequest[];
};

export type FestivalTask = Draft;

export type PreviewDraft = {
  id: Draft["id"];
  status: Draft["status"];
  name: Draft["general"]["name"];
  administrator: Draft["general"]["administrator"];
  team: Draft["general"]["team"];
};

export type Preview = PreviewDraft;

type Action = typeof CREATED;

export type KeyEvent = {
  action: Action;
  by: Preview["administrator"];
  at: Date;
  description: string;
};
