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
  Signage,
  TimeWindow,
  WithInquiries,
} from "../festival-activity";
import {
  ContractorNotFound,
  ElectricitySupplyAlreadyExists,
  ElectricitySupplyNotFound,
  InquiryAlreadyExists,
  SignageAlreadyExists,
  SignageNotFound,
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
  MATOS,
  BARRIERES,
  ELEC,
  PrepareSignageCreation,
  PrepareSignageUpdate,
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
    ).add(period).entries;

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
    ).add(contractor).entries;

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

  addSignage(signage: PrepareSignageCreation): Draft {
    const signages = Signages.build(this.activity.signa.signages).add(
      signage,
    ).entries;

    const signa = { ...this.activity.signa, signages };
    return { ...this.activity, signa };
  }

  updateSignage(signage: PrepareSignageUpdate): Draft {
    const signages = Signages.build(this.activity.signa.signages).update(
      signage,
    ).entries;

    const signa = { ...this.activity.signa, signages };
    return { ...this.activity, signa };
  }

  removeSignage(id: Signage["id"]): Draft {
    const signages = Signages.build(this.activity.signa.signages).remove(
      id,
    ).entries;

    const signa = { ...this.activity.signa, signages };
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
    ).add(electricitySupply).entries;

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
    ).add(period).entries;

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

  addInquiry(form: PrepareInquiryRequestCreation): Draft {
    const { owner, ...inquiryToAdd } = form;
    const updatedInquiry = this.addInquiryToOwnerSection(owner, inquiryToAdd);
    const inquiry = { ...this.activity.inquiry, ...updatedInquiry };

    return { ...this.activity, inquiry };
  }

  private addInquiryToOwnerSection(
    owner: PrepareInquiryRequestCreation["owner"],
    inquiry: InquiryRequest,
  ): { [key in keyof WithInquiries]?: [InquiryRequest, ...InquiryRequest[]] } {
    const { section, inquiries } = this.findOwnerSection(owner);
    return { [section]: Inquiries.build(inquiries).add(inquiry).entries };
  }

  private findOwnerSection(owner: PrepareInquiryRequestCreation["owner"]): {
    section: keyof WithInquiries;
    inquiries: InquiryRequest[];
  } {
    const inquiry = this.activity.inquiry;
    switch (owner) {
      case MATOS:
        return { section: "gears", inquiries: inquiry.gears };
      case BARRIERES:
        return { section: "barriers", inquiries: inquiry.barriers };
      case ELEC:
        return { section: "electricity", inquiries: inquiry.electricity };
    }
  }

  removeInquiry(slug: InquiryRequest["slug"]): Draft {
    const inquiry = this.activity.inquiry;
    const [gears, barriers, electricity] = [
      inquiry.gears,
      inquiry.barriers,
      inquiry.electricity,
    ].map((inquiries) => Inquiries.build(inquiries).remove(slug).entries);

    return {
      ...this.activity,
      inquiry: {
        ...this.activity.inquiry,
        gears,
        barriers,
        electricity,
      },
    };
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

  add(period: IProvidePeriod): TimeWindows {
    const { start, end } = Period.init(period);
    const id = this.generateTimeWindowId({ start, end });
    const timeWindow = { id, start, end };

    const alreadyExists = this.timeWindows.some((tw) => tw.id === id);
    if (alreadyExists) throw new TimeWindowAlreadyExists();

    return new TimeWindows([...this.timeWindows, timeWindow]);
  }

  remove(id: TimeWindow["id"]): TimeWindows {
    return new TimeWindows(this.timeWindows.filter((tw) => tw.id !== id));
  }

  private generateTimeWindowId(period: IProvidePeriod): TimeWindow["id"] {
    const { start, end } = period;
    const startMinutes = Duration.ms(start.getTime()).inMinutes;
    const endMinutes = Duration.ms(end.getTime()).inMinutes;

    return `${startMinutes}-${endMinutes}`;
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

  add(form: PrepareContractorCreation): Contractors {
    const id = this.generateContractorId();
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

    const updatedContractor = this.generateUpdatedContractor(
      currentContractor,
      contractor,
    );

    const contractors = updateItemToList(
      this.contractors,
      currentContractorIndex,
      updatedContractor,
    );
    return new Contractors(contractors);
  }

  remove(id: Contractor["id"]): Contractors {
    return new Contractors(this.contractors.filter((c) => c.id !== id));
  }

  private generateContractorId(): Contractor["id"] {
    const lastContractorId = this.contractors.at(-1)?.id ?? 0;
    return lastContractorId + 1;
  }

  private generateUpdatedContractor(
    previousContractor: Contractor,
    form: PrepareContractorUpdate,
  ): Contractor {
    const updatedContractor = {
      ...previousContractor,
      firstname: form.firstname ?? previousContractor.firstname,
      lastname: form.lastname ?? previousContractor.lastname,
      phone: form.phone ?? previousContractor.phone,
      email: form.email === undefined ? previousContractor.email : form.email,
      company:
        form.company === undefined ? previousContractor.company : form.company,
      comment:
        form.comment === undefined ? previousContractor.comment : form.comment,
    };

    return updatedContractor;
  }
}

class Signages {
  private constructor(private readonly signages: Signage[]) {}

  get entries(): Signage[] {
    return this.signages;
  }

  static build(signages: Signage[]): Signages {
    return new Signages(signages);
  }

  add(form: PrepareSignageCreation): Signages {
    const id = this.generateSignageId(form.type, form.text, form.size);
    const signage = {
      ...form,
      id,
      comment: form.comment ?? null,
    };

    this.throwIfAlreadyExists(id);

    return new Signages([...this.signages, signage]);
  }

  update(form: PrepareSignageUpdate): Signages {
    const currentSignageIndex = this.signages.findIndex(
      (signage) => signage.id === form.id,
    );
    const currentSignage = this.signages.at(currentSignageIndex);
    if (currentSignageIndex === -1 || !currentSignage) {
      throw new SignageNotFound();
    }

    const updatedSignage = this.generateUpdatedSignage(currentSignage, form);
    if (updatedSignage.id !== currentSignage.id) {
      this.throwIfAlreadyExists(updatedSignage.id);
    }

    const signages = updateItemToList(
      this.signages,
      currentSignageIndex,
      updatedSignage,
    );
    return new Signages(signages);
  }

  remove(id: Signage["id"]): Signages {
    return new Signages(this.signages.filter((s) => s.id !== id));
  }

  private generateUpdatedSignage(
    previousSignage: Signage,
    form: PrepareSignageUpdate,
  ): Signage {
    const updatedSignage = {
      ...previousSignage,
      text: form.text ?? previousSignage.text,
      quantity: form.quantity ?? previousSignage.quantity,
      size: form.size ?? previousSignage.size,
      type: form.type ?? previousSignage.type,
      comment:
        form.comment === undefined ? previousSignage.comment : form.comment,
    };

    const id = this.generateSignageId(
      updatedSignage.type,
      updatedSignage.text,
      updatedSignage.size,
    );

    return { ...updatedSignage, id };
  }

  private generateSignageId(
    type: Signage["type"],
    text: Signage["text"],
    size: Signage["size"],
  ): string {
    return SlugifyService.apply(`${type} ${text} ${size}`);
  }

  private throwIfAlreadyExists(id: string) {
    const alreadyExists = this.signages.some((signage) => signage.id === id);
    if (alreadyExists) throw new SignageAlreadyExists();
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

  add(form: PrepareElectricitySupplyCreation): ElectricitySupplies {
    const id = this.generateElectricitySupplyId(form.device, form.connection);
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
    device: string,
    connection: ElectricityConnection,
  ): ElectricitySupply["id"] {
    const supplyId = SlugifyService.apply(`${device} ${connection}`);
    return supplyId;
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
      comment:
        form.comment === undefined ? previousSupply.comment : form.comment,
    };

    const id = this.generateElectricitySupplyId(
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

  add({ slug, quantity, name }: InquiryRequest): Inquiries {
    const inquiry = { slug, quantity, name };

    const alreadyExists = this.inquiries.some(
      (inquiry) => inquiry.slug === slug,
    );
    if (alreadyExists) throw new InquiryAlreadyExists();

    return new Inquiries([...this.inquiries, inquiry]);
  }

  remove(slug: InquiryRequest["slug"]): Inquiries {
    return new Inquiries(
      this.inquiries.filter((inquiry) => inquiry.slug !== slug),
    );
  }
}
