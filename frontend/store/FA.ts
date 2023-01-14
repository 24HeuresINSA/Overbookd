import { actionTree, getterTree, mutationTree } from "typed-vuex";
import { RepoFactory } from "~/repositories/repoFactory";
import { safeCall } from "~/utils/api/calls";
import { isAnimationValidatedBy } from "~/utils/fa/faUtils";
import {
  collaborator,
  CreateFA,
  FA,
  FaSitePublishAnimation,
  fa_collaborators,
  fa_comments,
  fa_electricity_needs,
  fa_signa_needs,
  fa_validation_body,
  GearRequest,
  GearRequestCreation,
  GearRequestWithDrive,
  Period,
  SearchFA,
  SortedStoredGearRequests,
  Status,
  StoredGearRequest,
  subject_type,
  time_windows,
  time_windows_type,
} from "~/utils/models/FA";
import { sendNotification } from "./catalog";

const repo = RepoFactory.faRepo;

export const state = () => ({
  FAs: [] as FA[],
  mFA: {
    status: Status.DRAFT,
    name: "",
  } as FA,
  gearRequests: [] as StoredGearRequest[],
  localGearRequestRentalPeriods: [] as Period[],
  localGearRequestRentalPeriodId: 1001,
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
  animationTimeWindows(state): time_windows[] {
    return (
      state.mFA.time_windows?.filter(
        (timeWindow) => timeWindow.type === time_windows_type.ANIM
      ) ?? []
    );
  },
  gearRequestRentalPeriods(state): Period[] {
    const savedPeriods = state.gearRequests.reduce((periods, gearRequest) => {
      const period = periods.find(
        (period) =>
          period.id === gearRequest.rentalPeriod.id ||
          (period.start === gearRequest.rentalPeriod.start &&
            period.end === gearRequest.rentalPeriod.end)
      );
      if (period) return periods;
      return [...periods, gearRequest.rentalPeriod];
    }, [] as Period[]);
    return [...savedPeriods, ...state.localGearRequestRentalPeriods];
  },
  uniqueByGearGearRequests(state): StoredGearRequest[] {
    return state.gearRequests.reduce((gearRequests, gearRequest) => {
      const savedGearRequest = gearRequests.find(
        (gr) => gr.gear.id === gearRequest.gear.id
      );
      if (savedGearRequest) return gearRequests;
      return [...gearRequests, gearRequest];
    }, [] as StoredGearRequest[]);
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
  SET_FA(state, fa: Partial<FA>) {
    state.mFA = { ...state.mFA, ...fa };
  },

  RESET_FA(state) {
    state.mFA = {
      status: Status.DRAFT,
      name: "",
    } as FA;
  },

  UPDATE_STATUS({ mFA }, status: Status) {
    mFA.status = status;
  },

  UPDATE_FA({ mFA }, { key, value }) {
    if (typeof mFA[key as keyof FA] !== "undefined") {
      mFA[key as keyof FA] = value as never;
    }
  },

  ADD_COMMENT({ mFA }, comment: fa_comments) {
    if (!mFA.fa_comments) mFA.fa_comments = [];
    mFA.fa_comments?.push(comment);
  },

  ADD_SIGNA_NEED({ mFA }, signaNeed: fa_signa_needs) {
    if (!mFA.fa_signa_needs) mFA.fa_signa_needs = [];
    mFA.fa_signa_needs?.push(signaNeed);
  },

  UPDATE_SIGNA_NEED_COUNT({ mFA }, { index, count }) {
    if (mFA.fa_signa_needs && mFA.fa_signa_needs[index]) {
      mFA.fa_signa_needs[index].count = Number(count);
    }
  },

  DELETE_SIGNA_NEED({ mFA }, index: number) {
    if (mFA.fa_signa_needs && mFA.fa_signa_needs[index]) {
      mFA.fa_signa_needs.splice(index, 1);
    }
  },

  ADD_TIME_WINDOW({ mFA }, timeWindow: time_windows) {
    if (!mFA.time_windows) mFA.time_windows = [];
    mFA.time_windows?.push(timeWindow);
  },

  UPDATE_TIME_WINDOW({ mFA }, { index, timeWindow }) {
    if (mFA.time_windows && mFA.time_windows[index]) {
      mFA.time_windows[index].start = timeWindow.start;
      mFA.time_windows[index].end = timeWindow.end;
      mFA.time_windows[index].type = timeWindow.type;
    }
  },

  DELETE_TIME_WINDOW({ mFA }, index: number) {
    if (mFA.time_windows && mFA.time_windows[index]) {
      mFA.time_windows.splice(index, 1);
    }
  },

  ADD_COLLABORATOR({ mFA }, collaborator: fa_collaborators) {
    if (!mFA.fa_collaborators) mFA.fa_collaborators = [];
    mFA.fa_collaborators?.push(collaborator);
  },

  UPDATE_COLLABORATOR({ mFA }, { index, key, value }) {
    if (!mFA.fa_collaborators || !mFA.fa_collaborators[index]) return;
    mFA.fa_collaborators[index].collaborator[key as keyof collaborator] =
      value as never;
  },

  DELETE_COLLABORATOR({ mFA }, index: number) {
    if (mFA.fa_collaborators && mFA.fa_collaborators[index]) {
      mFA.fa_collaborators.splice(index, 1);
    }
  },

  ADD_ELECTRICITY_NEED({ mFA }, elecNeed: fa_electricity_needs) {
    if (!mFA.fa_electricity_needs) mFA.fa_electricity_needs = [];
    mFA.fa_electricity_needs?.push(elecNeed);
  },

  UPDATE_ELECTRICITY_NEED({ mFA }, { index, elecNeed }) {
    if (!mFA.fa_electricity_needs || !mFA.fa_electricity_needs[index]) return;
    mFA.fa_electricity_needs[index].electricity_type =
      elecNeed.electricity_type;
    mFA.fa_electricity_needs[index].device = elecNeed.device;
    mFA.fa_electricity_needs[index].power = elecNeed.power;
    mFA.fa_electricity_needs[index].count = elecNeed.count;
    mFA.fa_electricity_needs[index].comment = elecNeed.comment;
  },

  DELETE_ELECTRICITY_NEED({ mFA }, index: number) {
    if (mFA.fa_electricity_needs && mFA.fa_electricity_needs[index]) {
      mFA.fa_electricity_needs.splice(index, 1);
    }
  },

  ADD_GEAR_REQUEST({ gearRequests }, gearRequest: StoredGearRequest) {
    gearRequests.push(gearRequest);
  },

  SET_GEAR_REQUESTS(state, gearRequestsResponse: StoredGearRequest[]) {
    state.gearRequests = gearRequestsResponse;
  },

  UDPATE_GEAR_REQUEST(state, updatedGearRequest: GearRequestWithDrive) {
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

  REMOVE_GEAR_REQUEST(state, gearRequest: GearRequest) {
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
      state.localGearRequestRentalPeriodId + 1;
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

  SET_COMMENTS({ mFA }, comments: fa_comments[]) {
    mFA.fa_comments = comments;
  },

  SET_FAS(state, fas: FA[]) {
    state.FAs = fas;
  },

  ADD_FA({ FAs }, fa: FA) {
    FAs.push(fa);
  },

  DELETE_FA(state, faId: number) {
    state.FAs = state.FAs.filter((fa) => fa.id !== faId);
  },

  UPDATE_PUBLISH_ANIMATION({ mFA }, publishAnimation: FaSitePublishAnimation) {
    mFA.faSitePublishAnimation = {
      ...mFA.faSitePublishAnimation,
      faId: mFA.id,
      photoLink: publishAnimation.photoLink ?? "",
      description: publishAnimation.description ?? "",
      categories: publishAnimation.categories ?? [],
    };
  },

  DELETE_PUBLISH_ANIMATION({ mFA }) {
    mFA.faSitePublishAnimation = undefined;
  },
});

export const actions = actionTree(
  { state },
  {
    setFA({ commit }, FA: FA) {
      commit("SET_FA", FA);
    },

    resetFA({ commit }, payload) {
      commit("RESET_FA", payload);
    },

    getAndSet: async function ({ commit }, id: number) {
      const [resFA, resGearRequests] = await Promise.all([
        safeCall(this, repo.getFAByCount(this, id)),
        safeCall(this, repo.getGearRequests(this, id)),
      ]);
      if (!resGearRequests || !resFA) return null;
      commit("SET_GEAR_REQUESTS", resGearRequests.data);
      commit("SET_FA", resFA.data);
      commit("RESET_LOCAL_GEAR_REQUEST_RENTAL_PERIODS");
      return resFA.data;
    },

    submitForReview: async function (
      { commit, dispatch },
      { faId, authorId, author }
    ) {
      const authorName = `${author.firstname} ${author.lastname}`;
      if (!faId || !authorId || !author) return;
      const comment: fa_comments = {
        subject: subject_type.SUBMIT,
        comment: `La FA a été soumise par ${authorName}.`,
        author: authorId,
        created_at: new Date(),
      };
      dispatch("addComment", { comment, defaultAuthor: author });
      commit("UPDATE_STATUS", Status.SUBMITTED);
    },

    updateFA({ commit }, { key, value }) {
      commit("UPDATE_FA", { key, value });
    },

    save: async function ({ dispatch, state }) {
      const allPromise = [];
      allPromise.push(
        RepoFactory.faRepo.updateFA(this, state.mFA.id, state.mFA)
      );
      if (state.mFA.fa_collaborators) {
        allPromise.push(
          RepoFactory.faRepo.updateFACollaborators(
            this,
            state.mFA.id,
            state.mFA.fa_collaborators
          )
        );
      }
      if (state.mFA.fa_signa_needs) {
        allPromise.push(
          RepoFactory.faRepo.updateFASignaNeeds(
            this,
            state.mFA.id,
            state.mFA.fa_signa_needs
          )
        );
      }
      if (state.mFA.time_windows) {
        allPromise.push(
          RepoFactory.faRepo.updateFATimeWindows(
            this,
            state.mFA.id,
            state.mFA.time_windows
          )
        );
      }
      if (state.mFA.fa_electricity_needs) {
        allPromise.push(
          RepoFactory.faRepo.updateFAElectricityNeeds(
            this,
            state.mFA.id,
            state.mFA.fa_electricity_needs
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
      { validator_id, team_name, author }
    ) {
      //check if the team is already in the list
      if (state.mFA.fa_validation?.find((v) => v.Team.id === validator_id))
        return;
      if (state.mFA.fa_refuse?.length === 1) {
        if (state.mFA.fa_refuse[0].Team.id === validator_id) {
          commit("UPDATE_STATUS", Status.SUBMITTED);
        }
      }
      const MAX_VALIDATORS = rootState.team.faValidators.length as number;
      // -1 car la validation est faite avant l'ajout du validateur
      if (state.mFA.fa_validation?.length === MAX_VALIDATORS - 1) {
        // validated by all validators
        commit("UPDATE_STATUS", Status.VALIDATED);
      }
      const body: fa_validation_body = {
        team_id: validator_id,
      };
      await RepoFactory.faRepo.validateFA(this, state.mFA.id, body);
      const comment: fa_comments = {
        subject: subject_type.VALIDATED,
        comment: `La FA a été validée par ${team_name}.`,
        author: author.id,
        created_at: new Date(),
      };
      dispatch("addComment", { comment, defaultAuthor: author });
      dispatch("save");
    },

    refuse: async function (
      { dispatch, commit, state },
      { validator_id, message, author }
    ) {
      commit("UPDATE_STATUS", Status.REFUSED);
      const body: fa_validation_body = {
        team_id: validator_id,
      };
      await RepoFactory.faRepo.refuseFA(this, state.mFA.id, body);
      const comment: fa_comments = {
        subject: subject_type.REFUSED,
        comment: `La FA a été refusée${message ? ": " + message : "."}`,
        author: author.id,
        created_at: new Date(),
      };
      dispatch("addComment", { comment, defaultAuthor: author });
      dispatch("save");
    },

    resetLogValidations: async function (
      { dispatch, state, rootGetters },
      { author }
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
      const comment: fa_comments = {
        subject: subject_type.SUBMIT,
        comment: `La modification du créneau Matos a réinitialisé la validation de ${validTeams}.`,
        author: author.id,
        created_at: new Date(),
      };
      dispatch("addComment", { comment, defaultAuthor: author });
      dispatch("save");
    },

    async addComment(
      { commit, state },
      {
        comment,
        defaultAuthor,
      }: {
        comment: fa_comments;
        defaultAuthor: { firstname: string; lastname: string };
      }
    ) {
      commit("ADD_COMMENT", { ...comment, User_author: defaultAuthor });
      const res = await RepoFactory.faRepo.updateFAComments(
        this,
        state.mFA.id,
        state.mFA.fa_comments ?? []
      );
      commit("SET_COMMENTS", res.data);
    },

    addSignaNeed({ commit }, signaNeed: fa_signa_needs) {
      commit("ADD_SIGNA_NEED", signaNeed);
    },

    updateSignaNeedCount({ commit }, { index, count }) {
      commit("UPDATE_SIGNA_NEED_COUNT", { index, count });
    },

    async deleteSignaNeed({ commit, state }, index: number) {
      if (state.mFA.fa_signa_needs && state.mFA.fa_signa_needs[index]) {
        const id = state.mFA.fa_signa_needs[index].id;
        if (id) {
          await RepoFactory.faRepo.deleteFASignaNeeds(this, id);
        }
      }
      commit("DELETE_SIGNA_NEED", index);
    },

    addTimeWindow({ commit }, timeWindow: time_windows) {
      commit("ADD_TIME_WINDOW", timeWindow);
    },

    updateTimeWindow({ commit }, { index, timeWindow }) {
      commit("UPDATE_TIME_WINDOW", { index, timeWindow });
    },

    async deleteTimeWindow({ commit, state }, index: number) {
      if (state.mFA.time_windows && state.mFA.time_windows[index]) {
        const id = state.mFA.time_windows[index].id;
        if (id) {
          await RepoFactory.faRepo.deleteFATimeWindows(this, id);
        }
      }
      commit("DELETE_TIME_WINDOW", index);
    },

    addCollaborator({ commit }, collaborator: fa_collaborators) {
      commit("ADD_COLLABORATOR", collaborator);
    },

    updateCollaborator({ commit }, { index, key, value }) {
      commit("UPDATE_COLLABORATOR", { index, key, value });
    },

    async deleteCollaborator({ commit, state }, index: number) {
      const collaboratorId =
        state.mFA.fa_collaborators?.[index]?.collaborator?.id;
      if (collaboratorId) {
        await RepoFactory.faRepo.deleteFACollaborators(this, collaboratorId);
      }
      commit("DELETE_COLLABORATOR", index);
    },

    addElectricityNeed({ commit }, elecNeed: fa_electricity_needs) {
      commit("ADD_ELECTRICITY_NEED", elecNeed);
    },

    updateElectricityNeed({ commit }, { index, elecNeed }) {
      commit("UPDATE_ELECTRICITY_NEED", { index, elecNeed });
    },

    async deleteElectricityNeed({ commit, state }, index: number) {
      if (
        state.mFA.fa_electricity_needs &&
        state.mFA.fa_electricity_needs[index]
      ) {
        const id = state.mFA.fa_electricity_needs[index].id;
        if (id) {
          await RepoFactory.faRepo.deleteFAElectricityNeeds(this, id);
        }
      }
      commit("DELETE_ELECTRICITY_NEED", index);
    },

    async addGearRequestRentalPeriod(
      { dispatch, getters, commit },
      rentalPeriod: Omit<Period, "id">
    ) {
      const gearRequests = getters.uniqueByGearGearRequests as GearRequest[];
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
      { commit, getters, dispatch },
      { gearId, quantity }: Pick<GearRequestCreation, "gearId" | "quantity">
    ) {
      const gearRequestCreationForms: GearRequestCreation[] = (
        getters.gearRequestRentalPeriods as Period[]
      ).map(({ start, end, id: periodId }) => {
        const periodPart: { start: Date; end: Date } | { periodId: number } =
          periodId > 1000 ? { start, end } : { periodId };
        return {
          ...periodPart,
          gearId,
          quantity,
        };
      });
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
      commit("ADD_GEAR_REQUEST", res.data);
      return res.data;
    },

    async setDriveToGearRequest({ commit }, gearRequest: GearRequestWithDrive) {
      commit("UDPATE_GEAR_REQUEST", gearRequest);
    },

    async validateGearRequests(
      { state, dispatch },
      gearRequests: GearRequestWithDrive[]
    ) {
      await Promise.all(
        gearRequests.map((gr) =>
          safeCall<GearRequestWithDrive>(
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
      rentalPeriod: Period
    ) {
      if (rentalPeriod.id > 1000) {
        return commit("REMOVE_LOCAL_GEAR_REQUEST_RENTAL_PERIOD", rentalPeriod);
      }
      const impactedGearRequest = state.gearRequests.filter(
        (gr) =>
          gr.rentalPeriod.id === rentalPeriod.id ||
          (gr.rentalPeriod.start === rentalPeriod.start &&
            gr.rentalPeriod.end === rentalPeriod.end)
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
              errorMessage: "La demande de matériel na pas a été supprimée ❌",
            }
          )
        )
      );
      dispatch("fetchGearRequests");
    },

    async removeGearRequest({ commit, state }, gearId: number) {
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
                  "La demande de matériel na pas a été supprimée ❌",
              }
            )
          )
      );
      commit("REMOVE_GEAR_RELATED_GEAR_REQUESTS", gearId);
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

    async fetchGearRequests({ state, commit }) {
      const resGearRequests = await safeCall(
        this,
        repo.getGearRequests(this, state.mFA.id)
      );
      if (!resGearRequests) return null;
      commit("SET_GEAR_REQUESTS", resGearRequests.data);
    },

    async fetchFAs({ commit }, search?: SearchFA) {
      const res = await safeCall<FA[]>(
        this,
        RepoFactory.faRepo.getAllFAs(this, search),
        {
          errorMessage: "Impossible de charger les FAs",
        }
      );
      if (!res) return;
      commit("SET_FAS", res.data);
    },

    async createFa({ commit, dispatch }, fa: CreateFA) {
      const res = await safeCall<FA>(
        this,
        RepoFactory.faRepo.createNewFA(this, fa),
        {
          successMessage: "FA créée 🥳",
          errorMessage: "FA non créée 😢",
        }
      );
      if (!res) return;
      commit("ADD_FA", res.data);
      dispatch("setFA", res.data);
    },

    async deleteFA({ commit }, faId: number) {
      const res = await safeCall(
        this,
        RepoFactory.faRepo.deleteFA(this, faId),
        {
          successMessage: "FA supprimée 🥳",
          errorMessage: "FA non supprimée 😢",
        }
      );
      if (!res) return;
      commit("DELETE_FA", faId);
    },

    async createPublishAnimation({ commit }, faId: number) {
      const publishAnimation: FaSitePublishAnimation = {
        faId,
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

    async deletePublishAnimation(
      { commit },
      publishAnimation: FaSitePublishAnimation
    ) {
      if (publishAnimation?.faId) {
        await safeCall(
          this,
          RepoFactory.faRepo.deletePublishAnimation(this, publishAnimation.faId)
        );
      }
      commit("DELETE_PUBLISH_ANIMATION");
    },
  }
);
