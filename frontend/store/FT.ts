import { actionTree, getterTree, mutationTree } from "typed-vuex";
import { RepoFactory } from "~/repositories/repoFactory";
import { safeCall } from "~/utils/api/calls";
import { getValidationReviews } from "~/utils/festivalEvent/ftUtils";
import {
  generateGearRequestCreationBuilder,
  isSimilarConsumableGearRequest,
  isSimilarGearRequest,
  isSimilarPeriod,
  uniqueByGearReducer,
  uniqueGearRequestPeriodsReducer,
  uniquePeriodsReducer,
} from "~/utils/functions/gearRequest";
import { updateItemToList } from "~/utils/functions/list";
import {
  Feedback,
  FeedbackCreation,
  SubjectType,
} from "~/utils/models/feedback";
import {
  castFTWithDate,
  castTimeWindowWithDate,
  FT,
  FTCreation,
  FTPageId,
  FTSearch,
  FTSimplified,
  FTStatus,
  FTTeamRequest,
  FTTeamRequestUpdate,
  FTTimeWindow,
  FTUserRequest,
  FTUserRequestUpdate,
  getTimeWindowWithoutRequests,
  toUpdateFT,
} from "~/utils/models/ft";
import {
  castGearRequestWithDate,
  GearRequestCreation,
  GearRequestWithDrive,
  Period,
  StoredGearRequest,
} from "~/utils/models/gearRequests";
import { Review, Reviewer } from "~/utils/models/review";
import { Team } from "~/utils/models/team";
import { User } from "~/utils/models/user";
import { formatUsername } from "~/utils/user/userUtils";

const repo = RepoFactory.ftRepo;

export const state = () => ({
  mFT: defaultState() as FT,
  FTs: [] as FTSimplified[],
  gearRequests: [] as StoredGearRequest<"FT">[],
  localGearRequestRentalPeriodId: -1,
});

export const getters = getterTree(state, {
  ftPeriods(state): Period[] {
    return state.mFT.timeWindows.map(({ start, end }, index) => ({
      start,
      end,
      id: state.localGearRequestRentalPeriodId - index,
    }));
  },
  gearRequestRentalPeriods(state, getters): Period[] {
    const savedPeriods = uniqueGearRequestPeriodsReducer(state.gearRequests);
    const ftPeriods = getters.ftPeriods;
    return uniquePeriodsReducer([...savedPeriods, ...ftPeriods]);
  },
  localGearRequestRentalPeriods(state, getters): Period[] {
    return (getters.gearRequestRentalPeriods as Period[]).filter(
      ({ id }) => id <= state.localGearRequestRentalPeriodId
    );
  },
  uniqueByGearGearRequests(state): StoredGearRequest<"FT">[] {
    return state.gearRequests.reduce(
      uniqueByGearReducer,
      [] as StoredGearRequest<"FT">[]
    );
  },
});

export const mutations = mutationTree(state, {
  UPDATE_SELECTED_FT(state, ft: Partial<FT>) {
    state.mFT = { ...state.mFT, ...ft };
  },

  RESET_FT(state) {
    state.mFT = defaultState() as FT;
  },

  SET_FTS(state, fts: FTSimplified[]) {
    state.FTs = fts;
  },

  ADD_FT({ FTs }, ft: FT) {
    FTs.push(ft);
  },

  DELETE_FT(state, ftId: number) {
    state.FTs = state.FTs.filter((ft) => ft.id !== ftId);
  },

  ADD_TIME_WINDOW({ mFT }, timeWindow: FTTimeWindow) {
    mFT.timeWindows = [...mFT.timeWindows, timeWindow];
  },

  UPDATE_TIME_WINDOW({ mFT }, timeWindow: FTTimeWindow) {
    const index = mFT.timeWindows.findIndex((tw) => tw.id === timeWindow.id);
    if (index === -1) return;
    mFT.timeWindows = updateItemToList(mFT.timeWindows, index, timeWindow);
  },

  DELETE_TIME_WINDOW({ mFT }, timeWindow: FTTimeWindow) {
    mFT.timeWindows = mFT.timeWindows.filter((tw) => tw.id !== timeWindow.id);
  },

  UPDATE_USER_REQUESTS(
    { mFT },
    {
      timeWindowId,
      userRequests,
    }: { timeWindowId: number; userRequests: FTUserRequest[] }
  ) {
    const index = mFT.timeWindows.findIndex((tw) => tw.id === timeWindowId);
    if (index === -1) return;
    const previousTimeWindow = mFT.timeWindows.at(index);
    if (!previousTimeWindow) return;
    const updatedTimeWindow = { ...previousTimeWindow, userRequests };
    mFT.timeWindows = updateItemToList(
      mFT.timeWindows,
      index,
      updatedTimeWindow
    );
  },

  UPDATE_TEAM_REQUESTS(
    { mFT },
    {
      timeWindowId,
      teamRequests,
    }: { timeWindowId: number; teamRequests: FTTeamRequest[] }
  ) {
    const index = mFT.timeWindows.findIndex((tw) => tw.id === timeWindowId);
    if (index === -1) return;
    const previousTimeWindow = mFT.timeWindows.at(index);
    if (!previousTimeWindow) return;
    const updatedTimeWindow = { ...previousTimeWindow, teamRequests };
    mFT.timeWindows = updateItemToList(
      mFT.timeWindows,
      index,
      updatedTimeWindow
    );
  },

  DELETE_USER_REQUEST(
    { mFT },
    {
      timeWindow,
      userRequest,
    }: { timeWindow: FTTimeWindow; userRequest: FTUserRequest }
  ) {
    const index = mFT.timeWindows.findIndex((tw) => tw.id === timeWindow.id);
    if (index === -1) return;
    const userRequests = timeWindow.userRequests.filter(
      (ur) => ur.user.id !== userRequest.user.id
    );
    mFT.timeWindows = updateItemToList(mFT.timeWindows, index, {
      ...timeWindow,
      userRequests,
    });
  },

  DELETE_TEAM_REQUEST(
    { mFT },
    {
      timeWindow,
      teamRequest,
    }: { timeWindow: FTTimeWindow; teamRequest: FTTeamRequest }
  ) {
    const index = mFT.timeWindows.findIndex((tw) => tw.id === timeWindow.id);
    if (index === -1) return;
    const teamRequests = timeWindow.teamRequests.filter(
      (tr) => tr.team.id !== teamRequest.team.id
    );
    mFT.timeWindows = updateItemToList(mFT.timeWindows, index, {
      ...timeWindow,
      teamRequests,
    });
  },

  UPDATE_REVIEWS({ mFT }, reviews: Review[]) {
    mFT.reviews = reviews;
  },

  DELETE_REVIEWS({ mFT }, reviews: Review[]) {
    mFT.reviews = mFT.reviews.filter((r) => !reviews.includes(r));
  },

  ADD_FEEDBACK({ mFT }, feedback: Feedback) {
    mFT.feedbacks = [...mFT.feedbacks, feedback];
  },

  ADD_GEAR_REQUEST(state, gearRequest: StoredGearRequest<"FT">) {
    const index = state.gearRequests.findIndex(
      isSimilarConsumableGearRequest(gearRequest)
    );
    if (index === -1) {
      state.gearRequests = [...state.gearRequests, gearRequest];
      return;
    }
    state.gearRequests = updateItemToList(
      state.gearRequests,
      index,
      gearRequest
    );
  },

  SET_GEAR_REQUESTS(state, gearRequestsResponse: StoredGearRequest<"FT">[]) {
    state.gearRequests = gearRequestsResponse;
  },

  REMOVE_GEAR_RELATED_GEAR_REQUESTS(state, gearId: number) {
    state.gearRequests = state.gearRequests.filter(
      (gr) => gr.gear.id !== gearId
    );
  },

  DELETE_GEAR_REQUEST(state, gearRequest: StoredGearRequest<"FT">) {
    state.gearRequests = state.gearRequests.filter(
      isSimilarGearRequest(gearRequest)
    );
  },

  UPATE_GEAR_REQUESTS_RENTAL_PERIOD(state, rentalPeriod: Period) {
    state.gearRequests = state.gearRequests.map((gearRequest) => {
      if (!isSimilarPeriod(gearRequest.rentalPeriod)(rentalPeriod))
        return gearRequest;
      return { ...gearRequest, rentalPeriod };
    });
  },

  UDPATE_GEAR_REQUEST(state, updatedGearRequest: GearRequestWithDrive<"FT">) {
    const gearRequestIndex = state.gearRequests.findIndex(
      (gr) =>
        gr.gear.id === updatedGearRequest.gear.id &&
        gr.rentalPeriod.id === updatedGearRequest.rentalPeriod.id
    );
    if (gearRequestIndex === -1) return;
    state.gearRequests.splice(gearRequestIndex, 1, updatedGearRequest);
  },
});

export const actions = actionTree(
  { state },
  {
    setFT({ commit }, ft: FT) {
      commit("UPDATE_SELECTED_FT", ft);
    },

    resetFT({ commit }) {
      commit("RESET_FT");
    },

    async fetchFT({ commit, dispatch }, id: number) {
      const [resFT, resGearRequests] = await Promise.all([
        safeCall(this, repo.getFT(this, id)),
        safeCall(this, repo.getGearRequests(this, id)),
      ]);
      if (!resFT || !resGearRequests) return;

      const ft = castFTWithDate(resFT.data);
      const gearRequests = resGearRequests.data.map(castGearRequestWithDate);
      commit("UPDATE_SELECTED_FT", ft);
      commit("SET_GEAR_REQUESTS", gearRequests);

      if (!ft.fa) return;
      dispatch("FA/fetchGearRequests", ft.fa.id, { root: true });
    },

    async fetchFTs({ commit }, search?: FTSearch) {
      const res = await safeCall(this, repo.getAllFTs(this, search), {
        errorMessage: "Impossible de charger les FTs",
      });
      if (!res) return;
      commit("SET_FTS", res.data);
    },

    async createFT({ commit, dispatch }, ft: FTCreation) {
      const res = await safeCall(this, repo.createFT(this, ft), {
        successMessage: "FT créée 🥳",
        errorMessage: "FT non créée 😢",
      });

      if (!res) return;
      const createdFT = castFTWithDate(res.data);
      commit("ADD_FT", createdFT);
      dispatch("setFT", { ...defaultState(), ...createdFT, id: res.data.id });
    },

    async updateFT({ commit }, ft: FT) {
      const ftToUpdate = toUpdateFT(ft);
      const res = await safeCall(this, repo.updateFT(this, ftToUpdate), {
        successMessage: "FT sauvegardée 🥳",
        errorMessage: "FT non sauvegardée 😢",
      });

      if (!res) return;
      const updatedFT = castFTWithDate(res.data);
      commit("UPDATE_SELECTED_FT", updatedFT);
    },

    async deleteFT({ commit }, ft: FT) {
      const res = await safeCall(this, repo.deleteFT(this, ft.id), {
        successMessage: "FT supprimée 🥳",
        errorMessage: "FT non supprimée 😢",
      });
      if (!res) return;
      commit("DELETE_FT", ft.id);
    },

    async restoreFT({ commit, dispatch }, ft: FT) {
      const restoredFT = { ...ft, isDeleted: false };
      dispatch("updateFT", restoredFT);
      commit("DELETE_FT", ft.id);
    },

    async addTimeWindow({ commit, state }, timeWindow: FTTimeWindow) {
      const adaptedTimeWindow = getTimeWindowWithoutRequests(timeWindow);
      const res = await safeCall(
        this,
        repo.updateFTTimeWindow(this, state.mFT.id, adaptedTimeWindow),
        {
          successMessage: "Créneau ajouté 🥳",
          errorMessage: "Créneau non ajouté 😢",
        }
      );
      if (!res) return;
      commit("ADD_TIME_WINDOW", castTimeWindowWithDate(res.data));
    },

    async submitForReview({ commit, dispatch, state }, author: User) {
      const res = await safeCall(this, repo.submitFT(this, state.mFT.id), {
        successMessage: "FT soumise à validation 🥳",
        errorMessage: "FT non soumise à validation 😢",
      });

      if (!res) return;
      const updatedFT = castFTWithDate(res.data);
      commit("UPDATE_SELECTED_FT", updatedFT);

      const authorName = formatUsername(author);
      const feedback: Feedback = {
        subject: SubjectType.SUBMIT,
        comment: `La FT a été soumise à validation par ${authorName}.`,
        author,
        createdAt: new Date(),
      };
      dispatch("addFeedback", { ...feedback, author });
    },

    async validate(
      { dispatch, commit, state },
      { author, team }: { author: User; team: Team }
    ) {
      const reviewer: Reviewer = { teamCode: team.code };
      const resFT = await safeCall(
        this,
        repo.validateFT(this, state.mFT.id, reviewer),
        { successMessage: "FT validée 🥳", errorMessage: "FT non validée 😢" }
      );
      if (!resFT) return;
      const updatedFT = castFTWithDate(resFT.data);
      commit("UPDATE_SELECTED_FT", updatedFT);

      const feedback: Feedback = {
        subject: SubjectType.VALIDATED,
        comment: `La FT a été validée par ${team.name}.`,
        author,
        createdAt: new Date(),
      };
      dispatch("addFeedback", feedback);
    },

    async refuse(
      { commit, dispatch, state },
      { author, team, message }: { author: User; team: Team; message?: string }
    ) {
      const reviewer: Reviewer = { teamCode: team.code };
      const resFT = await safeCall(
        this,
        repo.refuseFT(this, state.mFT.id, reviewer),
        { successMessage: "FT refusée 🥳", errorMessage: "FT non refusée 😢" }
      );
      if (!resFT) return;
      const updatedFT = castFTWithDate(resFT.data);
      commit("UPDATE_SELECTED_FT", updatedFT);

      const feedback: Feedback = {
        subject: SubjectType.REFUSED,
        comment: `La FT a été refusée${message ? `: ${message}` : "."}`,
        author,
        createdAt: new Date(),
      };
      dispatch("addFeedback", feedback);
    },

    async switchToReadyForAssignment(
      { dispatch, commit, state },
      author: User
    ) {
      const resFT = await safeCall(
        this,
        repo.switchToReadyForAssignment(this, state.mFT.id),
        { successMessage: "FT prête à affectation 🥳" }
      );
      if (!resFT) return;
      const updatedFT = castFTWithDate(resFT.data);
      commit("UPDATE_SELECTED_FT", updatedFT);

      const feedback: Feedback = {
        subject: SubjectType.READY,
        comment: "Prête pour affectation !",
        author,
        createdAt: new Date(),
      };
      dispatch("addFeedback", feedback);
    },

    async previousPage({ state }) {
      const res = await safeCall<FTPageId>(
        this,
        repo.getPreviousFT(this, state.mFT.id),
        {
          errorMessage: "La FT précédente n'a pas été trouvée 😢",
        }
      );
      if (!res) return;
      if (!res.data) {
        alert("Il n'y a pas de FT avant celle-ci 😢");
        return this.$router.push({
          path: `/ft`,
        });
      }
      return this.$router.push({
        path: `/ft/${res.data.id}`,
      });
    },

    async nextPage({ state }) {
      const res = await safeCall<FTPageId>(
        this,
        repo.getNextFT(this, state.mFT.id),
        {
          errorMessage: "La FT suivante n'a pas été trouvée 😢",
        }
      );
      if (!res) return;
      if (!res.data) {
        alert("🎉 Tu as atteint la dernière FT ! 🎉");
        return this.$router.push({
          path: `/ft`,
        });
      }
      return this.$router.push({
        path: `/ft/${res.data.id}`,
      });
    },

    async updateTimeWindow(
      { commit, dispatch, state },
      timeWindow: FTTimeWindow
    ) {
      const adaptedTimeWindow = getTimeWindowWithoutRequests(timeWindow);
      const res = await safeCall(
        this,
        repo.updateFTTimeWindow(this, state.mFT.id, adaptedTimeWindow),
        {
          successMessage: "Créneau modifié 🥳",
          errorMessage: "Créneau non modifié 😢",
        }
      );
      if (!res) return;
      const savedTimeWindow = castTimeWindowWithDate(res.data);
      const previousTimeWindow = state.mFT.timeWindows.find(
        ({ id }) => id === savedTimeWindow.id
      );
      const { teamRequests, userRequests } = timeWindow;
      commit("UPDATE_TIME_WINDOW", {
        ...savedTimeWindow,
        teamRequests,
        userRequests,
      });
      dispatch("updateGearRequestRentalPeriod", {
        previous: previousTimeWindow,
        updated: savedTimeWindow,
      });
    },

    async updateTimeWindowRequirements(
      { commit, state },
      timeWindow: FTTimeWindow
    ) {
      if (!timeWindow.id) return;
      const adaptedUserRequests: FTUserRequestUpdate[] =
        timeWindow.userRequests.map((ur) => ({
          userId: ur.user.id,
        }));
      const adaptedTeamRequests: FTTeamRequestUpdate[] =
        timeWindow.teamRequests.map((tr) => ({
          teamCode: tr.team.code,
          quantity: tr.quantity,
        }));

      const [resUserRequests, resTeamRequests] = await Promise.all([
        safeCall(
          this,
          repo.updateFTUserRequests(
            this,
            state.mFT.id,
            timeWindow.id,
            adaptedUserRequests
          ),
          {
            successMessage: "Demandes de bénévole mises à jour 🥳",
            errorMessage: "Demandes de bénévoles non mises à jour 😢",
          }
        ),
        safeCall(
          this,
          repo.updateFTTeamRequests(
            this,
            state.mFT.id,
            timeWindow.id,
            adaptedTeamRequests
          ),
          {
            successMessage: "Demandes d'équipes mises à jour 🥳",
            errorMessage: "Demandes d'équipes non mises à jour 😢",
          }
        ),
      ]);
      if (resUserRequests) {
        commit("UPDATE_USER_REQUESTS", {
          timeWindowId: timeWindow.id,
          userRequests: resUserRequests.data,
        });
      }
      if (resTeamRequests) {
        commit("UPDATE_TEAM_REQUESTS", {
          timeWindowId: timeWindow.id,
          teamRequests: resTeamRequests.data,
        });
      }
    },

    async deleteUserRequest(
      { commit, state },
      {
        timeWindow,
        userRequest,
      }: { timeWindow: FTTimeWindow; userRequest: FTUserRequest }
    ) {
      if (!timeWindow?.id) return;
      const res = await safeCall(
        this,
        repo.deleteFTUserRequest(
          this,
          state.mFT.id,
          timeWindow.id,
          userRequest.user.id
        ),
        {
          successMessage: "Demande de bénévole supprimée 🥳",
          errorMessage: "Demande de bénévole non supprimée 😢",
        }
      );
      if (!res) return;
      commit("DELETE_USER_REQUEST", { timeWindow, userRequest });
    },

    async deleteTeamRequest(
      { commit, state },
      {
        timeWindow,
        teamRequest,
      }: { timeWindow: FTTimeWindow; teamRequest: FTTeamRequest }
    ) {
      if (!timeWindow?.id) return;
      const res = await safeCall(
        this,
        repo.deleteFTTeamRequest(
          this,
          state.mFT.id,
          timeWindow.id,
          teamRequest.team.code
        ),
        {
          successMessage: "Demande d'équipe supprimée 🥳",
          errorMessage: "Demande d'équipe non supprimée 😢",
        }
      );
      if (!res) return;
      commit("DELETE_TEAM_REQUEST", { timeWindow, teamRequest });
    },

    async deleteTimeWindow({ commit, state }, timeWindow: FTTimeWindow) {
      if (!timeWindow?.id) return;
      const res = await safeCall(
        this,
        repo.deleteFTTimeWindow(this, state.mFT.id, timeWindow.id),
        {
          successMessage: "Créneau supprimé 🥳",
          errorMessage: "Créneau non supprimé 😢",
        }
      );
      if (!res) return;
      commit("DELETE_TIME_WINDOW", timeWindow);
    },

    async resetValidations({ commit, state }) {
      const validationReviews = getValidationReviews(state.mFT.reviews);
      const res = await Promise.all(
        validationReviews.map((review) =>
          safeCall(
            this,
            repo.deleteFTReview(this, state.mFT.id, review.team.code)
          )
        )
      );
      if (!res || res.length !== validationReviews.length) return;
      commit("DELETE_REVIEWS", validationReviews);
    },

    async addFeedback({ commit, state }, feedback: Feedback) {
      const feedbackCreation: FeedbackCreation = {
        ...feedback,
        authorId: feedback.author.id,
      };
      const res = await safeCall(
        this,
        repo.addFTFeedback(this, state.mFT.id, feedbackCreation),
        {
          successMessage: "Commentaire ajouté 🥳",
          errorMessage: "Commentaire non ajouté 😢",
        }
      );
      if (!res) return;
      commit("ADD_FEEDBACK", res.data);
    },

    async addGearRequestForAllRentalPeriods(
      { getters, dispatch },
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
    },

    async addConsumableGearRequestForAllRentalPeriods(
      { getters, dispatch },
      { gearId, quantity }: Pick<GearRequestCreation, "gearId" | "quantity">
    ) {
      const generateGearRequestCreation = generateGearRequestCreationBuilder(
        gearId,
        quantity
      );
      const gearRequestCreationForms = (
        getters.gearRequestRentalPeriods as Period[]
      ).map(generateGearRequestCreation);
      // On passe par une boucle pour éviter les pb de concurrences dans la BDD
      for (const form of gearRequestCreationForms) {
        await dispatch("addGearRequest", form);
      }
    },

    async addGearRequest({ commit, state }, gearRequest: GearRequestCreation) {
      const res = await safeCall(
        this,
        RepoFactory.ftRepo.createGearRequest(this, state.mFT.id, gearRequest),
        {
          successMessage: "La demande de matériel a été ajoutée avec succès ✅",
          errorMessage: "La demande de matériel n'a pas pu etre ajoutée ❌",
        }
      );
      if (!res) return;
      const createdGearRequest = castGearRequestWithDate(res.data);
      commit("ADD_GEAR_REQUEST", createdGearRequest);
      return createdGearRequest;
    },

    async removeGearRelatedGearRequest({ commit, state }, gearId: number) {
      const removals = await Promise.all(
        state.gearRequests
          .filter((gearRequest) => gearRequest.gear.id === gearId)
          .map((gearRequest) =>
            safeCall(
              this,
              repo.deleteGearRequest(
                this,
                state.mFT.id,
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
      if (removals.some((res) => res === undefined)) return;
      commit("REMOVE_GEAR_RELATED_GEAR_REQUESTS", gearId);
    },

    async addGearRequestRentalPeriod(
      { dispatch, getters },
      rentalPeriod: Omit<Period, "id">
    ) {
      const gearRequests =
        getters.uniqueByGearGearRequests as StoredGearRequest<"FT">[];
      if (gearRequests.length === 0) return;
      const [firstGearRequest, ...otherGearRequests] = gearRequests;

      const periodId = await dispatch("getFirstSavedGearRequestPeriodId", {
        gearRequest: firstGearRequest,
        rentalPeriod,
      });

      otherGearRequests.map(({ gear: { id: gearId }, quantity }) =>
        dispatch("addGearRequest", { gearId, quantity, periodId })
      );
    },

    async getFirstSavedGearRequestPeriodId(
      { dispatch },
      {
        gearRequest,
        rentalPeriod,
      }: {
        gearRequest: StoredGearRequest<"FT">;
        rentalPeriod: Omit<Period, "id">;
      }
    ): Promise<number> {
      const firstGearRequestCreation = {
        gearId: gearRequest.gear.id,
        quantity: gearRequest.quantity,
        ...rentalPeriod,
      };
      const {
        rentalPeriod: { id: periodId },
      } = await dispatch("addGearRequest", firstGearRequestCreation);
      return periodId;
    },

    async removeGearRequestRentalPeriod(
      { commit, state },
      { start, end }: Omit<Period, "id">
    ) {
      const deletedPeriod = { start, end, id: -1 };
      const toDeleteGearRequests = state.gearRequests.filter(
        ({ rentalPeriod }) => isSimilarPeriod(deletedPeriod)(rentalPeriod)
      );
      const responses = await Promise.all(
        toDeleteGearRequests.map((gearRequest) =>
          safeCall(
            this,
            repo.deleteGearRequest(
              this,
              state.mFT.id,
              gearRequest.gear.id,
              gearRequest.rentalPeriod.id
            ),
            {
              successMessage: "La demande de matériel a été supprimée 🗑️",
              errorMessage: "La demande de matériel na pas a été supprimée ❌",
            }
          )
        )
      );
      if (responses.some((response) => response === undefined)) return;
      toDeleteGearRequests.map((gearRequest) =>
        commit("DELETE_GEAR_REQUESTS", gearRequest)
      );
    },

    async updateGearRequestRentalPeriod(
      { commit, dispatch, state },
      {
        previous,
        updated,
      }: { previous: Omit<Period, "id">; updated: Omit<Period, "id"> }
    ) {
      const previousPeriod = {
        start: previous.start,
        end: previous.end,
        id: -1,
      };
      const toUpdateGearRequest = state.gearRequests.find(({ rentalPeriod }) =>
        isSimilarPeriod(previousPeriod)(rentalPeriod)
      );
      if (!toUpdateGearRequest) {
        dispatch("addGearRequestRentalPeriod", updated);
        return;
      }
      const res = await safeCall(
        this,
        repo.updateGearRequest(
          this,
          state.mFT.id,
          toUpdateGearRequest.gear.id,
          toUpdateGearRequest.rentalPeriod.id,
          { start: updated.start, end: updated.end }
        ),
        {
          successMessage:
            "La demande de matériel a été mise a jour avec succès ✅",
          errorMessage: "La demande de matériel n'a pas a été mise a jour ❌",
        }
      );
      if (!res) return;
      const updatedGearRequest = castGearRequestWithDate(res.data);
      commit(
        "UPATE_GEAR_REQUESTS_RENTAL_PERIOD",
        updatedGearRequest.rentalPeriod
      );
    },

    async setDriveToGearRequest(
      { commit },
      gearRequest: GearRequestWithDrive<"FT">
    ) {
      commit("UDPATE_GEAR_REQUEST", gearRequest);
    },

    async validateGearRequests(
      { state, dispatch },
      gearRequests: GearRequestWithDrive<"FA" | "FT">[]
    ) {
      await Promise.all(
        gearRequests.map((gr) =>
          safeCall<GearRequestWithDrive<"FT">>(
            this,
            repo.validateGearRequest(this, state.mFT.id, gr),
            {
              successMessage: "Validation effectuée ✅",
              errorMessage: "La tentative de validation n'a pas abouti",
            }
          )
        )
      );
      dispatch("fetchGearRequests");
    },
  }
);

function defaultState(): Omit<FT, "id"> {
  return {
    name: "",
    status: FTStatus.DRAFT,
    description: "",
    isStatic: false,
    timeWindows: [],
    feedbacks: [],
    reviews: [],
    isDeleted: false,
  };
}
