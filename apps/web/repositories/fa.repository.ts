import { NuxtAxiosInstance } from '@nuxtjs/axios';
import {
  Collaborator,
  CreateFa,
  Fa,
  FaElectricityNeed,
  FaGeneralUpdate,
  FaPageId,
  FaSignaNeed,
  FaSignaNeedsExportCsv,
  FaSimplified,
  FaTimeWindow,
  FaValidationBody,
  SearchFa,
  PublicAnimation,
  PublicAnimationCreation,
  PublicAnimationWithFa,
} from '~/utils/models/fa';
import { FeedbackCreation, SavedFeedback } from '~/utils/models/feedback';
import {
  GearRequest,
  GearRequestCreation,
  GearRequestUpdate,
  GearRequestWithDrive,
  StoredGearRequest,
} from '~/utils/models/gearRequests';
import { StatsPayload } from '~/utils/models/stats';
import { HttpStringified } from '~/utils/types/http';

type Context = { $axios: NuxtAxiosInstance };

export class FaRepository {
  private static readonly basePath = 'fa';

  static getAllFas(context: Context, search?: SearchFa) {
    return context.$axios.get<HttpStringified<FaSimplified>[]>(this.basePath, {
      params: search,
    });
  }

  static getFa(context: Context, id: number) {
    return context.$axios.get<HttpStringified<Fa>>(`${this.basePath}/${id}`);
  }

  static createFa(context: Context, FA: CreateFa) {
    return context.$axios.post<HttpStringified<Fa>>(this.basePath, FA);
  }

  static deleteFa(context: Context, id: number) {
    return context.$axios.delete<void>(`${this.basePath}/${id}`);
  }

  static getFaStats(context: Context) {
    return context.$axios.get<StatsPayload>(`${this.basePath}/stats`);
  }

  static updateFa(context: Context, fa: FaGeneralUpdate) {
    return context.$axios.post<HttpStringified<Fa>>(
      `${this.basePath}/${fa.id}`,
      fa
    );
  }

  static updateCollaborator(
    context: Context,
    faId: number,
    collaborator: Collaborator
  ) {
    return context.$axios.post(
      `${this.basePath}/${faId}/collaborator`,
      collaborator
    );
  }

  static deleteCollaborator(context: Context, faId: number) {
    return context.$axios.delete(`${this.basePath}/${faId}/collaborator`);
  }

  static updateSignaNeed(
    context: Context,
    faId: number,
    signaNeed: FaSignaNeed
  ) {
    return context.$axios.post<HttpStringified<FaSignaNeed>>(
      `${this.basePath}/${faId}/signa-need`,
      signaNeed
    );
  }

  static deleteSignaNeed(context: Context, faId: number, snId: number) {
    return context.$axios.delete(`${this.basePath}/${faId}/signa-need/${snId}`);
  }

  static updateAnimationTimeWindow(
    context: Context,
    faId: number,
    timeWindow: FaTimeWindow
  ) {
    return context.$axios.post<HttpStringified<FaTimeWindow>>(
      `${this.basePath}/${faId}/time-window`,
      timeWindow
    );
  }

  static deleteAnimationTimeWindow(
    context: Context,
    faId: number,
    twId: number
  ) {
    return context.$axios.delete(
      `${this.basePath}/${faId}/time-window/${twId}`
    );
  }

  static updateElectricityNeed(
    context: Context,
    faId: number,
    electricityNeed: FaElectricityNeed
  ) {
    return context.$axios.post<HttpStringified<FaElectricityNeed>>(
      `${this.basePath}/${faId}/electricity-need`,
      electricityNeed
    );
  }

  static deleteElectricityNeed(context: Context, faId: number, enId: number) {
    return context.$axios.delete(
      `${this.basePath}/${faId}/electricity-need/${enId}`
    );
  }

  static addFAFeedback(
    context: Context,
    faId: number,
    feedback: FeedbackCreation
  ) {
    return context.$axios.post<HttpStringified<SavedFeedback>>(
      `${this.basePath}/${faId}/feedback`,
      feedback
    );
  }

  static validateFA(context: Context, id: number, body: FaValidationBody) {
    return context.$axios.post<void>(`${this.basePath}/${id}/validation`, body);
  }

  static removeFaValidation(context: Context, faId: number, teamId: number) {
    return context.$axios.delete(
      `${this.basePath}/${faId}/validation/${teamId}`
    );
  }

  static refuseFA(context: Context, id: number, body: FaValidationBody) {
    return context.$axios.post<void>(`${this.basePath}/${id}/refusal`, body);
  }

  static getPreviousFa(context: Context, id: number) {
    return context.$axios.get<FaPageId>(`${this.basePath}/${id}/previous`);
  }

  static getNextFa(context: Context, id: number) {
    return context.$axios.get<FaPageId>(`${this.basePath}/${id}/next`);
  }

  static createGearRequest(
    context: Context,
    animationId: number,
    gearRequestCreationForm: GearRequestCreation
  ) {
    return context.$axios.post<HttpStringified<StoredGearRequest<'FA'>>>(
      `${this.basePath}/${animationId}/gear-requests`,
      gearRequestCreationForm
    );
  }

  static getGearRequests(context: Context, animationId: number) {
    return context.$axios.get<HttpStringified<StoredGearRequest<'FA'>>[]>(
      `${this.basePath}/${animationId}/gear-requests`
    );
  }

  static deleteGearRequest(
    context: Context,
    animationId: number,
    gearId: number,
    rentalPeriodId: number
  ) {
    return context.$axios.delete(
      `${this.basePath}/${animationId}/gear-requests/${gearId}/rental-period/${rentalPeriodId}`
    );
  }

  static updateGearRequest(
    context: Context,
    animationId: number,
    gearId: number,
    rentalPeriodId: number,
    gearRequestUpdateForm: GearRequestUpdate
  ) {
    return context.$axios.patch<GearRequest<'FA'>>(
      `${this.basePath}/${animationId}/gear-requests/${gearId}/rental-period/${rentalPeriodId}`,
      gearRequestUpdateForm
    );
  }

  static addPublicAnimation(
    context: Context,
    publicAnimation: PublicAnimationCreation
  ) {
    return context.$axios.post<HttpStringified<PublicAnimation>>(
      'public-animation',
      publicAnimation
    );
  }

  static updatePublicAnimation(
    context: Context,
    id: number,
    publicAnimation: PublicAnimation
  ) {
    return context.$axios.put<HttpStringified<PublicAnimation>>(
      `public-animation/${id}`,
      publicAnimation
    );
  }

  static deletePublicAnimation(context: Context, id: number) {
    return context.$axios.delete<void>(`public-animation/${id}`);
  }

  static getAllPublicAnimations(context: Context) {
    return context.$axios.get<HttpStringified<PublicAnimationWithFa[]>>(
      'public-animation'
    );
  }

  static validateGearRequest(
    context: Context,
    animationId: number,
    gearRequest: GearRequestWithDrive<'FA' | 'FT'>
  ) {
    const {
      gear: { id: gearId },
      rentalPeriod: { id: rentalPeriodId },
      drive,
    } = gearRequest;
    return context.$axios.patch<GearRequestWithDrive<'FA'>>(
      `${this.basePath}/${animationId}/gear-requests/${gearId}/rental-period/${rentalPeriodId}/approve`,
      { drive }
    );
  }

  static exportSignaNeedsForCsv(context: Context) {
    return context.$axios.get<HttpStringified<FaSignaNeedsExportCsv[]>>(
      `${this.basePath}/signa-need/export-csv`
    );
  }
}
