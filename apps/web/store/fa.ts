import { actionTree, getterTree, mutationTree } from "typed-vuex";
import { removeItemAtIndex, updateItemToList } from "@overbookd/list";
import { safeCall } from "~/utils/api/calls";
import { isAnimationValidatedBy } from "~/utils/festivalEvent/faUtils";
import {
  generateGearRequestCreationBuilder,
  isSimilarPeriod,
  uniqueByGearReducer,
  uniquePeriodsReducer,
} from "~/utils/functions/gearRequest";
import {
  Collaborator,
  CreateFa,
  Fa,
  FaElectricityNeed,
  FaPageId,
  FaSignaNeed,
  FaSignaNeedsExportCsv,
  FaSimplified,
  FaStatus,
  FaTimeWindow,
  FaValidationBody,
  SearchFa,
  PublicAnimation,
  SortedStoredGearRequests,
  castFaTimeWindowWithDate,
  castFaWithDate,
  simplifyCompleteFa,
  toUpdateFa,
} from "~/utils/models/fa";
import {
  FaFeedback,
  FaFeedbackSubjectType,
  FeedbackCreation,
} from "~/utils/models/feedback";
import { Ft } from "~/utils/models/ft";
import {
  GearRequest,
  GearRequestCreation,
  GearRequestWithDrive,
  Period,
  StoredGearRequest,
  castGearRequestWithDate,
} from "~/utils/models/gearRequests";
import { User } from "~/utils/models/user";
import { sendNotification } from "./catalog";
import { formatUsername } from "~/utils/user/userUtils";
import { RepoFactory } from "~/repositories/repoFactory";

const repo = RepoFactory.faRepo;

export const state = () => ({
  FAs: [] as FaSimplified[],
  mFA: defaultState() as Fa,
  gearRequests: [] as StoredGearRequest<"FA">[],
  localGearRequestRentalPeriods: [] as Period[],
  localGearRequestRentalPeriodId: -1,
});

export const getters = getterTree(state, {
  matosGearRequests(state) {
    return state.gearRequests.filter((gr) => gr.gear.owner?.code === "matos");
  },
  elecGearRequests(state) {
    return state.gearRequests.filter((gr) => gr.gear.owner?.code === "elec");
  },
  barrieresGearRequests(state) {
    return state.gearRequests.filter(
      (gr) => gr.gear.owner?.code === "barrieres"
    );
  },
  gearRequestRentalPeriods(state): Period[] {
    const savedPeriods = uniquePeriodsReducer(
      state.gearRequests.map((gr) => gr.rentalPeriod)
    );
    return [...savedPeriods, ...state.localGearRequestRentalPeriods];
  },
  uniqueByGearGearRequests(state): StoredGearRequest<"FA">[] {
    return state.gearRequests.reduce(
      uniqueByGearReducer,
      [] as StoredGearRequest<"FA">[]
    );
  },
  allSortedGearRequests(state, getters): SortedStoredGearRequests {
    return {
      matos: getters.matosGearRequests,
      barrieres: getters.barrieresGearRequests,
      elec: getters.elecGearRequests,
    };
  },
});

export const mutations = mutationTree(state, {
  UPDATE_SELECTED_FA(state, fa: Partial<Fa>) {
    state.mFA = { ...state.mFA, ...fa };
  },

  UPDATE_STATUS({ mFA }, status: FaStatus) {
    mFA.status = status;
  },

  UPDATE_FA({ mFA }, { key, value }) {
    if (typeof mFA[key as keyof Fa] !== "undefined") {
      mFA[key as keyof Fa] = value as never;
    }
  },

  ADD_FEEDBACK({ mFA }, feedback: FaFeedback) {
    if (!mFA.feedbacks) mFA.feedbacks = [];
    mFA.feedbacks = [...mFA.feedbacks, feedback];
  },

  ADD_SIGNA_NEED({ mFA }, signaNeed: FaSignaNeed) {
    mFA.signaNeeds = [...mFA.signaNeeds, signaNeed];
  },

  UPDATE_SIGNA_NEED({ mFA }, signaNeed: FaSignaNeed) {
    const index = mFA.signaNeeds.findIndex(
      (sn) => sn.id === signaNeed.id
    );
    if (index === -1) return;
    mFA.signaNeeds = updateItemToList(
      mFA.signaNeeds,
      index,
      signaNeed
    );
  },

  DELETE_SIGNA_NEED({ mFA }, signaNeed: FaSignaNeed) {
    mFA.signaNeeds = mFA.signaNeeds.filter(
      (sn) => sn.id !== signaNeed.id
    );
  },


  ADD_TIME_WINDOW({ mFA }, timeWindow: FaTimeWindow) {
    mFA.timeWindows = [...mFA.timeWindows, timeWindow];
  },

  UPDATE_TIME_WINDOW({ mFA }, timeWindow: FaTimeWindow) {
    const index = mFA.timeWindows.findIndex((tw) => tw.id === timeWindow.id);
    if (index === -1) return;
    mFA.timeWindows = updateItemToList(mFA.timeWindows, index, timeWindow);
  },

  DELETE_TIME_WINDOW({ mFA }, timeWindow: FaTimeWindow) {
    mFA.timeWindows = mFA.timeWindows.filter((tw) => tw.id !== timeWindow.id);
  },

  UPDATE_COLLABORATOR({ mFA }, collaborator: Collaborator) {
    mFA.collaborator = collaborator;
  },

  DELETE_COLLABORATOR({ mFA }) {
    mFA.collaborator = undefined;
  },

  ADD_ELECTRICITY_NEED({ mFA }, electricityNeed: FaElectricityNeed) {
    mFA.electricityNeeds = [...mFA.electricityNeeds, electricityNeed];
  },

  UPDATE_ELECTRICITY_NEED({ mFA }, electricityNeed: FaElectricityNeed) {
    const index = mFA.electricityNeeds.findIndex(
      (en) => en.id === electricityNeed.id
    );
    if (index === -1) return;
    mFA.electricityNeeds = updateItemToList(
      mFA.electricityNeeds,
      index,
      electricityNeed
    );
  },

  DELETE_ELECTRICITY_NEED({ mFA }, electricityNeed: FaElectricityNeed) {
    mFA.electricityNeeds = mFA.electricityNeeds.filter(
      (en) => en.id !== electricityNeed.id
    );
  },

  ADD_GEAR_REQUEST({ gearRequests }, gearRequest: StoredGearRequest<"FA">) {
    gearRequests.push(gearRequest);
  },

  SET_GEAR_REQUESTS(state, gearRequestsResponse: StoredGearRequest<"FA">[]) {
    state.gearRequests = gearRequestsResponse;
  },

  UDPATE_GEAR_REQUEST(state, updatedGearRequest: GearRequestWithDrive<"FA">) {
    const gearRequestIndex = state.gearRequests.findIndex(
      (gr) =>
        gr.gear.id === updatedGearRequest.gear.id &&
        gr.rentalPeriod.id === updatedGearRequest.rentalPeriod.id
    );
    if (gearRequestIndex === -1) return;
    state.gearRequests.splice(gearRequestIndex, 1, updatedGearRequest);
  },

  REMOVE_GEAR_RELATED_GEAR_REQUESTS(state, gearId: number) {
    state.gearRequests = state.gearRequests.filter(
      (gr) => gr.gear.id !== gearId
    );
  },

  REMOVE_GEAR_REQUEST(state, gearRequest: GearRequest<"FA">) {
    state.gearRequests = state.gearRequests.filter(
      (gr) =>
        gr.gear.id !== gearRequest.gear.id &&
        gr.rentalPeriod.id !== gr.rentalPeriod.id
    );
  },

  ADD_LOCAL_GEAR_REQUEST_RENTAL_PERIOD(
    state,
    rentalPeriod: Omit<Period, "id">
  ) {
    const id = state.localGearRequestRentalPeriodId;
    state.localGearRequestRentalPeriodId =
      state.localGearRequestRentalPeriodId - 1;
    state.localGearRequestRentalPeriods = [
      ...state.localGearRequestRentalPeriods,
      {
        ...rentalPeriod,
        id,
      },
    ];
  },

  REMOVE_LOCAL_GEAR_REQUEST_RENTAL_PERIOD(state, rentalPeriod: Period) {
    state.localGearRequestRentalPeriods =
      state.localGearRequestRentalPeriods.filter(
        (period) => period.id !== rentalPeriod.id
      );
  },

  RESET_LOCAL_GEAR_REQUEST_RENTAL_PERIODS(state) {
    state.localGearRequestRentalPeriods = [];
  },

  UPDATE_LOCAL_GEAR_REQUEST_RENTAL_PERIOD(state, rentalPeriod: Period) {
    const rentalPeriodIndex = state.localGearRequestRentalPeriods.findIndex(
      (period) => period.id === rentalPeriod.id
    );
    if (rentalPeriodIndex === -1) return;
    state.localGearRequestRentalPeriods.splice(
      rentalPeriodIndex,
      1,
      rentalPeriod
    );
  },

  SET_FEEDBACKS({ mFA }, feedbacks: FaFeedback[]) {
    mFA.feedbacks = feedbacks;
  },

  SET_FAS(state, fas: Fa[]) {
    state.FAs = fas;
  },

  ADD_FA({ FAs }, fa: FaSimplified) {
    FAs.push(fa);
  },

  DELETE_FA(state, faId: number) {
    state.FAs = state.FAs.filter((fa) => fa.id !== faId);
  },

  UPDATE_PUBLIC_ANIMATION({ mFA }, publicAnimation: PublicAnimation) {
    mFA.publicAnimation = publicAnimation;
  },

  DELETE_PUBLIC_ANIMATION({ mFA }) {
    mFA.publicAnimation = undefined;
  },

  ADD_FT({ mFA }, ft: Ft) {
    mFA.fts = [...mFA.fts, ft];
  },
});

export const actions = actionTree(
  { state },
  {
    async fetchFa({ commit }, id: number) {
      const [resFA, resGearRequests] = await Promise.all([
        safeCall(this, repo.getFa(this, id)),
        safeCall(this, repo.getGearRequests(this, id)),
      ]);
      if (!resFA || !resGearRequests) return;

      const fa = castFaWithDate(resFA.data);
      const gearRequests = resGearRequests.data.map(castGearRequestWithDate);

      commit("UPDATE_SELECTED_FA", fa);
      commit("SET_GEAR_REQUESTS", gearRequests);
      commit("RESET_LOCAL_GEAR_REQUEST_RENTAL_PERIODS");
    },

    async fetchFAs({ commit }, search?: SearchFa) {
      const res = await safeCall(this, repo.getAllFas(this, search), {
        errorMessage: "Impossible de charger les FAs",
      });
      if (!res) return;
      commit("SET_FAS", res.data);
    },

    async createFa({ commit }, fa: CreateFa) {
      const res = await safeCall(this, repo.createFa(this, fa), {
        successMessage: "FA créée 🥳",
        errorMessage: "FA non créée 😢",
      });
      if (!res) return;

      const createdFa = { ...defaultState(), ...castFaWithDate(res.data) };
      const simplifyFa = simplifyCompleteFa(createdFa);

      commit("UPDATE_SELECTED_FA", createdFa);
      commit("ADD_FA", simplifyFa);
    },

    async updateFa({ commit }, fa: Fa) {
      const faToUpdate = toUpdateFa(fa);
      const res = await safeCall(this, repo.updateFa(this, faToUpdate), {
        successMessage: "FA sauvegardée 🥳",
        errorMessage: "FA non sauvegardée 😢",
      });

      if (!res) return;
      const updatedFT = castFaWithDate(res.data);
      commit("UPDATE_SELECTED_FA", updatedFT);
    },

    async updateFaChunk({ state, dispatch }, faChunk: Partial<Fa>) {
      const fa = { ...state.mFA, ...faChunk };
      dispatch("updateFa", fa);
    },

    async deleteFA({ commit }, faId: number) {
      const res = await safeCall(this, repo.deleteFa(this, faId), {
        successMessage: "FA supprimée 🥳",
        errorMessage: "FA non supprimée 😢",
      });
      if (!res) return;
      commit("DELETE_FA", faId);
    },

    async submitForReview({ commit, dispatch }, author: User) {
      const feedback = {
        subject: FaFeedbackSubjectType.SUBMIT,
        comment: `La FA a été soumise par ${formatUsername(author)}.`,
        author,
        createdAt: new Date(),
      };
      dispatch("addFeedback", feedback);
      commit("UPDATE_STATUS", FaStatus.SUBMITTED);
      dispatch("save");
    },

    /**
     * @deprecated use specific functions to send requests
     */
    save: async function ({ dispatch, state }) {
      const allPromise = [];
      if (state.mFA.collaborator) {
        allPromise.push(
          repo.updateCollaborator(this, state.mFA.id, state.mFA.collaborator)
        );
      }
      if (state.mFA.signaNeeds) {
        allPromise.push(
          repo.updateFASignaNeeds(this, state.mFA.id, state.mFA.signaNeeds)
        );
      }
      await Promise.all(allPromise);
      dispatch("fetchFa", state.mFA.id);
    },

    validate: async function (
      { dispatch, commit, state, rootState },
      { validatorId, teamName, author }
    ) {
      //check if the team is already in the list
      if (state.mFA.faValidation?.find((v) => v.team.id === validatorId))
        return;
      if (state.mFA.faRefuse?.length === 1) {
        if (state.mFA.faRefuse[0].team.id === validatorId) {
          commit("UPDATE_STATUS", FaStatus.SUBMITTED);
        }
      }
      const MAX_VALIDATORS = rootState.team.faValidators.length;
      // -1 car la validation est faite avant l'ajout du validateur
      if (state.mFA.faValidation?.length === MAX_VALIDATORS - 1) {
        // validated by all validators
        commit("UPDATE_STATUS", FaStatus.VALIDATED);
      }
      const body: FaValidationBody = { teamId: validatorId };

      await repo.validateFA(this, state.mFA.id, body);
      const feedback: FaFeedback = {
        subject: FaFeedbackSubjectType.VALIDATED,
        comment: `La FA a été validée par ${teamName}.`,
        author,
        createdAt: new Date(),
      };
      dispatch("addFeedback", feedback);
      dispatch("save");
    },

    refuse: async function (
      { dispatch, commit, state },
      { validatorId, message, author }
    ) {
      commit("UPDATE_STATUS", FaStatus.REFUSED);
      const body: FaValidationBody = {
        teamId: validatorId,
      };
      await repo.refuseFA(this, state.mFA.id, body);
      const feedback: FaFeedback = {
        subject: FaFeedbackSubjectType.REFUSED,
        comment: `La FA a été refusée${message ? ": " + message : "."}`,
        author,
        createdAt: new Date(),
      };
      dispatch("addFeedback", feedback);
      dispatch("save");
    },

    async createPublicAnimation({ commit, state }) {
      const res = await safeCall(
        this,
        repo.addPublicAnimation(this, { faId: state.mFA.id }),
        {
          successMessage: "Info de publication créée 🥳",
          errorMessage: "Info de publication non créée 😢",
        }
      );
      if (!res) return;
      commit("UPDATE_PUBLIC_ANIMATION", res.data);
    },

    async updatePublicAnimation(
      { commit, state },
      publicAnimation: PublicAnimation
    ) {
      const res = await safeCall(
        this,
        repo.updatePublicAnimation(this, state.mFA.id, publicAnimation),
        {
          successMessage: "Info de publication sauvegardée 🥳",
          errorMessage: "Info de publication non sauvegardée 😢",
        }
      );
      if (!res) return;
      commit("UPDATE_PUBLIC_ANIMATION", publicAnimation);
    },

    async deletePublicAnimation({ commit, state }) {
      const res = await safeCall(
        this,
        repo.deletePublicAnimation(this, state.mFA.id),
        {
          successMessage: "Info de publication supprimée 🥳",
          errorMessage: "Info de publication non supprimée 😢",
        }
      );
      if (!res) return;
      commit("DELETE_PUBLIC_ANIMATION");
    },

    resetLogValidations: async function (
      { dispatch, state, rootGetters },
      author: User
    ) {
      const logTeamCodes = ["matos", "barrieres", "elec"];
      const teamCodesThatValidatedFA = logTeamCodes.filter((teamCode) =>
        isAnimationValidatedBy(state.mFA, teamCode)
      );
      if (teamCodesThatValidatedFA.length === 0) return;
      const teamNamesThatValidatedFA = await Promise.all(
        teamCodesThatValidatedFA.map(async (teamCode) => {
          const team = rootGetters["team/getTeamByCode"](teamCode);
          await repo.removeFaValidation(this, state.mFA.id, team.id);
          return team.name;
        })
      );

      const validTeams = teamNamesThatValidatedFA.join(" et ");

      const feedback: FaFeedback = {
        subject: FaFeedbackSubjectType.SUBMIT,
        comment: `La modification du créneau Matos a réinitialisé la validation de ${validTeams}.`,
        author,
        createdAt: new Date(),
      };
      dispatch("addFeedback", feedback);
      dispatch("save");
    },

    async previousPage({ state }) {
      const res = await safeCall<FaPageId>(
        this,
        repo.getPreviousFa(this, state.mFA.id),
        {
          errorMessage: "La FA précédente n'a pas été trouvée 😢",
        }
      );
      if (!res) return;
      if (!res.data) {
        alert("Il n'y a pas de FA avant celle-ci 😢");
        return this.$router.push({
          path: `/fa`,
        });
      }
      return this.$router.push({
        path: `/fa/${res.data.id}`,
      });
    },

    async nextPage({ state }) {
      const res = await safeCall<FaPageId>(
        this,
        repo.getNextFa(this, state.mFA.id),
        {
          errorMessage: "La FA suivante n'a pas été trouvée 😢",
        }
      );
      if (!res) return;
      if (!res.data) {
        alert("🎉 Tu as atteint la dernière FA ! 🎉");
        return this.$router.push({
          path: `/fa`,
        });
      }
      return this.$router.push({
        path: `/fa/${res.data.id}`,
      });
    },

    async addFeedback({ commit, state }, feedback: FaFeedback) {
      const feedbackCreation: FeedbackCreation = {
        ...feedback,
        authorId: feedback.author.id,
      };
      const res = await safeCall(
        this,
        repo.addFAFeedback(this, state.mFA.id, feedbackCreation),
        {
          successMessage: "Commentaire ajouté 🥳",
          errorMessage: "Commentaire non ajouté 😢",
        }
      );
      if (!res) return;
      const createdAt = new Date(res.data.createdAt);
      commit("ADD_FEEDBACK", { ...res.data, createdAt });
    },

    async addSignaNeed({ commit, state }, signaNeed: FaSignaNeed) {
      const res = await safeCall(
        this,
        repo.updateSignaNeed(this, state.mFA.id, signaNeed),
        {
          successMessage: "Besoin de signalétique créé 🥳",
          errorMessage: "Besoin de signalétique non créé 😢",
        }
      );
      if (!res) return;
      commit("ADD_SIGNA_NEED", res.data);
    },

    async updateSignaNeed({ state, commit }, signaNeed: FaSignaNeed) {
      const res = await safeCall(
        this,
        repo.updateSignaNeed(this, state.mFA.id, signaNeed),
        {
          successMessage: "Besoin de signalétique modifié 🥳",
          errorMessage: "Besoin de signalétique non modifié 😢",
        }
      );
      if (!res) return;
      commit("UPDATE_SIGNA_NEED", res.data);
    },

    async deleteSignaNeed({ commit, state }, signaNeed: FaSignaNeed) {
      if (!signaNeed?.id) return;
      const res = await safeCall(
        this,
        repo.deleteSignaNeed(this, state.mFA.id, signaNeed.id),
        {
          successMessage: "Besoin de signalétique supprimé 🥳",
          errorMessage: "Besoin de signalétique non supprimé 😢",
        }
      );
      if (!res) return;
      commit("DELETE_SIGNA_NEED", signaNeed);
    },


    addTimeWindow({ commit }, timeWindow: FaTimeWindow) {
      commit("ADD_TIME_WINDOW", timeWindow);
    },

    async addAnimationTimeWindow({ commit, state }, timeWindow: FaTimeWindow) {
      const res = await safeCall(
        this,
        repo.updateAnimationTimeWindow(this, state.mFA.id, timeWindow),
        {
          successMessage: "Créneau créé 🥳",
          errorMessage: "Créneau non créé 😢",
        }
      );
      if (!res) return;
      const savedTimeWindow = castFaTimeWindowWithDate(res.data);
      commit("ADD_TIME_WINDOW", savedTimeWindow);
    },

    async updateAnimationTimeWindow(
      { state, commit },
      timeWindow: FaTimeWindow
    ) {
      const res = await safeCall(
        this,
        repo.updateAnimationTimeWindow(this, state.mFA.id, timeWindow),
        {
          successMessage: "Créneau modifié 🥳",
          errorMessage: "Créneau non modifié 😢",
        }
      );
      if (!res) return;
      const savedTimeWindow = castFaTimeWindowWithDate(res.data);
      commit("UPDATE_TIME_WINDOW", savedTimeWindow);
    },

    async deleteAnimationTimeWindow(
      { commit, state },
      timeWindow: FaTimeWindow
    ) {
      if (!timeWindow?.id) return;
      const res = await safeCall(
        this,
        repo.deleteAnimationTimeWindow(this, state.mFA.id, timeWindow.id),
        {
          successMessage: "Créneau supprimé 🥳",
          errorMessage: "Créneau non supprimé 😢",
        }
      );
      if (!res) return;
      commit("DELETE_TIME_WINDOW", timeWindow);
    },

    async updateCollaborator({ commit, state }, collaborator: Collaborator) {
      const res = await safeCall(
        this,
        repo.updateCollaborator(this, state.mFA.id, collaborator)
      );
      if (!res) return;
      commit("UPDATE_COLLABORATOR", res.data);
    },

    async deleteCollaborator({ commit, state }) {
      const res = await safeCall(
        this,
        repo.deleteCollaborator(this, state.mFA.id)
      );
      if (!res) return;
      commit("DELETE_COLLABORATOR");
    },

    async addElectricityNeed(
      { commit, state },
      electricityNeed: FaElectricityNeed
    ) {
      const res = await safeCall(
        this,
        repo.updateElectricityNeed(this, state.mFA.id, electricityNeed),
        {
          successMessage: "Besoin d'électricité créé 🥳",
          errorMessage: "Besoin d'électricité non créé 😢",
        }
      );
      if (!res) return;
      commit("ADD_ELECTRICITY_NEED", res.data);
    },

    async updateElectricityNeed(
      { state, commit },
      electricityNeed: FaElectricityNeed
    ) {
      const res = await safeCall(
        this,
        repo.updateElectricityNeed(this, state.mFA.id, electricityNeed),
        {
          successMessage: "Besoin d'électricité modifié 🥳",
          errorMessage: "Besoin d'électricité non modifié 😢",
        }
      );
      if (!res) return;
      commit("UPDATE_ELECTRICITY_NEED", res.data);
    },

    async deleteElectricityNeed(
      { commit, state },
      electricityNeed: FaElectricityNeed
    ) {
      if (!electricityNeed?.id) return;
      const res = await safeCall(
        this,
        repo.deleteElectricityNeed(this, state.mFA.id, electricityNeed.id),
        {
          successMessage: "Besoin d'électricité supprimé 🥳",
          errorMessage: "Besoin d'électricité non supprimé 😢",
        }
      );
      if (!res) return;
      commit("DELETE_ELECTRICITY_NEED", electricityNeed);
    },

    async addGearRequestRentalPeriod(
      { dispatch, getters, commit },
      rentalPeriod: Omit<Period, "id">
    ) {
      const gearRequests =
        getters.uniqueByGearGearRequests as GearRequest<"FA">[];
      if (gearRequests.length === 0) {
        return commit("ADD_LOCAL_GEAR_REQUEST_RENTAL_PERIOD", rentalPeriod);
      }
      const { start, end } = rentalPeriod;
      const [firstGearRequest, ...otherGearRequests]: GearRequestCreation[] =
        gearRequests.map((gr) => ({
          start,
          end,
          gearId: gr.gear.id,
          quantity: gr.quantity,
        }));
      const { rentalPeriod: savedRentalPeriod } = await dispatch(
        "addGearRequest",
        firstGearRequest
      );
      otherGearRequests.map(({ gearId, quantity }) =>
        dispatch("addGearRequest", {
          gearId,
          quantity,
          periodId: savedRentalPeriod.id,
        })
      );
    },

    async addGearRequestForAllRentalPeriods(
      { commit, dispatch, getters },
      { gearId, quantity }: Pick<GearRequestCreation, "gearId" | "quantity">
    ) {
      const generateGearRequestCreation = generateGearRequestCreationBuilder(
        gearId,
        quantity
      );
      const gearRequestCreationForms = (
        getters.gearRequestRentalPeriods as Period[]
      ).map(generateGearRequestCreation);

      await Promise.all(
        gearRequestCreationForms.map((form) => dispatch("addGearRequest", form))
      );
      commit("RESET_LOCAL_GEAR_REQUEST_RENTAL_PERIODS");
    },

    async addGearRequest({ commit, state }, gearRequest: GearRequestCreation) {
      const res = await safeCall(
        this,
        repo.createGearRequest(this, state.mFA.id, gearRequest),
        {
          successMessage: "La demande de matériel a été ajoutée avec succès ✅",
          errorMessage: "La demande de matériel n'a pas été ajoutée ❌",
        }
      );
      if (!res) return;
      const createdGearRequest = castGearRequestWithDate(res.data);
      commit("ADD_GEAR_REQUEST", createdGearRequest);
      return createdGearRequest;
    },

    async setDriveToGearRequest(
      { commit },
      gearRequest: GearRequestWithDrive<"FA">
    ) {
      commit("UDPATE_GEAR_REQUEST", gearRequest);
    },

    async validateGearRequests(
      { state, dispatch },
      gearRequests: GearRequestWithDrive<"FA" | "FT">[]
    ) {
      await Promise.all(
        gearRequests.map((gr) =>
          safeCall<GearRequestWithDrive<"FA">>(
            this,
            repo.validateGearRequest(this, state.mFA.id, gr),
            {
              successMessage: "Validation effectuée ✅",
              errorMessage: "La tentative de validation n'a pas abouti",
            }
          )
        )
      );
      dispatch("fetchGearRequests");
    },

    async removeGearRequestRentalPeriod(
      { state, commit, dispatch },
      rentalPeriodToDelete: Period
    ) {
      if (rentalPeriodToDelete.id > 1000) {
        return commit(
          "REMOVE_LOCAL_GEAR_REQUEST_RENTAL_PERIOD",
          rentalPeriodToDelete
        );
      }
      const impactedGearRequest = state.gearRequests.filter(
        ({ rentalPeriod }) =>
          isSimilarPeriod(rentalPeriodToDelete)(rentalPeriod)
      );
      await Promise.all(
        impactedGearRequest.map((gr) =>
          safeCall(
            this,
            repo.deleteGearRequest(
              this,
              state.mFA.id,
              gr.gear.id,
              gr.rentalPeriod.id
            ),
            {
              successMessage: "La demande de matériel a été supprimée 🗑️",
              errorMessage: "La demande de matériel n'a pas a été supprimée ❌",
            }
          )
        )
      );
      dispatch("fetchGearRequests");
    },

    async removeRelatedGearRequest({ commit, state }, gearId: number) {
      await Promise.all(
        state.gearRequests
          .filter((gearRequest) => gearRequest.gear.id === gearId)
          .map((gearRequest) =>
            safeCall(
              this,
              repo.deleteGearRequest(
                this,
                state.mFA.id,
                gearId,
                gearRequest.rentalPeriod.id
              ),
              {
                successMessage: "La demande de matériel a été supprimée 🗑️",
                errorMessage:
                  "La demande de matériel n'a pas a été supprimée ❌",
              }
            )
          )
      );
      commit("REMOVE_GEAR_RELATED_GEAR_REQUESTS", gearId);
    },

    async removeGearRequest({ commit }, gearRequest: StoredGearRequest<"FA">) {
      const { seeker, gear, rentalPeriod } = gearRequest;
      const res = safeCall(
        this,
        repo.deleteGearRequest(this, seeker.id, gear.id, rentalPeriod.id),
        {
          successMessage: "La demande de matériel a été supprimée 🗑️",
          errorMessage: "La demande de matériel n'a pas a été supprimée ❌",
        }
      );
      if (!res) return;
      commit("REMOVE_GEAR_REQUEST", gearRequest);
    },

    async updateGearPeriod({ commit, state, dispatch }, rentalPeriod: Period) {
      const { id: rentalPeriodId, start, end } = rentalPeriod;
      if (rentalPeriodId > 1000) {
        return commit("UPDATE_LOCAL_GEAR_REQUEST_RENTAL_PERIOD", rentalPeriod);
      }
      try {
        const gearRequests = await Promise.all(
          state.gearRequests
            .filter(
              (gearRequest) =>
                gearRequest.rentalPeriod.id === rentalPeriodId ||
                (gearRequest.rentalPeriod.start === start &&
                  gearRequest.rentalPeriod.end === end)
            )
            .map(async (gearRequest) => {
              const res = await repo.updateGearRequest(
                this,
                state.mFA.id,
                gearRequest.gear.id,
                rentalPeriodId,
                { start, end }
              );
              return res.data;
            })
        );
        dispatch("fetchGearRequests");
        if (!gearRequests.length) return;
        sendNotification(this, "Demandes de matériel misent a jour ✅");
      } catch (e) {
        sendNotification(
          this,
          "La mise a jour des demandes de matos a echouee ❌"
        );
      }
    },

    async fetchGearRequests({ commit, state }, id?: number) {
      const faId = id ?? state.mFA.id;
      const resGearRequests = await safeCall(
        this,
        repo.getGearRequests(this, faId)
      );
      if (!resGearRequests) return null;
      const gearRequests = resGearRequests.data.map(castGearRequestWithDate);
      commit("SET_GEAR_REQUESTS", gearRequests);
    },

    async getSignaNeedsForCsv() {
      const res = await safeCall<FaSignaNeedsExportCsv[]>(
        this,
        repo.exportSignaNeedsForCsv(this)
      );
      if (!res) return;
      return res.data;
    },
  }
);

function defaultState(): Omit<Fa, "id"> {
  return {
    name: "",
    status: FaStatus.DRAFT,
    description: "",
    timeWindows: [],
    feedbacks: [],
    faValidation: [],
    faRefuse: [],
    signaNeeds: [],
    electricityNeeds: [],
    fts: [],
  };
}
