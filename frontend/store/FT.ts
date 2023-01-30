import { actionTree, getterTree, mutationTree } from "typed-vuex";
import { RepoFactory } from "~/repositories/repoFactory";
import { safeCall } from "~/utils/api/calls";
import {
  FTCreation,
  FT,
  FTStatus,
  FTSearch,
  FTTimeWindow,
  FTTeamRequest,
  toUpdateFT,
  getTimeWindowWithoutRequests,
  castTimeWindowWithDate,
  castFTWithDate,
  FTSimplified,
  FTUserRequestUpdate,
  FTTeamRequestUpdate,
} from "~/utils/models/ft";
import {
  Feedback,
  FeedbackCreation,
  SubjectType,
} from "~/utils/models/feedback";
import { User } from "~/utils/models/user";
import { updateItemToList } from "~/utils/functions/list";
import { Team } from "~/utils/models/team";
import { formatUsername } from "~/utils/user/userUtils";
import { Review, Reviewer } from "~/utils/models/review";
import {
  castGearRequestWithDate,
  GearRequestCreation,
  Period,
  StoredGearRequest,
} from "~/utils/models/gearRequests";
import {
  generateGearRequestCreationBuilder,
  uniqueGerRequestPeriodsReducer,
  uniquePeriodsReducer,
} from "~/utils/functions/gearRequest";

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
    const savedPeriods = uniqueGerRequestPeriodsReducer(state.gearRequests);
    const ftPeriods = getters.ftPeriods;
    return uniquePeriodsReducer([...savedPeriods, ...ftPeriods]);
  },
  localGearRequestRentalPeriods(state, getters): Period[] {
    return (getters.gearRequestRentalPeriods as Period[]).filter(
      ({ id }) => id <= state.localGearRequestRentalPeriodId
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
    mFT.timeWindows = [
      ...mFT.timeWindows.slice(0, index),
      timeWindow,
      ...mFT.timeWindows.slice(index + 1),
    ];
  },

  DELETE_TIME_WINDOW({ mFT }, timeWindow: FTTimeWindow) {
    mFT.timeWindows = mFT.timeWindows.filter((tw) => tw.id !== timeWindow.id);
  },

  UPDATE_USER_REQUESTS(
    { mFT },
    {
      timeWindowId,
      userRequests,
    }: { timeWindowId: number; userRequests: User[] }
  ) {
    const index = mFT.timeWindows.findIndex((tw) => tw.id === timeWindowId);
    if (index === -1) return;
    mFT.timeWindows[index].userRequests = userRequests;
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
    mFT.timeWindows[index].teamRequests = teamRequests;
  },

  DELETE_USER_REQUEST(
    { mFT },
    { timeWindow, userRequest }: { timeWindow: FTTimeWindow; userRequest: User }
  ) {
    const index = mFT.timeWindows.findIndex((tw) => tw.id === timeWindow.id);
    if (index === -1) return;
    const userRequests = timeWindow.userRequests.filter(
      (ur) => ur.id !== userRequest.id
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

  ADD_FEEDBACK({ mFT }, feedback: Feedback) {
    mFT.feedbacks = [...mFT.feedbacks, feedback];
  },

  ADD_GEAR_REQUEST(state, gearRequest: StoredGearRequest<"FT">) {
    state.gearRequests = [...state.gearRequests, gearRequest];
  },

  SET_GEAR_REQUESTS(state, gearRequestsResponse: StoredGearRequest<"FT">[]) {
    state.gearRequests = gearRequestsResponse;
  },

  REMOVE_GEAR_RELATED_GEAR_REQUESTS(state, gearId: number) {
    state.gearRequests = state.gearRequests.filter(
      (gr) => gr.gear.id !== gearId
    );
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
      const ftToUpdate = toUpdateFT({
        ...state.mFT,
        status: FTStatus.SUBMITTED,
      });
      const res = await safeCall(this, repo.updateFT(this, ftToUpdate), {
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
        comment: `La FA a été refusée${message ? `: ${message}` : "."}`,
        author,
        createdAt: new Date(),
      };
      dispatch("addFeedback", feedback);
    },

    async updateTimeWindow({ commit, state }, timeWindow: FTTimeWindow) {
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
      commit("UPDATE_TIME_WINDOW", castTimeWindowWithDate(res.data));
    },

    async updateTimeWindowRequirements(
      { commit, state },
      timeWindow: FTTimeWindow
    ) {
      if (!timeWindow.id) return;
      const adaptedUserRequests: FTUserRequestUpdate[] =
        timeWindow.userRequests.map((ur) => ({
          userId: ur.id,
        }));
      const adaptedTeamRequests: FTTeamRequestUpdate[] =
        timeWindow.teamRequests.map((tr) => ({
          teamCode: tr.team.code,
          quantity: tr.quantity,
        }));

      const [resTeamRequests, resUserRequests] = await Promise.all([
        safeCall(
          this,
          repo.updateFTUserRequests(
            this,
            state.mFT.id,
            timeWindow.id,
            adaptedUserRequests
          )
        ),
        safeCall(
          this,
          repo.updateFTTeamRequests(
            this,
            state.mFT.id,
            timeWindow.id,
            adaptedTeamRequests
          )
        ),
      ]);
      if (resUserRequests)
        commit("UPDATE_USER_REQUESTS", {
          timeWindowId: timeWindow.id,
          userRequests: resUserRequests.data,
        });
      if (resTeamRequests)
        commit("UPDATE_TEAM_REQUESTS", {
          timeWindowId: timeWindow.id,
          teamRequests: resTeamRequests.data,
        });
    },

    async deleteUserRequest(
      { commit },
      {
        timeWindow,
        userRequest,
      }: { timeWindow: FTTimeWindow; userRequest: User }
    ) {
      commit("DELETE_USER_REQUEST", { timeWindow, userRequest });
      // request
    },

    async deleteTeamRequest(
      { commit },
      {
        timeWindow,
        teamRequest,
      }: { timeWindow: FTTimeWindow; teamRequest: FTTeamRequest }
    ) {
      commit("DELETE_TEAM_REQUEST", { timeWindow, teamRequest });
      // request
    },

    async deleteTimeWindow({ commit, state }, timeWindow: FTTimeWindow) {
      if (!timeWindow?.id) return;
      const res = await safeCall(
        this,
        repo.deleteFTTimeWindow(this, state.mFT.id, timeWindow.id)
      );
      if (!res) return;
      commit("DELETE_TIME_WINDOW", timeWindow);
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
    },

    async removeGearRequest({ commit, state }, gearId: number) {
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
