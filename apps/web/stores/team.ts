import {
  requirableTeams,
  requirableTeamsExtended,
} from "@overbookd/festival-event";
import type { Team } from "@overbookd/team";
import { AFFECT_VOLUNTEER } from "@overbookd/permission";
import { isHttpError } from "~/utils/http/api-fetch";

type State = {
  teams: Team[];
  faReviewers: Team[];
  ftReviewers: Team[];
};

export const useTeamStore = defineStore("team", {
  state: (): State => ({
    teams: [],
    faReviewers: [],
    ftReviewers: [],
  }),
  getters: {
    getTeamByCode:
      (state) =>
      (code: string): Team | undefined => {
        return state.teams.find((team) => team.code === code);
      },
    mobilizableTeams(state): Team[] {
      const userStore = useUserStore();
      const mobilizableTeams = userStore.can(AFFECT_VOLUNTEER)
        ? requirableTeamsExtended
        : requirableTeams;

      return state.teams.filter((team) =>
        mobilizableTeams.some((t) => t === team.code),
      );
    },
  },
  actions: {
    async fetchTeams(): Promise<void> {
      const res = await TeamRepository.getTeams();
      if (isHttpError(res)) return;
      this.teams = res;
    },

    async fetchFaReviewers(): Promise<void> {
      const res = await TeamRepository.getFaReviewers();
      if (isHttpError(res)) return;
      this.faReviewers = res;
    },

    async fetchFtReviewers(): Promise<void> {
      const res = await TeamRepository.getFtReviewers();
      if (isHttpError(res)) return;
      this.ftReviewers = res;
    },

    async createTeam(team: Team): Promise<void> {
      const res = await TeamRepository.createTeam(team);
      if (isHttpError(res)) return;
      sendSuccessNotification("Equipe créée");
      await this.fetchTeams();
    },

    async updateTeam(team: Team): Promise<void> {
      const res = await TeamRepository.updateTeam(team);
      if (isHttpError(res)) return;
      sendSuccessNotification("Equipe modifiée");
      await this.fetchTeams();
    },

    async removeTeam({ code }: Team): Promise<void> {
      const res = await TeamRepository.deleteTeam(code);
      if (isHttpError(res)) return;
      sendSuccessNotification("Equipe supprimée");
      await this.fetchTeams();
    },
  },
});
