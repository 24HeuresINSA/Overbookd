import {
  Adherent,
  Contact,
  Feedback,
  FestivalTaskDraft,
  InquiryRequest,
  Location,
} from "@overbookd/festival-event";
import {
  FestivalActivity,
  Mobilization,
} from "@overbookd/festival-event/src/festival-task/festival-task";
import { KeyEvent } from "@overbookd/festival-event/src/festival-task/festival-task.event";

export class DraftFestivalTaskResponseDto implements FestivalTaskDraft {
  id: number;
  status: "DRAFT";
  general: { name: string; administrator: Adherent; team: string };
  festivalActivity: FestivalActivity;
  instructions: {
    appointment: Location;
    contacts: Contact[];
    global: string;
    inCharge: { volunteers: Adherent[]; instruction: string };
  };
  history: KeyEvent[];
  feedbacks: Feedback[];
  mobilizations: Mobilization[];
  gearInquiries: InquiryRequest[];
}
