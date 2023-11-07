import { Prepare } from "./prepare-festival-activity";
import { SlugifyService } from "@overbookd/slugify";
import { Duration, IProvidePeriod, Period } from "@overbookd/period";
import {
  Adherent,
  Contractor,
  Draft,
  ElectricityConnection,
  ElectricitySupply,
  InquiryRequest,
  TimeWindow,
} from "../festival-activity";
import {
  ContractorNotFound,
  ElectricitySupplyAlreadyExists,
  ElectricitySupplyNotFound,
  InquiryAlreadyExists,
  TimeWindowAlreadyExists,
} from "../festival-activity.error";
import {
  PrepareGeneralUpdate,
  PrepareSignaUpdate,
  PrepareSecurityUpdate,
  PrepareSupplyUpdate,
  PrepareInChargeUpdate,
  PrepareContractorCreation,
  PrepareElectricitySupplyCreation,
  PrepareElectricitySupplyUpdate,
  PrepareContractorUpdate,
  PrepareInquiryRequestCreation,
} from "./prepare-festival-activity.model";
import { updateItemToList } from "@overbookd/list";

type PrepareInChargeFormWithAdherent = Omit<
  PrepareInChargeUpdate,
  "adherentId"
> & {
  adherent?: Adherent;
};

export class PrepareDraftFestivalActivity implements Prepare<Draft> {
  private constructor(private readonly activity: Draft) {}

  static build(activity: Draft): PrepareDraftFestivalActivity {
    return new PrepareDraftFestivalActivity(activity);
  }

  updateGeneral(form: PrepareGeneralUpdate): Draft {
    const privateFestivalActivity = {
      toPublish: false,
      photoLink: null,
      isFlagship: false,
    };
    const cleanedUpdate =
      form.toPublish === false ? { ...form, ...privateFestivalActivity } : form;

    const general = { ...this.activity.general, ...cleanedUpdate };
    return { ...this.activity, general };
  }

  addGeneralTimeWindow(period: IProvidePeriod): Draft {
    const timeWindows = TimeWindows.build(
      this.activity.general.timeWindows,
    ).add(period, this.activity.id).entries;

    const general = { ...this.activity.general, timeWindows };
    return { ...this.activity, general };
  }

  removeGeneralTimeWindow(id: TimeWindow["id"]): Draft {
    const timeWindows = TimeWindows.build(
      this.activity.general.timeWindows,
    ).remove(id).entries;

    const general = { ...this.activity.general, timeWindows };
    return { ...this.activity, general };
  }

  updateInCharge(form: PrepareInChargeFormWithAdherent): Draft {
    const inCharge = { ...this.activity.inCharge, ...form };
    return { ...this.activity, inCharge };
  }

  addContractor(contractor: PrepareContractorCreation): Draft {
    const contractors = Contractors.build(
      this.activity.inCharge.contractors,
    ).add(contractor, this.activity.id).entries;

    const inCharge = { ...this.activity.inCharge, contractors };
    return { ...this.activity, inCharge };
  }

  updateContractor(contractor: PrepareContractorUpdate): Draft {
    const contractors = Contractors.build(
      this.activity.inCharge.contractors,
    ).update(contractor).entries;

    const inCharge = { ...this.activity.inCharge, contractors };
    return { ...this.activity, inCharge };
  }

  removeContractor(contractorId: Contractor["id"]): Draft {
    const contractors = Contractors.build(
      this.activity.inCharge.contractors,
    ).remove(contractorId).entries;

    const inCharge = { ...this.activity.inCharge, contractors };
    return { ...this.activity, inCharge };
  }

  updateSigna(form: PrepareSignaUpdate): Draft {
    const signa = { ...this.activity.signa, ...form };
    return { ...this.activity, signa };
  }

  updateSecurity(form: PrepareSecurityUpdate): Draft {
    const security = { ...this.activity.security, ...form };
    return { ...this.activity, security };
  }

  updateSupply(form: PrepareSupplyUpdate): Draft {
    const supply = { ...this.activity.supply, ...form };
    return { ...this.activity, supply };
  }

  addElectricitySupply(
    electricitySupply: PrepareElectricitySupplyCreation,
  ): Draft {
    const electricity = ElectricitySupplies.build(
      this.activity.supply.electricity,
    ).add(electricitySupply, this.activity.id).entries;

    const supply = { ...this.activity.supply, electricity };
    return { ...this.activity, supply };
  }

  updateElectricitySupply(
    electricitySupply: PrepareElectricitySupplyUpdate,
  ): Draft {
    const electricity = ElectricitySupplies.build(
      this.activity.supply.electricity,
    ).update(electricitySupply).entries;

    const supply = { ...this.activity.supply, electricity };
    return { ...this.activity, supply };
  }

  removeElectricitySupply(electricitySupplyId: ElectricitySupply["id"]): Draft {
    const electricity = ElectricitySupplies.build(
      this.activity.supply.electricity,
    ).remove(electricitySupplyId).entries;

    const supply = { ...this.activity.supply, electricity };
    return { ...this.activity, supply };
  }

  addInquiryTimeWindow(period: IProvidePeriod): Draft {
    const timeWindows = TimeWindows.build(
      this.activity.inquiry.timeWindows,
    ).add(period, this.activity.id).entries;

    const inquiry = { ...this.activity.inquiry, timeWindows };
    return { ...this.activity, inquiry };
  }

  removeInquiryTimeWindow(id: TimeWindow["id"]): Draft {
    const timeWindows = TimeWindows.build(
      this.activity.inquiry.timeWindows,
    ).remove(id).entries;

    const inquiry = { ...this.activity.inquiry, timeWindows };
    return { ...this.activity, inquiry };
  }

  addGearInquiry(gear: PrepareInquiryRequestCreation): Draft {
    const gears = Inquiries.build(this.activity.inquiry.gears).add(
      gear,
    ).entries;

    const inquiry = { ...this.activity.inquiry, gears };
    return { ...this.activity, inquiry };
  }

  removeGearInquiry(slug: InquiryRequest["slug"]): Draft {
    const gears = Inquiries.build(this.activity.inquiry.gears).remove(
      slug,
    ).entries;

    const inquiry = { ...this.activity.inquiry, gears };
    return { ...this.activity, inquiry };
  }

  addBarrierInquiry(barrier: PrepareInquiryRequestCreation): Draft {
    const barriers = Inquiries.build(this.activity.inquiry.barriers).add(
      barrier,
    ).entries;

    const inquiry = { ...this.activity.inquiry, barriers };
    return { ...this.activity, inquiry };
  }

  removeBarrierInquiry(slug: InquiryRequest["slug"]): Draft {
    const barriers = Inquiries.build(this.activity.inquiry.barriers).remove(
      slug,
    ).entries;

    const inquiry = { ...this.activity.inquiry, barriers };
    return { ...this.activity, inquiry };
  }

  addElectricityInquiry(electricity: PrepareInquiryRequestCreation): Draft {
    const electricityInquiries = Inquiries.build(
      this.activity.inquiry.electricity,
    ).add(electricity).entries;

    const inquiry = {
      ...this.activity.inquiry,
      electricity: electricityInquiries,
    };
    return { ...this.activity, inquiry };
  }

  removeElectricityInquiry(slug: InquiryRequest["slug"]): Draft {
    const electricityInquiries = Inquiries.build(
      this.activity.inquiry.electricity,
    ).remove(slug).entries;

    const inquiry = {
      ...this.activity.inquiry,
      electricity: electricityInquiries,
    };
    return { ...this.activity, inquiry };
  }
}

class TimeWindows {
  private constructor(private readonly timeWindows: TimeWindow[]) {}

  get entries(): TimeWindow[] {
    return this.timeWindows;
  }

  static build(timeWindows: TimeWindow[]): TimeWindows {
    return new TimeWindows(timeWindows);
  }

  add(period: IProvidePeriod, faId: number): TimeWindows {
    const { start, end } = Period.init(period);
    const id = this.generateTimeWindowId(faId, { start, end });
    const timeWindow = { id, start, end };

    const alreadyExists = this.timeWindows.some((tw) => tw.id === id);
    if (alreadyExists) throw new TimeWindowAlreadyExists();

    return new TimeWindows([...this.timeWindows, timeWindow]);
  }

  remove(id: TimeWindow["id"]): TimeWindows {
    return new TimeWindows(this.timeWindows.filter((tw) => tw.id !== id));
  }

  private generateTimeWindowId(faId: number, period: IProvidePeriod): string {
    const { start, end } = period;
    const startMinutes = Duration.ms(start.getTime()).inMinutes;
    const endMinutes = Duration.ms(end.getTime()).inMinutes;

    return `${faId}-${startMinutes}-${endMinutes}`;
  }
}

class Contractors {
  private constructor(private readonly contractors: Contractor[]) {}

  get entries(): Contractor[] {
    return this.contractors;
  }

  static build(contractors: Contractor[]): Contractors {
    return new Contractors(contractors);
  }

  add(form: PrepareContractorCreation, faId: number): Contractors {
    const id = this.generateContractorId(faId);
    const contractor = {
      ...form,
      id,
      email: form.email ?? null,
      company: form.company ?? null,
      comment: form.comment ?? null,
    };

    return new Contractors([...this.contractors, contractor]);
  }

  update(contractor: PrepareContractorUpdate): Contractors {
    const currentContractorIndex = this.contractors.findIndex(
      (c) => c.id === contractor.id,
    );
    const currentContractor = this.contractors.at(currentContractorIndex);
    if (currentContractorIndex === -1 || !currentContractor) {
      throw new ContractorNotFound();
    }

    const updatedContractor = {
      ...currentContractor,
      ...contractor,
    };

    const contractors = updateItemToList(
      this.contractors,
      currentContractorIndex,
      updatedContractor,
    );
    return new Contractors(contractors);
  }

  remove(id: TimeWindow["id"]): Contractors {
    return new Contractors(this.contractors.filter((tw) => tw.id !== id));
  }

  private generateContractorId(faId: number): string {
    const lastContractor = this.contractors.at(-1);

    if (!lastContractor) return `${faId}-1`;

    const lastId = lastContractor.id.split("-")[1];
    const newId = +lastId + 1;

    return `${faId}-${newId}`;
  }
}

class ElectricitySupplies {
  private constructor(
    private readonly electricitySupplies: ElectricitySupply[],
  ) {}

  get entries(): ElectricitySupply[] {
    return this.electricitySupplies;
  }

  static build(supplies: ElectricitySupply[]): ElectricitySupplies {
    return new ElectricitySupplies(supplies);
  }

  add(
    form: PrepareElectricitySupplyCreation,
    faId: number,
  ): ElectricitySupplies {
    const id = this.generateElectricitySupplyId(
      faId,
      form.device,
      form.connection,
    );
    const comment = form.comment ?? null;
    const supply = { ...form, id, comment };

    this.throwIfAlreadyExists(id);

    return new ElectricitySupplies([...this.electricitySupplies, supply]);
  }

  update(form: PrepareElectricitySupplyUpdate): ElectricitySupplies {
    const currentSupplyIndex = this.electricitySupplies.findIndex(
      (es) => es.id === form.id,
    );
    const currentSupply = this.electricitySupplies.at(currentSupplyIndex);
    if (currentSupplyIndex === -1 || !currentSupply) {
      throw new ElectricitySupplyNotFound();
    }

    const updatedSupply = this.generateUpdatedSupply(currentSupply, form);

    this.throwIfAlreadyExists(updatedSupply.id);
    const electricitySupplies = updateItemToList(
      this.electricitySupplies,
      currentSupplyIndex,
      updatedSupply,
    );
    return new ElectricitySupplies(electricitySupplies);
  }

  remove(id: ElectricitySupply["id"]): ElectricitySupplies {
    return new ElectricitySupplies(
      this.electricitySupplies.filter((es) => es.id !== id),
    );
  }

  private generateElectricitySupplyId(
    faId: number,
    device: string,
    connection: ElectricityConnection,
  ): string {
    const supplyId = SlugifyService.apply(`${device} ${connection}`);
    return `${faId}-${supplyId}`;
  }

  private throwIfAlreadyExists(id: string) {
    const alreadyExists = this.electricitySupplies.some((es) => es.id === id);
    if (alreadyExists) throw new ElectricitySupplyAlreadyExists();
  }

  private generateUpdatedSupply(
    previousSupply: ElectricitySupply,
    form: PrepareElectricitySupplyUpdate,
  ): ElectricitySupply {
    const updatedSupply = {
      ...previousSupply,
      connection: form.connection ?? previousSupply.connection,
      device: form.device ?? previousSupply.device,
      power: form.power ?? previousSupply.power,
      count: form.count ?? previousSupply.count,
      comment: form.comment === undefined ? previousSupply.comment : null,
    };

    const faId = +previousSupply.id.split("-")[0];
    const id = this.generateElectricitySupplyId(
      faId,
      updatedSupply.device,
      updatedSupply.connection,
    );

    return { ...updatedSupply, id };
  }
}

class Inquiries {
  private constructor(private readonly inquiries: InquiryRequest[]) {}

  get entries(): InquiryRequest[] {
    return this.inquiries;
  }

  static build(inquiries: InquiryRequest[]): Inquiries {
    return new Inquiries(inquiries);
  }

  add({ slug, quantity, name }: PrepareInquiryRequestCreation): Inquiries {
    const inquiry = { slug, quantity, name };

    const alreadyExists = this.inquiries.some((inq) => inq.slug === slug);
    if (alreadyExists) throw new InquiryAlreadyExists();

    return new Inquiries([...this.inquiries, inquiry]);
  }

  remove(slug: InquiryRequest["slug"]): Inquiries {
    return new Inquiries(this.inquiries.filter((inq) => inq.slug !== slug));
  }
}
