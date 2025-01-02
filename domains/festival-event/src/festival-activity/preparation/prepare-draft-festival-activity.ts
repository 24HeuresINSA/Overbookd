import { InitInquiry, Prepare } from "./prepare-festival-activity";
import { IProvidePeriod } from "@overbookd/time";
import { Draft } from "../festival-activity.js";
import { ElectricitySupply } from "../sections/supply.js";
import { Signage } from "../sections/signa.js";
import { Contractor } from "../sections/in-charge.js";
import { TimeWindow } from "../../common/time-window.js";
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
  PrepareInquiryRequestRemoving,
} from "./prepare-festival-activity.model.js";
import { TimeWindows } from "./section-aggregates/time-windows.js";
import { Contractors } from "./section-aggregates/contractors.js";
import {
  AlreadyInitialized,
  Inquiries,
} from "./section-aggregates/inquiries.js";
import { ElectricitySupplies } from "./section-aggregates/electricity-supplies.js";
import { Signages } from "./section-aggregates/signages.js";
import {
  FestivalActivityError,
  FreePassMustBePositive,
} from "../festival-activity.error.js";
import { AssignDriveInDraft } from "../../common/inquiry-request.error.js";

export class AssignCatalogItemInDraftActivity extends FestivalActivityError {
  constructor() {
    super(
      "Il n'est pas possible d'attribuer une signalétique du catalogue à une demande de signalétique dans une FA en brouillon",
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

  updateGeneralTimeWindow(id: TimeWindow["id"], period: IProvidePeriod): Draft {
    const timeWindows = TimeWindows.build(
      this.activity.general.timeWindows,
    ).update(id, period).entries;

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

  updateInquiryTimeWindow(id: TimeWindow["id"], period: IProvidePeriod): Draft {
    const inquiry = Inquiries.build(this.activity.inquiry).updateTimeWindow(
      id,
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

  updateInquiry(form: PrepareInquiryRequestCreation): Draft {
    const inquiry = Inquiries.build(this.activity.inquiry).updateRequest(
      form,
    ).inquiry;

    return { ...this.activity, inquiry };
  }

  removeInquiry(form: PrepareInquiryRequestRemoving): Draft {
    const inquiry = Inquiries.build(this.activity.inquiry).removeRequest(
      form.slug,
    ).inquiry;

    return { ...this.activity, inquiry };
  }

  assignInquiryToDrive(): Draft {
    throw new AssignDriveInDraft("FA");
  }
}
