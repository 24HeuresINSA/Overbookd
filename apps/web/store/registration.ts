import { RegisterForm } from "@overbookd/registration";
import { actionTree, mutationTree } from "typed-vuex";
import {
  EnrollableStaff,
  EnrollableVolunteer,
  HttpStringified,
} from "@overbookd/http";
import { safeCall } from "~/utils/api/calls";
import { Credentials } from "@overbookd/registration";
import { castPeriods } from "~/utils/models/period.model";
import { updateItemToList } from "@overbookd/list";
import { RegistrationRepository } from "~/repositories/registration.repository";

type State = {
  staffs: EnrollableStaff[];
  volunteers: EnrollableVolunteer[];
  inviteStaffLink?: URL;
};

export const state = (): State => ({
  staffs: [],
  volunteers: [],
  inviteStaffLink: undefined,
});

export const mutations = mutationTree(state, {
  SET_STAFFS(state, staffs: EnrollableStaff[]) {
    state.staffs = staffs;
  },
  SET_VOLUNTEERS(state, volunteers: EnrollableVolunteer[]) {
    state.volunteers = volunteers;
  },
  REMOVE_ENROLLED_NEWCOMERS(state, enrolled: EnrollableStaff[]) {
    state.staffs = state.staffs.filter(
      (staff) =>
        !enrolled.some((enrolledNewcomer) => enrolledNewcomer.id === staff.id),
    );
    state.volunteers = state.volunteers.filter(
      (volunteer) =>
        !enrolled.some(
          (enrolledNewcomer) => enrolledNewcomer.id === volunteer.id,
        ),
    );
  },
  SET_INVITE_STAFF_LINK(state, link: URL) {
    state.inviteStaffLink = link;
  },
  REMOVE_INVITE_STAFF_LINK(state) {
    state.inviteStaffLink = undefined;
  },
  UPDATE_VOLUNTEER(state, volunteer: EnrollableVolunteer) {
    const volunteerIndex = state.volunteers.findIndex(
      ({ id }) => id === volunteer.id,
    );
    if (volunteerIndex === -1) return;
    state.volunteers = updateItemToList(
      state.volunteers,
      volunteerIndex,
      volunteer,
    );
  },
});

export const actions = actionTree(
  { state },
  {
    async getStaffs({ commit }) {
      const res = await RegistrationRepository.getStaffs(this);
      if (!res) return;
      commit("SET_STAFFS", castStaffsWithDate(res.data));
    },

    async getVolunteers({ commit }) {
      const res = await RegistrationRepository.getVolunteers(this);
      if (!res) return;
      commit("SET_VOLUNTEERS", castVolunteersWithDate(res.data));
    },

    async fetchVolunteerInformation(
      { commit },
      volunteerId: EnrollableVolunteer["id"],
    ) {
      const res = await RegistrationRepository.getVolunteer(this, volunteerId);
      if (!res) return;

      commit("UPDATE_VOLUNTEER", castVolunteerWithDate(res.data));
    },

    async enrollStaffs({ commit }, staffs: EnrollableStaff[]) {
      const res = await safeCall(
        this,
        RegistrationRepository.enrollStaffs(this, staffs),
        {
          successMessage:
            "Les nouveaux arrivants sélectionnés ont bien été enrôlés en tant que hards ✅",
          errorMessage:
            "Les nouveaux arrivants sélectionnés n'ont pas pu être enrôlés ❌",
        },
      );
      if (!res) return;
      commit("REMOVE_ENROLLED_NEWCOMERS", staffs);
    },

    async enrollNewVolunteers({ commit }, volunteers: EnrollableVolunteer[]) {
      const res = await safeCall(
        this,
        RegistrationRepository.enrollNewVolunteers(this, volunteers),
        {
          successMessage:
            "Le nouvel arrivant sélectionné a bien été enrôlé en tant que soft ✅",
          errorMessage:
            "Le nouvel arrivant sélectionné n'a pas pu être enrôlé ❌",
        },
      );
      if (!res) return;
      commit("REMOVE_ENROLLED_NEWCOMERS", volunteers);
    },

    async fetchInviteStaffLink({ commit }) {
      const res = await safeCall(
        this,
        RegistrationRepository.fetchStaffLink(this),
      );
      if (!res) return;
      commit("SET_INVITE_STAFF_LINK", new URL(res.data));
    },

    async generateInviteStaffLink({ commit }) {
      const res = await safeCall(
        this,
        RegistrationRepository.generateStaffLink(this),
      );
      if (!res) return;
      commit("SET_INVITE_STAFF_LINK", new URL(res.data));
    },

    async register(_, { token, form }: { token?: string; form: RegisterForm }) {
      return safeCall(
        this,
        RegistrationRepository.registerNewcomer(this, form, token),
      );
    },

    async forgetMe(
      _,
      { credentials, token }: { credentials: Credentials; token: string },
    ) {
      await safeCall(
        this,
        RegistrationRepository.forgetMe(this, credentials, token),
        {
          successMessage:
            "Les informations liées à ce compte sont supprimées 🗑️",
        },
      );
    },

    async forgetHim({ dispatch }, email: string) {
      const res = await safeCall(
        this,
        RegistrationRepository.forgetHim(this, email),
      );
      if (!res) return;
      dispatch("getStaffs");
    },
  },
);

function castStaffsWithDate(
  staffs: HttpStringified<EnrollableStaff[]>,
): EnrollableStaff[] {
  return staffs.map((staff) => ({
    ...staff,
    registeredAt: new Date(staff.registeredAt),
  }));
}

function castVolunteersWithDate(
  volunteers: HttpStringified<EnrollableVolunteer[]>,
): EnrollableVolunteer[] {
  return volunteers.map(castVolunteerWithDate);
}
function castVolunteerWithDate(
  volunteer: HttpStringified<EnrollableVolunteer>,
): EnrollableVolunteer {
  return {
    ...volunteer,
    registeredAt: new Date(volunteer.registeredAt),
    birthdate: new Date(volunteer.birthdate),
    availabilities: castPeriods(volunteer.availabilities),
  };
}
