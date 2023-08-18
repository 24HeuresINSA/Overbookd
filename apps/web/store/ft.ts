import { actionTree, getterTree, mutationTree } from "typed-vuex";
import { updateItemToList } from "@overbookd/list";
import { RepoFactory } from "~/repositories/repo-factory";
import { safeCall } from "~/utils/api/calls";
import { getValidationReviews } from "~/utils/festival-event/ftUtils";
import {
  generateGearRequestCreationBuilder,
  isSameGearRequest,
  isSimilarGearRequest,
  isSimilarPeriod,
  splitGearRequest,
  uniqueByGearReducer,
  uniqueGearRequestPeriodsReducer,
  uniquePeriodsReducer,
} from "~/utils/functions/gearRequest";
import {
  Feedback,
  FeedbackCreation,
  FtFeedback,
  FtFeedbackSubjectType,
} from "~/utils/models/feedback";
import {
  Ft,
  FtCreation,
  FtPageId,
  FtSearch,
  FtSimplified,
  FtStatus,
  FtTeamRequest,
  FtTeamRequestUpdate,
  FtTimeWindow,
  FtUserRequest,
  FtUserRequestUpdate,
  castFTWithDate,
  castFtTimeWindowWithDate,
  getFtTimeWindowWithoutRequests,
  toUpdateFT,
} from "~/utils/models/ft";
import { FtTimeSpanParameters } from "~/utils/models/ftTimeSpan";
import {
  GearRequestCreation,
  GearRequestWithDrive,
  Period,
  StoredGearRequest,
  castGearRequestWithDate,
} from "~/utils/models/gearRequests";
import { Review, Reviewer } from "~/utils/models/review";
import { Team } from "~/utils/models/team";
import { User } from "~/utils/models/user";
import { formatUsername } from "~/utils/user/userUtils";

const repo = RepoFactory.FtRepository;

export const state = () => ({
  mFT: defaultState() as Ft,
  FTs: [] as FtSimplified[],
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
  UPDATE_SELECTED_FT(state, ft: Partial<Ft>) {
    state.mFT = { ...state.mFT, ...ft };
  },

  SET_FTS(state, fts: FtSimplified[]) {
    state.FTs = fts;
  },

  ADD_FT({ FTs }, ft: Ft) {
    FTs.push(ft);
  },

  DELETE_FT(state, ftId: number) {
    state.FTs = state.FTs.filter((ft) => ft.id !== ftId);
  },

  ADD_TIME_WINDOW({ mFT }, timeWindow: FtTimeWindow) {
    mFT.timeWindows = [...mFT.timeWindows, timeWindow];
  },

  UPDATE_TIME_WINDOW({ mFT }, timeWindow: FtTimeWindow) {
    const index = mFT.timeWindows.findIndex((tw) => tw.id === timeWindow.id);
    if (index === -1) return;
    mFT.timeWindows = updateItemToList(mFT.timeWindows, index, timeWindow);
  },

  DELETE_TIME_WINDOW({ mFT }, timeWindow: FtTimeWindow) {
    mFT.timeWindows = mFT.timeWindows.filter((tw) => tw.id !== timeWindow.id);
  },

  UPDATE_USER_REQUESTS(
    { mFT },
    {
      timeWindowId,
      userRequests,
    }: { timeWindowId: number; userRequests: FtUserRequest[] }
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
    }: { timeWindowId: number; teamRequests: FtTeamRequest[] }
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
    }: { timeWindow: FtTimeWindow; userRequest: FtUserRequest }
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
    }: { timeWindow: FtTimeWindow; teamRequest: FtTeamRequest }
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

  ADD_FEEDBACK({ mFT }, feedback: FtFeedback) {
    mFT.feedbacks = [...mFT.feedbacks, feedback];
  },

  ADD_GEAR_REQUEST(state, gearRequest: StoredGearRequest<"FT">) {
    const index = state.gearRequests.findIndex(
      isSimilarGearRequest(gearRequest)
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
      (gr) => !isSameGearRequest(gearRequest)(gr)
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

    async fetchFTs({ commit }, search?: FtSearch) {
      const res = await safeCall(this, repo.getAllFTs(this, search), {
        errorMessage: "Impossible de charger les FTs",
      });
      if (!res) return;
      commit("SET_FTS", res.data);
    },

    async createFT({ commit }, ft: FtCreation) {
      const res = await safeCall(this, repo.createFT(this, ft), {
        successMessage: "FT créée 🥳",
        errorMessage: "FT non créée 😢",
      });

      if (!res) return;
      const createdFT = castFTWithDate(res.data);
      const completeFT = { ...defaultState(), ...createdFT, id: res.data.id };
      commit("ADD_FT", createdFT);
      commit("UPDATE_SELECTED_FT", completeFT);
    },

    async updateFT({ commit }, ft: Ft) {
      const ftToUpdate = toUpdateFT(ft);
      const res = await safeCall(this, repo.updateFT(this, ftToUpdate), {
        successMessage: "FT sauvegardée 🥳",
        errorMessage: "FT non sauvegardée 😢",
      });

      if (!res) return;
      const updatedFT = castFTWithDate(res.data);
      commit("UPDATE_SELECTED_FT", updatedFT);
    },

    async deleteFT({ commit }, ft: Ft) {
      const res = await safeCall(this, repo.deleteFT(this, ft.id), {
        successMessage: "FT supprimée 🥳",
        errorMessage: "FT non supprimée 😢",
      });
      if (!res) return;
      commit("DELETE_FT", ft.id);
    },

    async restoreFT({ commit, dispatch }, ft: Ft) {
      const restoredFT = { ...ft, isDeleted: false };
      dispatch("updateFT", restoredFT);
      commit("DELETE_FT", ft.id);
    },

    async addTimeWindow({ commit, state }, timeWindow: FtTimeWindow) {
      const adaptedTimeWindow = getFtTimeWindowWithoutRequests(timeWindow);
      const res = await safeCall(
        this,
        repo.updateFTTimeWindow(this, state.mFT.id, adaptedTimeWindow),
        {
          successMessage: "Créneau ajouté 🥳",
          errorMessage: "Créneau non ajouté 😢",
        }
      );
      if (!res) return;
      commit("ADD_TIME_WINDOW", castFtTimeWindowWithDate(res.data));
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
        subject: FtFeedbackSubjectType.SUBMIT,
        comment: `La FT a été soumise à validation par ${authorName}.`,
        author,
        createdAt: new Date(),
      };
      dispatch("addFeedback", feedback);
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
        subject: FtFeedbackSubjectType.VALIDATED,
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
        subject: FtFeedbackSubjectType.REFUSED,
        comment: `La FT a été refusée${message ? `: ${message}` : "."}`,
        author,
        createdAt: new Date(),
      };
      dispatch("addFeedback", feedback);
    },

    async switchToReadyForAssignment(
      { dispatch, commit, state },
      {
        author,
        timeSpanParameters,
      }: { author: User; timeSpanParameters: FtTimeSpanParameters }
    ) {
      const resFT = await safeCall(
        this,
        repo.switchToReadyForAssignment(this, state.mFT.id, timeSpanParameters),
        { successMessage: "FT prête à affectation 🥳" }
      );
      if (!resFT) return;
      const updatedFT = castFTWithDate(resFT.data);
      commit("UPDATE_SELECTED_FT", updatedFT);

      const feedback: Feedback = {
        subject: FtFeedbackSubjectType.READY,
        comment: "Prête pour affectation !",
        author,
        createdAt: new Date(),
      };
      dispatch("addFeedback", feedback);
    },

    async previousPage({ state }) {
      const res = await safeCall<FtPageId>(
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
      const res = await safeCall<FtPageId>(
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
      timeWindow: FtTimeWindow
    ) {
      const adaptedTimeWindow = getFtTimeWindowWithoutRequests(timeWindow);
      const res = await safeCall(
        this,
        repo.updateFTTimeWindow(this, state.mFT.id, adaptedTimeWindow),
        {
          successMessage: "Créneau modifié 🥳",
          errorMessage: "Créneau non modifié 😢",
        }
      );
      if (!res) return;
      const savedTimeWindow = castFtTimeWindowWithDate(res.data);
      const { teamRequests, userRequests } = timeWindow;
      const previousTimeWindow = state.mFT.timeWindows.find(
        ({ id }) => id === savedTimeWindow.id
      );
      commit("UPDATE_TIME_WINDOW", {
        ...savedTimeWindow,
        teamRequests,
        userRequests,
      });
      if (!previousTimeWindow) return;
      const previousPeriod = {
        start: previousTimeWindow.start,
        end: previousTimeWindow.end,
      };
      dispatch("updateGearRequestRentalPeriod", previousPeriod);
    },

    async updateTimeWindowRequirements(
      { commit, state },
      timeWindow: FtTimeWindow
    ) {
      if (!timeWindow.id) return;
      const adaptedUserRequests: FtUserRequestUpdate[] =
        timeWindow.userRequests.map((ur) => ({
          userId: ur.user.id,
        }));
      const adaptedTeamRequests: FtTeamRequestUpdate[] =
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
      }: { timeWindow: FtTimeWindow; userRequest: FtUserRequest }
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
      }: { timeWindow: FtTimeWindow; teamRequest: FtTeamRequest }
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

    async deleteTimeWindow({ commit, state }, timeWindow: FtTimeWindow) {
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

    async addFeedback({ commit, state }, feedback: FtFeedback) {
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
      const createdAt = new Date(res.data.createdAt);
      commit("ADD_FEEDBACK", { ...res.data, createdAt });
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

    async addGearRequestForAllFtPeriods(
      { getters, dispatch },
      { gearId, quantity }: Pick<GearRequestCreation, "gearId" | "quantity">
    ) {
      const generateGearRequestCreation = generateGearRequestCreationBuilder(
        gearId,
        quantity
      );
      const periods = uniquePeriodsReducer(getters.ftPeriods) as Period[];
      const gearRequestCreationForms = periods.map(generateGearRequestCreation);
      await Promise.all(
        gearRequestCreationForms.map((form) => dispatch("addGearRequest", form))
      );
    },

    async addConsumableGearRequestForAllFtPeriods(
      { getters, dispatch },
      { gearId, quantity }: Pick<GearRequestCreation, "gearId" | "quantity">
    ) {
      const generateGearRequestCreation = generateGearRequestCreationBuilder(
        gearId,
        quantity
      );
      const periods = uniquePeriodsReducer(getters.ftPeriods) as Period[];
      const period = {
        start: new Date(
          Math.min(...periods.map(({ start }) => start.getTime()))
        ),
        end: new Date(Math.max(...periods.map(({ end }) => end.getTime()))),
        id: -1,
      };
      const gearRequestCreationForm = generateGearRequestCreation(period);
      dispatch("addGearRequest", gearRequestCreationForm);
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
        repo.createGearRequest(this, state.mFT.id, gearRequest),
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

    async removeRelatedGearRequest({ commit, state }, gearId: number) {
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

    async removeGearRequest({ commit }, gearRequest: StoredGearRequest<"FT">) {
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
      commit("DELETE_GEAR_REQUEST", gearRequest);
    },

    async fetchGearRequests({ commit, state }) {
      const res = await safeCall(
        this,
        repo.getGearRequests(this, state.mFT.id)
      );
      if (!res) return;
      const gearRequests = res.data.map(castGearRequestWithDate);
      commit("SET_GEAR_REQUESTS", gearRequests);
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
      dispatch("fetchGearRequests");
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
      { dispatch, state, getters },
      { start, end }: Omit<Period, "id">
    ) {
      const deletedPeriod = { start, end, id: -1 };
      const toDeleteGearRequests = state.gearRequests.filter(
        ({ rentalPeriod }) => isSimilarPeriod(deletedPeriod)(rentalPeriod)
      );
      const responses = await Promise.all(
        toDeleteGearRequests.map(async (gearRequest) => {
          const toCreateGearRequests = splitGearRequest(
            gearRequest,
            { start, end },
            getters.ftPeriods
          );
          await safeCall(
            this,
            repo.deleteGearRequest(
              this,
              state.mFT.id,
              gearRequest.gear.id,
              gearRequest.rentalPeriod.id
            ),
            {
              successMessage: "La demande de matériel a été supprimée 🗑️",
              errorMessage: "La demande de matériel n'a pas a été supprimée ❌",
            }
          );
          return Promise.all(
            toCreateGearRequests.map((gr) => {
              const gearRequestCreation = {
                gearId: gr.gear.id,
                quantity: gr.quantity,
                start: gr.rentalPeriod.start,
                end: gr.rentalPeriod.end,
              };
              return safeCall(
                this,
                repo.createGearRequest(this, state.mFT.id, gearRequestCreation)
              );
            })
          );
        })
      );
      if (responses.some((response) => response === undefined)) return;
      dispatch("fetchGearRequests");
    },

    async updateGearRequestRentalPeriod(
      { state, dispatch, getters },
      previousPeriod: Omit<Period, "id">
    ) {
      await safeCall(
        this,
        repo.removeGearRequestRentalPeriod(this, state.mFT.id, previousPeriod)
      );
      const gearRequests =
        getters.uniqueByGearGearRequests as StoredGearRequest<"FT">[];
      await Promise.all(
        gearRequests.map(({ gear, quantity }) => {
          const form = {
            gearId: gear.id,
            quantity,
          };
          if (gear.isConsumable)
            return dispatch("addConsumableGearRequestForAllFtPeriods", form);
          return dispatch("addGearRequestForAllFtPeriods", form);
        })
      );
      dispatch("fetchGearRequests");
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

function defaultState(): Omit<Ft, "id"> {
  return {
    name: "",
    status: FtStatus.DRAFT,
    description: "",
    isStatic: false,
    timeWindows: [],
    feedbacks: [],
    reviews: [],
    isDeleted: false,
  };
}
