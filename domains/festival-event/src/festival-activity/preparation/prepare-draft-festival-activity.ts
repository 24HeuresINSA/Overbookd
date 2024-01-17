import { InitInquiry, Prepare } from "./prepare-festival-activity";
import { IProvidePeriod } from "@overbookd/period";
import { Draft } from "../festival-activity";
import { InquiryRequest } from "../../common/inquiry-request";
import { ElectricitySupply } from "../sections/supply";
import { Signage } from "../sections/signa";
import { Contractor } from "../sections/in-charge";
import { TimeWindow } from "../../common/time-window";
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
  PrepareSecurityUpdate,
} from "./prepare-festival-activity.model";
import { TimeWindows } from "./section-aggregates/time-windows";
import { Contractors } from "./section-aggregates/contractors";
import { AlreadyInitialized, Inquiries } from "./section-aggregates/inquiries";
import { ElectricitySupplies } from "./section-aggregates/electricity-supplies";
import { Signages } from "./section-aggregates/signages";
import {
  FestivalActivityError,
  FreePassMustBePositive,
} from "../festival-activity.error";

export class AssignDriveInDraftActivity extends FestivalActivityError {
  constructor() {
    super(
      "❌ Il n'est pas possible d'attribuer un lieu à une demande de matos dans une FA en brouillon",
    );
  }
}

export class AssignCatalogItemInDraftActivity extends FestivalActivityError {
  constructor() {
    super(
      "❌ Il n'est pas possible d'attribuer une signalétique du catalogue à une demande de signalétique dans une FA en brouillon",
    );
  }
}

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

  updateInCharge(form: PrepareInChargeUpdate): Draft {
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

  linkSignageToCatalogItem(): Draft {
    throw new AssignCatalogItemInDraftActivity();
  }

  updateSecurity(form: PrepareSecurityUpdate): Draft {
    const security = { ...this.activity.security, ...form };
    if (security.freePass < 0) throw new FreePassMustBePositive();
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

  clearInquiry(): Draft {
    const inquiry = Inquiries.init().inquiry;
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

  assignInquiryToDrive(): Draft {
    throw new AssignDriveInDraftActivity();
  }
}
