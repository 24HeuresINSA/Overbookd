import { IProvidePeriod } from "@overbookd/period";
import { FestivalActivity } from "../../festival-activity";
import { InquiryRequest } from "../../sections/inquiry";
import { TimeWindow } from "../../sections/time-window";
import {
  FestivalActivityError,
  InquiryAlreadyExists,
} from "../../festival-activity.error";
import { TimeWindows } from "./time-windows";
import {
  AssignDrive,
  LinkInquiryDrive,
  PrepareInquiryRequestCreation,
} from "../prepare-festival-activity.model";
import { BARRIERES, ELEC, MATOS } from "../../sections/inquiry";
import { updateItemToList } from "@overbookd/list";

export class AlreadyInitialized extends FestivalActivityError {
  constructor() {
    super("❌ La section Demande de matos a déjà été initialisée");
  }
}

export class NotYetInitialized extends FestivalActivityError {
  constructor() {
    super("❌ La section Demande de matos n'a pas encore été initialisée.");
  }
}

export class CantRemoveLastTimeWindow extends FestivalActivityError {
  constructor() {
    super(
      "❌ Il s'agit du dernier créneau matos. Il n'est pas possible de le supprimer",
    );
  }
}

export class CantRemoveLastRequest extends FestivalActivityError {
  constructor() {
    super(
      "❌ Il s'agit de la dernière demande de matos. Il n'est pas possible de la supprimer",
    );
  }
}

type WithAtLeastOneItem<T> = [T, ...T[]];
type MaybeWithOneItem<T> = T[] | WithAtLeastOneItem<T>;

export class Inquiries<
  T extends MaybeWithOneItem<TimeWindow>,
  Gears extends MaybeWithOneItem<InquiryRequest>,
  Barriers extends MaybeWithOneItem<InquiryRequest>,
  Electricity extends MaybeWithOneItem<InquiryRequest>,
> {
  private constructor(
    private readonly timeWindows: TimeWindows<T>,
    private readonly gears: InquiryRequests<Gears>,
    private readonly barriers: InquiryRequests<Barriers>,
    private readonly electricity: InquiryRequests<Electricity>,
  ) {}

  get inquiry() {
    return {
      timeWindows: this.timeWindows.entries,
      gears: this.gears.entries,
      barriers: this.barriers.entries,
      electricity: this.electricity.entries,
    };
  }

  static build({
    timeWindows,
    gears,
    barriers,
    electricity,
  }: FestivalActivity["inquiry"]) {
    return new Inquiries(
      TimeWindows.build(timeWindows),
      InquiryRequests.build(gears),
      InquiryRequests.build(barriers),
      InquiryRequests.build(electricity),
    );
  }

  static init() {
    return new Inquiries(
      TimeWindows.build([]),
      InquiryRequests.build([]),
      InquiryRequests.build([]),
      InquiryRequests.build([]),
    );
  }

  static alreadyInitialized(inquiry: FestivalActivity["inquiry"]): boolean {
    const hasTimeWindows = inquiry.timeWindows.length > 0;
    const requests = [
      ...inquiry.gears,
      ...inquiry.barriers,
      ...inquiry.electricity,
    ];
    const hasRequests = requests.length > 0;

    return hasTimeWindows || hasRequests;
  }

  addRequest({ owner, ...request }: PrepareInquiryRequestCreation) {
    switch (owner) {
      case MATOS:
        return new Inquiries(
          this.timeWindows,
          this.gears.add(request),
          this.barriers,
          this.electricity,
        );
      case BARRIERES:
        return new Inquiries(
          this.timeWindows,
          this.gears,
          this.barriers.add(request),
          this.electricity,
        );

      case ELEC:
        return new Inquiries(
          this.timeWindows,
          this.gears,
          this.barriers,
          this.electricity.add(request),
        );
    }
  }

  removeRequest(slug: InquiryRequest["slug"]) {
    return new Inquiries(
      this.timeWindows,
      this.gears.remove(slug),
      this.barriers.remove(slug),
      this.electricity.remove(slug),
    );
  }

  addTimeWindow(timeWindow: IProvidePeriod) {
    return new Inquiries(
      this.timeWindows.add(timeWindow),
      this.gears,
      this.barriers,
      this.electricity,
    );
  }

  removeTimeWindow(id: TimeWindow["id"]) {
    return new Inquiries(
      this.timeWindows.remove(id),
      this.gears,
      this.barriers,
      this.electricity,
    );
  }

  assignDrive({ owner, ...assign }: LinkInquiryDrive) {
    switch (owner) {
      case MATOS:
        return new Inquiries(
          this.timeWindows,
          this.gears.assignDrive(assign),
          this.barriers,
          this.electricity,
        );
      case BARRIERES:
        return new Inquiries(
          this.timeWindows,
          this.gears,
          this.barriers.assignDrive(assign),
          this.electricity,
        );

      case ELEC:
        return new Inquiries(
          this.timeWindows,
          this.gears,
          this.barriers,
          this.electricity.assignDrive(assign),
        );
    }
  }
}

class InquiryRequests<T extends MaybeWithOneItem<InquiryRequest>> {
  private constructor(private readonly inquiries: T) {}

  get entries(): T {
    return this.inquiries;
  }

  static build(inquiries: MaybeWithOneItem<InquiryRequest>) {
    return new InquiryRequests(inquiries);
  }

  add({
    slug,
    quantity,
    name,
  }: InquiryRequest): InquiryRequests<WithAtLeastOneItem<InquiryRequest>> {
    const inquiry = { slug, quantity, name };

    const alreadyExists = this.inquiries.some(
      (inquiry) => inquiry.slug === slug,
    );
    if (alreadyExists) throw new InquiryAlreadyExists();

    return new InquiryRequests([inquiry, ...this.inquiries]);
  }

  remove(slug: InquiryRequest["slug"]): InquiryRequests<InquiryRequest[]> {
    return new InquiryRequests(
      this.inquiries.filter((inquiry) => inquiry.slug !== slug),
    );
  }

  assignDrive({ slug, drive }: AssignDrive): InquiryRequests<InquiryRequest[]> {
    const inquiryIndex = this.inquiries.findIndex(
      (inquiry) => inquiry.slug === slug,
    );
    const inquiry = this.inquiries.at(inquiryIndex);
    if (inquiryIndex === -1 || !inquiry) {
      throw new Error();
    }

    const inquiries = updateItemToList(this.inquiries, inquiryIndex, {
      ...inquiry,
      drive,
    });

    return new InquiryRequests(inquiries);
  }
}
