import {
  PreviewFestivalTask,
  FestivalTask,
  DRAFT,
  InquiryRequest,
  Contact,
  Volunteer,
  UpdateMobilization,
  Mobilization,
  TeamMobilization,
} from "@overbookd/festival-event";
import { actionTree, mutationTree } from "typed-vuex";
import { safeCall } from "~/utils/api/calls";
import {
  AddInquiryRequestForm,
  AddMobilizationForm,
  FestivalTaskCreationForm,
  UpdateGeneralForm,
  UpdateInstructionsForm,
} from "@overbookd/http";
import { FestivalTaskRepository } from "~/repositories/festival-task.repository";
import { castTaskWithDate } from "~/utils/festival-event/festival-task/festival-task.utils";

const repo = FestivalTaskRepository;

type State = {
  tasks: {
    forAll: PreviewFestivalTask[];
  };
  selectedTask: FestivalTask;
};

const fakeTask: FestivalTask = {
  id: 0,
  status: DRAFT,
  festivalActivity: {
    id: 0,
    name: "Fake FA",
    status: DRAFT,
    timeWindows: [],
    location: null,
    hasSupplyRequest: false,
    inquiry: {
      all: [],
      timeWindows: [],
    },
  },
  general: {
    name: "Fake FA",
    administrator: {
      id: 0,
      firstname: "Fake",
      lastname: "Adherent",
    },
    team: null,
  },
  instructions: {
    contacts: [],
    appointment: null,
    global: null,
    inCharge: {
      instruction: null,
      volunteers: [],
    },
  },
  feedbacks: [],
  inquiries: [],
  history: [],
  mobilizations: [],
};

export const state = (): State => ({
  tasks: {
    forAll: [],
  },
  selectedTask: fakeTask,
});

export const mutations = mutationTree(state, {
  SET_ALL_TASKS(state, tasks: PreviewFestivalTask[]) {
    state.tasks.forAll = tasks;
  },
  SET_SELECTED_TASK(state, task: FestivalTask) {
    state.selectedTask = task;
  },
});

export const actions = actionTree(
  { state, mutations },
  {
    /* VIEW */
    async fetchAllTasks({ commit }) {
      const res = await safeCall(this, repo.getAll(this));
      if (!res) return;
      commit("SET_ALL_TASKS", res.data);
    },

    async fetchTask({ commit }, id: number) {
      const res = await safeCall(this, repo.getOne(this, id));

      if (!res?.data) return;
      const task = castTaskWithDate(res.data);
      commit("SET_SELECTED_TASK", task);
    },

    /* CREATE */
    async create({ commit, dispatch }, form: FestivalTaskCreationForm) {
      const res = await safeCall(this, repo.create(this, form));
      if (!res) return;

      const task = castTaskWithDate(res.data);
      commit("SET_SELECTED_TASK", task);
      await dispatch("fetchAllTasks");
    },

    /* REMOVE */
    async remove({ commit, dispatch }, id: FestivalTask["id"]) {
      const res = await safeCall(this, repo.remove(this, id), {
        successMessage: `FT #${id} supprimée 🗑️`,
      });
      if (!res) return;

      commit("SET_SELECTED_TASK", fakeTask);
      await dispatch("fetchAllTasks");
    },

    /* UPDATE GENERAL */
    async updateGeneral({ state, commit }, general: UpdateGeneralForm) {
      const id = state.selectedTask.id;
      const res = await safeCall(this, repo.updateGeneral(this, id, general));
      if (!res) return;

      const task = castTaskWithDate(res.data);
      commit("SET_SELECTED_TASK", task);
    },

    /* UPDATE INSTRUCTIONS */
    async updateInstructions(
      { state, commit },
      instructions: UpdateInstructionsForm,
    ) {
      const res = await safeCall(
        this,
        repo.updateInstructions(this, state.selectedTask.id, instructions),
      );
      if (!res) return;

      const task = castTaskWithDate(res.data);
      commit("SET_SELECTED_TASK", task);
    },

    async addContact({ state, commit }, contactId: Contact["id"]) {
      const res = await safeCall(
        this,
        repo.addContact(this, state.selectedTask.id, { contactId }),
      );
      if (!res) return;

      const task = castTaskWithDate(res.data);
      commit("SET_SELECTED_TASK", task);
    },

    async removeContact({ state, commit }, contactId: Contact["id"]) {
      const res = await safeCall(
        this,
        repo.removeContact(this, state.selectedTask.id, contactId),
      );
      if (!res) return;

      const task = castTaskWithDate(res.data);
      commit("SET_SELECTED_TASK", task);
    },

    async addInChargeVolunteer(
      { state, commit },
      volunteerId: Volunteer["id"],
    ) {
      const res = await safeCall(
        this,
        repo.addInChargeVolunteer(this, state.selectedTask.id, { volunteerId }),
      );
      if (!res) return;

      const task = castTaskWithDate(res.data);
      commit("SET_SELECTED_TASK", task);
    },

    async removeInChargeVolunteer(
      { state, commit },
      volunteerId: Volunteer["id"],
    ) {
      const res = await safeCall(
        this,
        repo.removeInChargeVolunteer(this, state.selectedTask.id, volunteerId),
      );
      if (!res) return;

      const task = castTaskWithDate(res.data);
      commit("SET_SELECTED_TASK", task);
    },

    /* UPDATE MOBILIZATION */
    async addMobilization(
      { state, commit },
      mobilization: AddMobilizationForm,
    ) {
      const res = await safeCall(
        this,
        repo.addMobilization(this, state.selectedTask.id, mobilization),
      );
      if (!res) return;

      const task = castTaskWithDate(res.data);
      commit("SET_SELECTED_TASK", task);
    },

    async updateMobilization(
      { state, commit },
      {
        mobilizationId,
        mobilization,
      }: {
        mobilizationId: Mobilization["id"];
        mobilization: UpdateMobilization;
      },
    ) {
      const ftId = state.selectedTask.id;
      const res = await safeCall(
        this,
        repo.updateMobilization(this, ftId, mobilizationId, mobilization),
      );
      if (!res) return;

      const task = castTaskWithDate(res.data);
      commit("SET_SELECTED_TASK", task);
    },

    async removeMobilization(
      { state, commit },
      mobilizationId: Mobilization["id"],
    ) {
      const res = await safeCall(
        this,
        repo.removeMobilization(this, state.selectedTask.id, mobilizationId),
      );
      if (!res) return;

      const task = castTaskWithDate(res.data);
      commit("SET_SELECTED_TASK", task);
    },

    async addVolunteerToMobilization(
      { state, commit },
      {
        mobilizationId,
        volunteerId,
      }: {
        mobilizationId: Mobilization["id"];
        volunteerId: Volunteer["id"];
      },
    ) {
      const ftId = state.selectedTask.id;
      const form = { volunteerId };
      const res = await safeCall(
        this,
        repo.addVolunteerToMobilization(this, ftId, mobilizationId, form),
      );
      if (!res) return;

      const task = castTaskWithDate(res.data);
      commit("SET_SELECTED_TASK", task);
    },

    async removeVolunteerFromMobilization(
      { state, commit },
      {
        mobilizationId,
        volunteerId,
      }: {
        mobilizationId: Mobilization["id"];
        volunteerId: Volunteer["id"];
      },
    ) {
      const ftId = state.selectedTask.id;
      const res = await safeCall(
        this,
        repo.removeVolunteerFromMobilization(
          this,
          ftId,
          mobilizationId,
          volunteerId,
        ),
      );
      if (!res) return;

      const task = castTaskWithDate(res.data);
      commit("SET_SELECTED_TASK", task);
    },

    async addTeamToMobilization(
      { state, commit },
      {
        mobilizationId,
        team,
      }: {
        mobilizationId: Mobilization["id"];
        team: TeamMobilization;
      },
    ) {
      const ftId = state.selectedTask.id;
      const res = await safeCall(
        this,
        repo.addTeamToMobilization(this, ftId, mobilizationId, team),
      );
      if (!res) return;

      const task = castTaskWithDate(res.data);
      commit("SET_SELECTED_TASK", task);
    },

    async removeTeamFromMobilization(
      { state, commit },
      {
        mobilizationId,
        team,
      }: {
        mobilizationId: Mobilization["id"];
        team: TeamMobilization["team"];
      },
    ) {
      const ftId = state.selectedTask.id;
      const res = await safeCall(
        this,
        repo.removeTeamFromMobilization(this, ftId, mobilizationId, team),
      );
      if (!res) return;

      const task = castTaskWithDate(res.data);
      commit("SET_SELECTED_TASK", task);
    },

    /* UPDATE INQUIRY */
    async addInquiryRequest({ state, commit }, inquiry: AddInquiryRequestForm) {
      const res = await safeCall(
        this,
        repo.addInquiryRequest(this, state.selectedTask.id, inquiry),
      );
      if (!res) return;

      const task = castTaskWithDate(res.data);
      commit("SET_SELECTED_TASK", task);
    },

    async removeInquiryRequest(
      { state, commit },
      inquirySlug: InquiryRequest["slug"],
    ) {
      const res = await safeCall(
        this,
        repo.removeInquiryRequest(this, state.selectedTask.id, inquirySlug),
      );
      if (!res) return;

      const task = castTaskWithDate(res.data);
      commit("SET_SELECTED_TASK", task);
    },
  },
);
