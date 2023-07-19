import { actionTree, getterTree, mutationTree } from "typed-vuex";
import { removeItemAtIndex, updateItemToList } from "@overbookd/list";
import { RepoFactory } from "~/repositories/repoFactory";
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
  FaStatus,
  FaTimeWindow,
  FaValidationBody,
  SearchFa,
  SitePublishAnimation,
  SitePublishAnimationCreation,
  SortedStoredGearRequests,
  castFaWithDate,
} from "~/utils/models/fa";
import {
  FaFeedback,
  FaFeedbackSubjectType,
  FeedbackCreation,
} from "~/utils/models/feedback";
import { Ft, FtSimplified } from "~/utils/models/ft";
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

const repo = RepoFactory.faRepo;

export const state = () => ({
  FAs: [] as Fa[],
  mFA: {
    status: FaStatus.DRAFT,
    name: "",
    fts: [] as FtSimplified[],
  } as Fa,
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
  SET_FA(state, fa: Partial<Fa>) {
    state.mFA = { ...state.mFA, ...fa };
  },

  RESET_FA(state) {
    state.mFA = {
      status: FaStatus.DRAFT,
      name: "",
    } as Fa;
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
    if (!mFA.signaNeeds) mFA.signaNeeds = [];
    mFA.signaNeeds?.push(signaNeed);
  },

  UPDATE_SIGNA_NEED_COUNT({ mFA }, { index, count }) {
    const existingSignaNeeds = mFA.signaNeeds?.at(index);
    if (existingSignaNeeds) {
      existingSignaNeeds.count = Number(count);
    }
  },

  DELETE_SIGNA_NEED({ mFA }, index: number) {
    const minimumList = mFA.signaNeeds ?? [];
    mFA.signaNeeds = removeItemAtIndex(minimumList, index);
  },

  ADD_TIME_WINDOW({ mFA }, timeWindow: FaTimeWindow) {
    if (!mFA.timeWindows) mFA.timeWindows = [];
    mFA.timeWindows?.push(timeWindow);
  },

  UPDATE_TIME_WINDOW(
    { mFA },
    { index, timeWindow }: { index: number; timeWindow: FaTimeWindow }
  ) {
    const minimumList = mFA.timeWindows ?? [];
    mFA.timeWindows = updateItemToList(minimumList, index, timeWindow);
  },

  DELETE_TIME_WINDOW({ mFA }, index: number) {
    const minimumList = mFA.timeWindows ?? [];
    mFA.timeWindows = removeItemAtIndex(minimumList, index);
  },

  UPDATE_COLLABORATOR({ mFA }, collaborator: Collaborator) {
    mFA.collaborator = collaborator;
  },

  DELETE_COLLABORATOR({ mFA }) {
    mFA.collaborator = undefined;
  },

  ADD_ELECTRICITY_NEED({ mFA }, elecNeed: FaElectricityNeed) {
    if (!mFA.electricityNeeds) mFA.electricityNeeds = [];
    mFA.electricityNeeds?.push(elecNeed);
  },

  UPDATE_ELECTRICITY_NEED(
    { mFA },
    { index, elecNeed }: { index: number; elecNeed: FaElectricityNeed }
  ) {
    const minimumList = mFA.electricityNeeds ?? [];
    mFA.electricityNeeds = updateItemToList(minimumList, index, elecNeed);
  },

  DELETE_ELECTRICITY_NEED({ mFA }, index: number) {
    const minimumList = mFA.electricityNeeds ?? [];
    mFA.electricityNeeds = removeItemAtIndex(minimumList, index);
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

  ADD_FA({ FAs }, fa: Fa) {
    FAs.push(fa);
  },

  DELETE_FA(state, faId: number) {
    state.FAs = state.FAs.filter((fa) => fa.id !== faId);
  },

  UPDATE_PUBLISH_ANIMATION({ mFA }, publishAnimation: SitePublishAnimation) {
    mFA.faSitePublishAnimation = {
      ...mFA.faSitePublishAnimation,
      photoLink: publishAnimation.photoLink ?? "",
      description: publishAnimation.description ?? "",
      categories: publishAnimation.categories ?? [],
      isFlagship: publishAnimation.isFlagship ?? false,
    };
  },

  DELETE_PUBLISH_ANIMATION({ mFA }) {
    mFA.faSitePublishAnimation = undefined;
  },

  ADD_FT({ mFA }, ft: Ft) {
    mFA.fts = [...mFA.fts, ft];
  },
});

export const actions = actionTree(
  { state },
  {
    setFA({ commit }, FA: Fa) {
      commit("SET_FA", FA);
    },

    resetFA({ commit }, payload) {
      commit("RESET_FA", payload);
    },

    getAndSet: async function ({ commit }, id: number) {
      const [resFA, resGearRequests] = await Promise.all([
        safeCall(this, repo.getFaById(this, id)),
        safeCall(this, repo.getGearRequests(this, id)),
      ]);
      if (!resGearRequests || !resFA) return null;

      const gearRequests = resGearRequests.data.map(castGearRequestWithDate);
      const fa = castFaWithDate(resFA.data);
      commit("SET_GEAR_REQUESTS", gearRequests);
      commit("SET_FA", fa);
      commit("RESET_LOCAL_GEAR_REQUEST_RENTAL_PERIODS");
    },

    submitForReview: async function (
      { commit, dispatch },
      { faId, author }: { faId: number; author: User }
    ) {
      if (!faId || !author) return;
      const authorName = `${author.firstname} ${author.lastname}`;
      const feedback: FaFeedback = {
        subject: FaFeedbackSubjectType.SUBMIT,
        comment: `La FA a été soumise par ${authorName}.`,
        author,
        createdAt: new Date(),
      };
      dispatch("addFeedback", feedback);
      commit("UPDATE_STATUS", FaStatus.SUBMITTED);
      dispatch("save");
    },

    updateFA({ commit }, { key, value }) {
      commit("UPDATE_FA", { key, value });
    },

    save: async function ({ dispatch, state }) {
      const allPromise = [];
      allPromise.push(
        RepoFactory.faRepo.updateFa(this, state.mFA.id, state.mFA)
      );
      if (state.mFA.collaborator) {
        allPromise.push(
          RepoFactory.faRepo.updateCollaborator(
            this,
            state.mFA.id,
            state.mFA.collaborator
          )
        );
      }
      if (state.mFA.signaNeeds) {
        allPromise.push(
          RepoFactory.faRepo.updateFASignaNeeds(
            this,
            state.mFA.id,
            state.mFA.signaNeeds
          )
        );
      }
      if (state.mFA.timeWindows) {
        allPromise.push(
          RepoFactory.faRepo.updateFATimeWindows(
            this,
            state.mFA.id,
            state.mFA.timeWindows
          )
        );
      }
      if (state.mFA.electricityNeeds) {
        allPromise.push(
          RepoFactory.faRepo.updateFAElectricityNeeds(
            this,
            state.mFA.id,
            state.mFA.electricityNeeds
          )
        );
      }
      if (state.mFA.faSitePublishAnimation) {
        const publishAnimation = {
          ...state.mFA.faSitePublishAnimation,
          faId: state.mFA.id,
        };
        allPromise.push(
          RepoFactory.faRepo.updatePublishAnimation(
            this,
            publishAnimation.faId,
            publishAnimation
          )
        );
      }
      await Promise.all(allPromise);
      dispatch("getAndSet", state.mFA.id);
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

      await RepoFactory.faRepo.validateFA(this, state.mFA.id, body);
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
      await RepoFactory.faRepo.refuseFA(this, state.mFA.id, body);
      const feedback: FaFeedback = {
        subject: FaFeedbackSubjectType.REFUSED,
        comment: `La FA a été refusée${message ? ": " + message : "."}`,
        author,
        createdAt: new Date(),
      };
      dispatch("addFeedback", feedback);
      dispatch("save");
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
          await RepoFactory.faRepo.removeFaValidation(
            this,
            state.mFA.id,
            team.id
          );
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

    addSignaNeed({ commit }, signaNeed: FaSignaNeed) {
      commit("ADD_SIGNA_NEED", signaNeed);
    },

    updateSignaNeedCount({ commit }, { index, count }) {
      commit("UPDATE_SIGNA_NEED_COUNT", { index, count });
    },

    async deleteSignaNeed({ commit, state }, index: number) {
      const currentSignaNeedId = state.mFA.signaNeeds?.at(index)?.id;
      if (currentSignaNeedId) {
        await safeCall(
          this,
          RepoFactory.faRepo.deleteFASignaNeeds(this, currentSignaNeedId)
        );
      }
      commit("DELETE_SIGNA_NEED", index);
    },

    addTimeWindow({ commit }, timeWindow: FaTimeWindow) {
      commit("ADD_TIME_WINDOW", timeWindow);
    },

    updateTimeWindow(
      { commit },
      { index, timeWindow }: { index: number; timeWindow: FaTimeWindow }
    ) {
      commit("UPDATE_TIME_WINDOW", { index, timeWindow });
    },

    async deleteTimeWindow({ commit, state }, index: number) {
      const currentTimeWindowId = state.mFA.timeWindows?.at(index)?.id;
      if (currentTimeWindowId) {
        await safeCall(
          this,
          RepoFactory.faRepo.deleteFATimeWindows(this, currentTimeWindowId)
        );
      }
      commit("DELETE_TIME_WINDOW", index);
    },

    async updateCollaborator({ commit, state }, collaborator: Collaborator) {
      const res = await safeCall(
        this,
        RepoFactory.faRepo.updateCollaborator(this, state.mFA.id, collaborator)
      );
      if (!res) return;
      commit("UPDATE_COLLABORATOR", res.data);
    },

    async deleteCollaborator({ commit, state }) {
      const res = await safeCall(
        this,
        RepoFactory.faRepo.deleteCollaborator(this, state.mFA.id)
      );
      if (!res) return;
      commit("DELETE_COLLABORATOR");
    },

    addElectricityNeed({ commit }, elecNeed: FaElectricityNeed) {
      commit("ADD_ELECTRICITY_NEED", elecNeed);
    },

    updateElectricityNeed({ commit }, { index, elecNeed }) {
      commit("UPDATE_ELECTRICITY_NEED", { index, elecNeed });
    },

    async deleteElectricityNeed({ commit, state }, index: number) {
      const currentElectricityNeedId =
        state.mFA.electricityNeeds?.at(index)?.id;
      if (currentElectricityNeedId) {
        await safeCall(
          this,
          RepoFactory.faRepo.deleteFAElectricityNeeds(
            this,
            currentElectricityNeedId
          )
        );
      }
      commit("DELETE_ELECTRICITY_NEED", index);
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
      const res = await RepoFactory.faRepo.createGearRequest(
        this,
        state.mFA.id,
        gearRequest
      );
      sendNotification(
        this,
        "La demande de matériel a été ajoutée avec succès ✅"
      );
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
            RepoFactory.faRepo.validateGearRequest(this, state.mFA.id, gr),
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
            RepoFactory.faRepo.deleteGearRequest(
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
              RepoFactory.faRepo.deleteGearRequest(
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
        RepoFactory.faRepo.deleteGearRequest(
          this,
          seeker.id,
          gear.id,
          rentalPeriod.id
        ),
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
              const res = await RepoFactory.faRepo.updateGearRequest(
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

    async fetchFAs({ commit }, search?: SearchFa) {
      const res = await safeCall(
        this,
        RepoFactory.faRepo.getAllFas(this, search),
        {
          errorMessage: "Impossible de charger les FAs",
        }
      );
      if (!res) return;
      const fas = res.data.map(castFaWithDate);
      commit("SET_FAS", fas);
    },

    async createFa({ commit, dispatch }, fa: CreateFa) {
      const res = await safeCall(
        this,
        RepoFactory.faRepo.createNewFa(this, fa),
        {
          successMessage: "FA créée 🥳",
          errorMessage: "FA non créée 😢",
        }
      );
      if (!res) return;
      const createdFa = castFaWithDate(res.data);
      commit("ADD_FA", createdFa);
      dispatch("setFA", createdFa);
    },

    async deleteFA({ commit }, faId: number) {
      const res = await safeCall(
        this,
        RepoFactory.faRepo.deleteFa(this, faId),
        {
          successMessage: "FA supprimée 🥳",
          errorMessage: "FA non supprimée 😢",
        }
      );
      if (!res) return;
      commit("DELETE_FA", faId);
    },

    async createPublishAnimation({ commit, state }) {
      const publishAnimation: SitePublishAnimationCreation = {
        faId: state.mFA.id,
      };
      const res = await safeCall(
        this,
        RepoFactory.faRepo.addPublishAnimation(this, publishAnimation)
      );
      if (!res) return;
      commit("UPDATE_PUBLISH_ANIMATION", res.data);
    },

    async updatePublishAnimation({ commit, state }, { key, value }) {
      const publishAnimation = {
        ...state.mFA.faSitePublishAnimation,
        [key]: value,
      };
      commit("UPDATE_PUBLISH_ANIMATION", publishAnimation);
    },

    async deletePublishAnimation({ commit, state }) {
      const res = await safeCall(
        this,
        RepoFactory.faRepo.deletePublishAnimation(this, state.mFA.id)
      );
      if (!res) return;
      commit("DELETE_PUBLISH_ANIMATION");
    },

    async getSignaNeedsForCsv() {
      const res = await safeCall<FaSignaNeedsExportCsv[]>(
        this,
        RepoFactory.faRepo.exportSignaNeedsForCsv(this)
      );
      if (!res) return;
      return res.data;
    },
  }
);
