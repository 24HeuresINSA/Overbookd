import { InitInquiry, Prepare } from "./prepare-festival-activity";
import { SlugifyService } from "@overbookd/slugify";
import { IProvidePeriod } from "@overbookd/period";
import {
  Adherent,
  Contractor,
  Draft,
  ElectricitySupply,
  FestivalActivity,
  InquiryRequest,
  Signage,
  TimeWindow,
} from "../festival-activity";
import {
  SignageAlreadyExists,
  SignageNotFound,
} from "../festival-activity.error";
import {
  PrepareGeneralUpdate,
  PrepareSignaUpdate,
  PrepareSupplyUpdate,
  PrepareInChargeUpdate,
  PrepareContractorCreation,
  PrepareElectricitySupplyCreation,
  PrepareElectricitySupplyUpdate,
  PrepareContractorUpdate,
  PrepareInquiryRequestCreation,
  PrepareSignageCreation,
  PrepareSignageUpdate,
} from "./prepare-festival-activity.model";
import { updateItemToList } from "@overbookd/list";
import { TimeWindows } from "./prepare-festival-activity";
import { Contractors } from "./prepare-festival-activity";
import { AlreadyInitialized, Inquiries } from "./inquiries";
import { ElectricitySupplies } from "./prepare-festival-activity";

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

  removeContractor(id: Contractor["id"]): Draft {
    const contractors = Contractors.build(
      this.activity.inCharge.contractors,
    ).remove(id).entries;

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

  updateSecurity(security: FestivalActivity["security"]): Draft {
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

  removeElectricitySupply(id: ElectricitySupply["id"]): Draft {
    const electricity = ElectricitySupplies.build(
      this.activity.supply.electricity,
    ).remove(id).entries;

    const supply = { ...this.activity.supply, electricity };
    return { ...this.activity, supply };
  }

  initInquiry({ timeWindow, request }: InitInquiry): Draft {
    if (Inquiries.alreadyInitialized(this.activity.inquiry)) {
      throw new AlreadyInitialized();
    }
    const inquiry = Inquiries.init()
      .addRequest(request)
      .addTimeWindow(timeWindow).inquiry;
    return { ...this.activity, inquiry };
  }

  addInquiryTimeWindow(period: IProvidePeriod): Draft {
    const inquiry = Inquiries.build(this.activity.inquiry).addTimeWindow(
      period,
    ).inquiry;
    return { ...this.activity, inquiry };
  }

  removeInquiryTimeWindow(id: TimeWindow["id"]): Draft {
    const inquiry = Inquiries.build(this.activity.inquiry).removeTimeWindow(
      id,
    ).inquiry;
    return { ...this.activity, inquiry };
  }

  addInquiry(form: PrepareInquiryRequestCreation): Draft {
    const inquiry = Inquiries.build(this.activity.inquiry).addRequest(
      form,
    ).inquiry;

    return { ...this.activity, inquiry };
  }

  removeInquiry(slug: InquiryRequest["slug"]): Draft {
    const inquiry = Inquiries.build(this.activity.inquiry).removeRequest(
      slug,
    ).inquiry;

    return { ...this.activity, inquiry };
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
