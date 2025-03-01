import { IProvidePeriod } from "@overbookd/time";
import { FestivalActivity } from "../../festival-activity.js";
import { InquiryRequest } from "../../../common/inquiry-request.js";
import { TimeWindow } from "../../../common/time-window.js";
import { FestivalActivityError } from "../../festival-activity.error.js";
import { TimeWindows } from "./time-windows.js";
import {
  LinkInquiryDrive,
  PrepareInquiryRequestCreation,
  PrepareInquiryRequestUpdating,
} from "../prepare-festival-activity.model.js";
import { AssignDrive } from "../../../common/inquiry-request.js";
import { BARRIERES, ELEC, MATOS } from "../../sections/inquiry.js";
import { WithAtLeastOneItem, updateItemToList } from "@overbookd/list";
import { FestivalTaskError } from "../../../festival-task/festival-task.error.js";
import {
  InquiryAlreadyExists,
  InquiryNotFound,
} from "../../../common/inquiry-request.error.js";

export class AlreadyInitialized extends FestivalActivityError {
  constructor() {
    super("La section Demande de matos a déjà été initialisée");
  }
}

export class NotYetInitialized extends FestivalActivityError {
  constructor() {
    super("La section Demande de matos n'a pas encore été initialisée.");
  }
}

export class CantRemoveLastTimeWindow extends FestivalActivityError {
  constructor() {
    super(
      "Il s'agit du dernier créneau matos. Il n'est pas possible de le supprimer",
    );
  }
}

export class CantRemoveLastRequest extends FestivalActivityError {
  constructor() {
    super(
      "Il s'agit de la dernière demande de matos. Il n'est pas possible de la supprimer",
    );
  }
}

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

  updateRequest({ owner, ...request }: PrepareInquiryRequestUpdating) {
    switch (owner) {
      case MATOS:
        return new Inquiries(
          this.timeWindows,
          this.gears.update(request),
          this.barriers,
          this.electricity,
        );
      case BARRIERES:
        return new Inquiries(
          this.timeWindows,
          this.gears,
          this.barriers.update(request),
          this.electricity,
        );

      case ELEC:
        return new Inquiries(
          this.timeWindows,
          this.gears,
          this.barriers,
          this.electricity.update(request),
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

  updateTimeWindow(id: TimeWindow["id"], period: IProvidePeriod) {
    return new Inquiries(
      this.timeWindows.update(id, period),
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

  add(
    inquiry: InquiryRequest,
  ): InquiryRequests<WithAtLeastOneItem<InquiryRequest>> {
    const alreadyExists = this.inquiries.some(
      ({ slug }) => slug === inquiry.slug,
    );
    if (alreadyExists) throw new InquiryAlreadyExists(inquiry.name);

    return new InquiryRequests([inquiry, ...this.inquiries]);
  }

  update(
    inquiry: InquiryRequest,
  ): InquiryRequests<WithAtLeastOneItem<InquiryRequest>> {
    const inquiryIndex = this.inquiries.findIndex(
      ({ slug }) => slug === inquiry.slug,
    );
    if (inquiryIndex === -1) throw new InquiryNotFound(inquiry.name);

    const inquiries = updateItemToList(
      this.inquiries,
      inquiryIndex,
      inquiry,
    ) as WithAtLeastOneItem<InquiryRequest>;

    return new InquiryRequests(inquiries);
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
      throw new FestivalTaskError("Aucune demande de matos ne corresond");
    }

    const inquiries = updateItemToList(this.inquiries, inquiryIndex, {
      ...inquiry,
      drive,
    });

    return new InquiryRequests(inquiries);
  }
}
